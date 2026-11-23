import { useEffect } from "react";
import { HeroBoard } from "@/components/landing/HeroBoard";

const EDITOR_URL = "/app";
const CONTACT = "mailto:kuntalrathod77@gmail.com?subject=Draftboard%20Feature%20Request";

const TOOLS: { name: string; text: string }[] = [
    { name: "Text", text: "Add text, pick a font, and style it." },
    {
        name: "Shapes",
        text: "Rectangles, ellipses and more, with fills, gradients and rounded corners.",
    },
    {
        name: "Images",
        text: "Upload a file, paste from your clipboard, or search stock photos.",
    },
    { name: "Icons", text: "Pick from a library of icons and place them anywhere." },
    { name: "Lines", text: "Straight lines with arrowheads." },
    { name: "Pen", text: "Draw freehand strokes." },
];

const KEEPS: { title: string; text: string }[] = [
    {
        title: "Export",
        text: "Save as SVG, PNG, WEBP or PDF, or copy a PNG straight to your clipboard.",
    },
    {
        title: "Autosave",
        text: "Every change is saved in your browser, and your project is there when you come back.",
    },
    {
        title: "Slides",
        text: "Add artboards and step through them in presenter mode.",
    },
];

const PAPER = "#F1F5F4";
const INK = "#10241F";
const TEAL = "#0F766E";
const MINT = "#2DD4BF";

function OpenButton({ onInk = false }: { onInk?: boolean }) {
    return (
        <a
            href={EDITOR_URL}
            className="inline-flex h-12 items-center rounded-md px-6 font-display text-base font-semibold transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B6BFF]"
            style={
                onInk
                    ? { background: MINT, color: INK }
                    : { background: INK, color: PAPER }
            }
        >
            Open Draftboard
        </a>
    );
}

export function Landing() {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("dark");
        root.style.colorScheme = "light";
    }, []);

    return (
        <div
            className="min-h-screen font-sans"
            style={{ background: PAPER, color: INK }}
        >
            <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
                <a href="/" className="flex items-center gap-2.5">
                    <img src="/favicon.svg" alt="" className="size-8" />
                    <span className="font-display text-xl font-bold tracking-tight">
                        Draftboard
                    </span>
                </a>
                <a
                    href={EDITOR_URL}
                    className="text-sm font-medium underline decoration-[#10241F]/30 underline-offset-4 hover:decoration-[#10241F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B6BFF]"
                >
                    Open editor
                </a>
            </header>

            <main>
                <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-6 pb-16 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:pt-14 lg:pb-24">
                    <div>
                        <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
                            Draft graphics on an endless grid.
                        </h1>
                        <p className="mt-6 max-w-md text-lg leading-relaxed text-[#10241F]/75">
                            Draftboard is a free vector editor that runs in your
                            browser. Place text, shapes, images and icons, then
                            export. There is no account and nothing is uploaded.
                        </p>
                        <div className="mt-8">
                            <OpenButton />
                        </div>
                    </div>

                    <div>
                        <div
                            className="rounded-sm border"
                            style={{
                                borderColor: "rgba(16,36,31,0.25)",
                                background: "#FAFCFB",
                                backgroundImage:
                                    "radial-gradient(circle, rgba(16,36,31,0.22) 1.2px, transparent 1.4px)",
                                backgroundSize: "24px 24px",
                            }}
                        >
                            <HeroBoard />
                        </div>
                        <p className="mt-3 text-sm text-[#10241F]/65">
                            Drag the shapes. The editor works the same way, with
                            handles to resize and rotate.
                        </p>
                    </div>
                </section>

                <section
                    className="border-t"
                    style={{ borderColor: "rgba(16,36,31,0.2)" }}
                >
                    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14 lg:py-24">
                        <div className="lg:sticky lg:top-12 lg:self-start">
                            <h2 className="font-display text-4xl leading-tight font-bold tracking-[-0.02em] sm:text-5xl">
                                Six tools on one canvas.
                            </h2>
                            <img
                                src="/draftboard-hero.svg"
                                alt="An isometric drafting board with a pinned sheet, a teal shape with selection handles, a T-square and a floating pencil."
                                width={720}
                                height={520}
                                loading="lazy"
                                className="mt-8 -ml-4 w-full max-w-md lg:max-w-none"
                            />
                        </div>
                        <dl>
                            {TOOLS.map((tool) => (
                                <div
                                    key={tool.name}
                                    className="group grid gap-1 border-b py-5 transition-colors duration-200 first:pt-0 hover:border-[#0F766E] motion-reduce:transition-none sm:grid-cols-[9rem_1fr] sm:gap-6"
                                    style={{ borderColor: "rgba(16,36,31,0.2)" }}
                                >
                                    <dt className="font-display text-2xl font-semibold transition-transform duration-200 group-hover:translate-x-1.5 group-hover:text-[#0F766E] motion-reduce:transform-none motion-reduce:transition-none">
                                        {tool.name}
                                    </dt>
                                    <dd className="max-w-prose text-base leading-relaxed text-[#10241F]/75">
                                        {tool.text}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <section style={{ background: INK, color: PAPER }}>
                    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
                        <h2 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-6xl">
                            Your work stays on your device.
                        </h2>
                        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
                            {KEEPS.map((item, i) => (
                                <div
                                    key={item.title}
                                    className={`group ${
                                        i > 0
                                            ? "md:border-l md:pl-8"
                                            : "md:pr-8"
                                    }`}
                                    style={{
                                        borderColor: "rgba(241,245,244,0.25)",
                                    }}
                                >
                                    <h3
                                        className="font-display text-2xl font-semibold"
                                        style={{ color: MINT }}
                                    >
                                        {item.title}
                                    </h3>
                                    <span
                                        aria-hidden="true"
                                        className="mt-2 block h-0.5 w-6 origin-left scale-x-100 transition-[width] duration-300 group-hover:w-14 motion-reduce:transition-none"
                                        style={{ background: MINT }}
                                    />
                                    <p className="mt-2 max-w-xs text-base leading-relaxed text-[#F1F5F4]/80">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-14">
                            <OpenButton onInk />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm sm:px-8">
                <span className="flex items-center gap-2">
                    <img src="/favicon.svg" alt="" className="size-5" />
                    <span className="font-display font-semibold">
                        Draftboard
                    </span>
                </span>
                <nav className="flex gap-6" style={{ color: TEAL }}>
                    <a
                        href="/privacy"
                        className="underline underline-offset-4 hover:opacity-80"
                    >
                        Privacy
                    </a>
                    <a
                        href={CONTACT}
                        className="underline underline-offset-4 hover:opacity-80"
                    >
                        Feature request
                    </a>
                </nav>
            </footer>
        </div>
    );
}
