import { useEffect, useMemo, useState } from "react"
import { ElementView } from "@/components/canvas/ElementView"
import { ensureFontLoaded } from "@/lib/fonts"
import { TEMPLATES, type Template } from "@/lib/templates"

/** Grid of starter layouts. Each thumbnail is drawn with the editor's own renderer. */
export function TemplateGallery({ onPick }: { onPick: (template: Template) => void }) {
  // Text is measured with the loaded font, so redraw the thumbnails once fonts arrive.
  const [fontsReady, setFontsReady] = useState(0)
  const items = useMemo(
    () => TEMPLATES.map((template) => ({ template, elements: template.build() })),
    []
  )

  useEffect(() => {
    let live = true
    const fonts = TEMPLATES.flatMap((t) => t.fonts)
    for (const f of fonts) ensureFontLoaded(f.family, f.weights)
    void Promise.all(
      fonts.flatMap((f) =>
        f.weights.map((w) => document.fonts.load(`${w} 32px "${f.family}"`))
      )
    )
      .then(() => {
        if (live) setFontsReady((n) => n + 1)
      })
      .catch(() => {
        /* thumbnails keep the fallback font */
      })
    return () => {
      live = false
    }
  }, [])

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ template, elements }) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onPick(template)}
          className="group flex flex-col gap-1.5 rounded-lg border border-border p-2 text-left outline-none transition-colors hover:border-foreground/40 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <span className="flex h-28 items-center justify-center overflow-hidden rounded-md bg-muted">
            <svg
              key={fontsReady}
              viewBox={`0 0 ${template.width} ${template.height}`}
              className="h-full w-full"
              role="img"
              aria-label={`${template.name} preview`}
            >
              <rect
                width={template.width}
                height={template.height}
                fill={template.background ?? "#f4f4f5"}
              />
              {elements.map((el) => (
                <ElementView key={el.id} el={el} />
              ))}
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium">{template.name}</span>
            <span className="text-[11px] leading-snug text-muted-foreground">
              {template.description}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}
