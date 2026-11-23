import { db, saveProjectSnapshot } from "./db";
import { uid } from "./id";
import { useDoc } from "@/store/useDoc";
import { useUI } from "@/store/useUI";
import type { ProjectRecord } from "./types";
import { makeArtboard, normalizeArtboard } from "./artboard";
import { ensureFontLoaded } from "./fonts";
import type { Template } from "./templates";

const LAST_KEY = "draftboard-last-project";

export function makeProject(name = "Untitled"): ProjectRecord {
    const now = Date.now();
    return {
        id: uid("proj"),
        name,
        elements: [],
        camera: { x: 0, y: 0, zoom: 1 },
        artboard: makeArtboard(),
        createdAt: now,
        updatedAt: now,
    };
}

export async function openProject(
    id: string,
): Promise<ProjectRecord | undefined> {
    // Switching projects cancels the pending autosave debounce, so flush the
    // current document first or the last few edits are lost.
    const current = useDoc.getState();
    if (current.projectId && current.projectId !== id) {
        await saveProjectSnapshot(current.projectId, {
            name: current.projectName,
            elements: current.elements,
            camera: current.camera,
            artboard: current.artboard,
        }).catch(() => {
            /* keep switching even if the flush fails */
        });
    }
    const record = await db.projects.get(id);
    if (!record) return undefined;
    localStorage.setItem(LAST_KEY, id);
    useUI.getState().clearSelection();
    useUI.getState().setEditingText(null);
    useUI.getState().setTool("select");
    useDoc.getState().setProject({
        projectId: record.id,
        projectName: record.name,
        elements: record.elements,
        camera: record.camera,
        artboard: normalizeArtboard(record.artboard),
    });
    return record;
}

export async function createAndOpenProject(
    name = "Untitled",
): Promise<ProjectRecord> {
    const record = makeProject(name);
    await db.projects.put(record);
    await openProject(record.id);
    return record;
}

/** Create a project pre-filled from a template, framed in the viewport. */
export async function createProjectFromTemplate(
    template: Template,
): Promise<ProjectRecord> {
    for (const font of template.fonts)
        ensureFontLoaded(font.family, font.weights);
    const record = makeProject(template.name);
    const artboard = {
        ...makeArtboard(),
        enabled: true,
        x: 0,
        y: 0,
        width: template.width,
        height: template.height,
        background: template.background,
    };
    // Same framing as "Fit to view": breathing room on every side.
    const pad = 64;
    const zoom = Math.min(
        8,
        Math.max(
            0.05,
            Math.min(
                (window.innerWidth - pad * 2) / template.width,
                (window.innerHeight - pad * 2) / template.height,
            ),
        ),
    );
    record.elements = template.build();
    record.artboard = artboard;
    record.camera = {
        zoom,
        x: window.innerWidth / 2 - (template.width / 2) * zoom,
        y: window.innerHeight / 2 - (template.height / 2) * zoom,
    };
    await db.projects.put(record);
    await openProject(record.id);
    return record;
}
export async function renameProject(id: string, name: string): Promise<void> {
    await db.projects.update(id, { name, updatedAt: Date.now() });
    if (useDoc.getState().projectId === id)
        useDoc.getState().setProjectName(name);
}

export async function removeProject(id: string): Promise<void> {
    await db.transaction("rw", db.projects, db.assets, async () => {
        await db.projects.delete(id);
        await db.assets.where("projectId").equals(id).delete();
    });
    if (localStorage.getItem(LAST_KEY) === id)
        localStorage.removeItem(LAST_KEY);
    if (useDoc.getState().projectId === id) {
        const next = await db.projects.orderBy("updatedAt").reverse().first();
        if (next) await openProject(next.id);
        else await createAndOpenProject();
    }
}

export async function bootstrapProject(): Promise<void> {
    const lastId = localStorage.getItem(LAST_KEY);
    if (lastId) {
        const opened = await openProject(lastId);
        if (opened) return;
    }
    const existing = await db.projects.orderBy("updatedAt").reverse().first();
    if (existing) {
        await openProject(existing.id);
        return;
    }
    await createAndOpenProject();
}
