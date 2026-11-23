<div align="center">

# 🎨 Draftboard

**A free, in-browser vector design editor.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

</div>


Draftboard is a free vector design editor that runs in the browser. Place text,
images, shapes, icons, lines and freehand strokes on an infinite dot-grid canvas,
then export the result as SVG, PNG, WEBP or PDF, or copy a PNG to the clipboard.

There is no account and nothing is uploaded. Projects are saved in your browser
(IndexedDB) and reopen where you left off.

🌐 **Live demo:** coming soon · 📦 **Source:** coming soon

## ✨ Features

- 🖼️ **Infinite canvas** with an adaptive dot grid. Pan with Space or the middle
  mouse button, zoom with Ctrl/⌘ + scroll, the zoom buttons, or Fit to view.
  Pinch to zoom on touch screens.
- 🛠️ **Six tools**: Text, Image, Line, Shape, Icon and Pen (pen, highlighter and
  eraser variants).
- 🖱️ **Select and transform**: click or marquee-select, then move, resize with
  eight handles, and rotate. Shift constrains (uniform scale, 45° lines, 15°
  rotation) and Alt scales from the center.
- 🔷 **Shapes** (rectangle, ellipse, triangle, diamond, star, hexagon) with fills,
  gradients, shadows and corner radius.
- 📷 **Images** from a file, drag and drop, paste, or stock photo search.
- 🎯 **Icons** from Lucide and Google Material Symbols.
- 📚 **Layers, undo/redo, snapping guides and grouping.**
- 🎞️ **Artboards and slides** with a presenter mode.
- 📤 **Export** to SVG, PNG, WEBP, PDF or the clipboard, on a theme, transparent,
  white or black background. Fonts and images are embedded in the output.
- 🌗 **Light and dark themes** and a responsive layout for small screens.

## ⌨️ Keyboard shortcuts

| Shortcut                            | Action                                            |
| ----------------------------------- | ------------------------------------------------- |
| `V` `T` `I` `L` `R` `O` `P`         | Select / Text / Image / Line / Shape / Icon / Pen |
| `P` (repeated)                      | Cycle pen, highlighter, eraser                    |
| `E`                                 | Eraser                                            |
| `Ctrl/⌘ + Z` / `Shift + Ctrl/⌘ + Z` | Undo / redo                                       |
| `Ctrl/⌘ + D`                        | Duplicate                                         |
| `Ctrl/⌘ + A`                        | Select all                                        |
| `Ctrl/⌘ + C` / `Ctrl/⌘ + V`         | Copy / paste                                      |
| `Ctrl/⌘ + =` / `-` / `0`            | Zoom in / out / reset                             |
| `Delete` / `Backspace`              | Delete selection                                  |
| `Esc`                               | Exit text editing, then clear selection           |
| Arrow keys                          | Nudge (hold `Shift` for a larger step)            |
| Space (hold)                        | Pan                                               |

## 🧰 Tech stack

- ⚛️ **Framework:** React 19 and TypeScript, built with Vite
- 🖌️ **Rendering:** custom SVG renderer and pointer-event interaction layer
- 🧠 **State:** Zustand
- 💾 **Storage:** Dexie (IndexedDB)
- 🎭 **UI:** Tailwind CSS v4 and shadcn/ui (Base UI)
- 📦 **Export:** native SVG serialization, canvas for raster formats, jsPDF for PDF
- ▲ **Hosting:** Vercel, with serverless functions for stock photo search and analytics

## 🚀 Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check and build to dist/
npm run preview  # preview the production build
```

Routes: `/` is the landing page, `/app` is the editor, and `/privacy` is the
privacy policy.

### 🔑 Environment variables

Copy `.env.example` to `.env` and fill in what you need. Nothing is required to
run the editor itself.

| Variable                                          | Needed for                                  |
| ------------------------------------------------- | ------------------------------------------- |
| `PIXABAY_KEY`                                     | Stock photo search (`/api/pixabay`)         |
| `ANALYTICS_PASSWORD`                              | Signing in to the `/analytics` dashboard    |
| `ANALYTICS_SESSION_SECRET`                        | Optional, signs the dashboard session       |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Analytics storage in production        |

⚠️ Never commit `.env`. It is already in `.gitignore`.

## ☁️ Deployment

The app is a static single-page app plus a few serverless functions, so it
deploys to [Vercel](https://vercel.com) with the included `vercel.json`. Import
the repository, set the environment variables above in the project settings, and
Vercel runs `npm run build` and serves `dist/`.

## 📊 Analytics and privacy

Draftboard includes a small first-party analytics system with no third-party
scripts, cookies or stored IP addresses. It counts pageviews, sessions,
referrers and rough device and country information. The dashboard is at
`/analytics` and requires `ANALYTICS_PASSWORD`. In development, events are
written to `.data/analytics-dev.json` and no Redis is needed. The `/privacy` page
describes what is collected.
