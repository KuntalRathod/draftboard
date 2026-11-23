import { uid } from "./id"
import type {
  Element,
  GradientFill,
  IconElement,
  LineElement,
  ShapeElement,
  ShapeKind,
  TextElement,
} from "./types"

export interface TemplateFont {
  family: string
  weights: number[]
}

export interface Template {
  id: string
  name: string
  description: string
  width: number
  height: number
  /** Canvas fill. `null` keeps the theme surface. */
  background: string | null
  fonts: TemplateFont[]
  /** Builds fresh elements (new ids) each time it is called. */
  build: () => Element[]
}

// ---------- element helpers ----------

const BASE = { rotation: 0, opacity: 1, shadow: null } as const

interface TextOptions {
  size: number
  color: string
  weight?: number
  font?: string
  align?: TextElement["align"]
  lineHeight?: number
  /** Number of lines, used for the box height. */
  lines?: number
}

function text(x: number, y: number, width: number, value: string, o: TextOptions): TextElement {
  const lineHeight = o.lineHeight ?? 1.2
  const lines = o.lines ?? value.split("\n").length
  return {
    ...BASE,
    id: uid(),
    type: "text",
    text: value,
    x,
    y,
    width,
    height: o.size * lineHeight * lines,
    fontFamily: o.font ?? "Inter",
    fontSize: o.size,
    fontWeight: o.weight ?? 400,
    color: o.color,
    align: o.align ?? "left",
    lineHeight,
    stroke: "#000000",
    strokeWidth: 0,
  }
}

interface ShapeOptions {
  fill: string
  kind?: ShapeKind
  radius?: number
  opacity?: number
  gradient?: GradientFill | null
}

function shape(x: number, y: number, width: number, height: number, o: ShapeOptions): ShapeElement {
  return {
    ...BASE,
    opacity: o.opacity ?? 1,
    id: uid(),
    type: "shape",
    shape: o.kind ?? "rect",
    x,
    y,
    width,
    height,
    fill: o.fill,
    gradient: o.gradient ?? null,
    stroke: o.fill,
    strokeWidth: 0,
    filled: true,
    radius: o.radius ?? 0,
  }
}

function icon(name: string, x: number, y: number, size: number, color: string, strokeWidth = 2): IconElement {
  return {
    ...BASE,
    id: uid(),
    type: "icon",
    x,
    y,
    width: size,
    height: size,
    lib: "lucide",
    name,
    color,
    strokeWidth,
    rounded: true,
  }
}

function line(x1: number, y1: number, x2: number, y2: number, color: string, strokeWidth: number): LineElement {
  return {
    ...BASE,
    id: uid(),
    type: "line",
    x1,
    y1,
    x2,
    y2,
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
    strokeWidth,
    color,
    arrowStart: false,
    arrowEnd: false,
    rounded: true,
  }
}

// ---------- palette ----------

const INK = "#10241F"
const PAPER = "#F1F5F4"
const TEAL = "#0F766E"
const MINT = "#2DD4BF"
const SOFT = "#CFEDE8"

// ---------- templates ----------

export const TEMPLATES: Template[] = [
  {
    id: "quote-card",
    name: "Quote card",
    description: "Square post for a quote or a short thought.",
    width: 1080,
    height: 1080,
    background: INK,
    fonts: [
      { family: "Playfair Display", weights: [700] },
      { family: "Inter", weights: [500] },
    ],
    build: () => [
      shape(720, 660, 400, 400, { fill: TEAL, kind: "ellipse", opacity: 0.4 }),
      icon("Quote", 96, 96, 120, MINT, 1.5),
      text(96, 290, 888, "Make something people want to look at twice.", {
        size: 88,
        weight: 700,
        font: "Playfair Display",
        color: PAPER,
        lineHeight: 1.2,
        lines: 3,
      }),
      line(96, 790, 256, 790, MINT, 6),
      text(96, 830, 700, "Your name here", { size: 40, weight: 500, color: "#9CC9C1" }),
    ],
  },
  {
    id: "video-thumbnail",
    name: "Video thumbnail",
    description: "Bold 16:9 cover with big type.",
    width: 1280,
    height: 720,
    background: "#FFD84D",
    fonts: [
      { family: "Bebas Neue", weights: [400] },
      { family: "Inter", weights: [800] },
    ],
    build: () => [
      shape(780, 60, 600, 600, { fill: INK, kind: "ellipse" }),
      icon("Play", 960, 240, 240, "#FFD84D", 2),
      text(72, 100, 680, "BIG\nIDEA", {
        size: 230,
        font: "Bebas Neue",
        color: INK,
        lineHeight: 0.95,
      }),
      shape(72, 556, 360, 72, { fill: INK, radius: 36 }),
      text(72, 572, 360, "WATCH NOW", {
        size: 34,
        weight: 800,
        color: "#FFD84D",
        align: "center",
      }),
    ],
  },
  {
    id: "announcement",
    name: "Announcement",
    description: "Square post for news or a launch.",
    width: 1080,
    height: 1080,
    background: PAPER,
    fonts: [
      { family: "Montserrat", weights: [800] },
      { family: "Inter", weights: [500, 700] },
    ],
    build: () => [
      shape(90, 90, 900, 900, { fill: TEAL, kind: "ellipse" }),
      shape(640, 120, 300, 300, { fill: MINT, kind: "ellipse" }),
      icon("Sparkles", 160, 160, 110, PAPER, 1.6),
      text(150, 420, 780, "Now live", { size: 150, weight: 800, font: "Montserrat", color: PAPER }),
      text(150, 640, 700, "Say what is new in one clear line.", {
        size: 46,
        weight: 500,
        color: SOFT,
        lines: 2,
      }),
      shape(150, 800, 300, 84, { fill: PAPER, radius: 42 }),
      text(150, 818, 300, "Learn more", {
        size: 40,
        weight: 700,
        color: TEAL,
        align: "center",
      }),
    ],
  },
  {
    id: "story-poster",
    name: "Story poster",
    description: "Tall 9:16 layout for stories and flyers.",
    width: 1080,
    height: 1920,
    background: INK,
    fonts: [
      { family: "Bebas Neue", weights: [400] },
      { family: "Montserrat", weights: [700] },
      { family: "Inter", weights: [400, 800] },
    ],
    build: () => [
      shape(0, 0, 1080, 1920, {
        fill: TEAL,
        gradient: {
          type: "linear",
          angle: 90,
          stops: [
            { offset: 0, color: TEAL },
            { offset: 1, color: INK },
          ],
        },
      }),
      icon("Star", 80, 120, 100, MINT, 1.6),
      text(80, 320, 920, "WEEKEND\nSALE", {
        size: 300,
        font: "Bebas Neue",
        color: PAPER,
        lineHeight: 0.9,
      }),
      line(80, 940, 1000, 940, MINT, 8),
      text(80, 1000, 920, "Up to 40% off", { size: 100, weight: 700, font: "Montserrat", color: MINT }),
      text(80, 1150, 800, "Friday to Sunday, in store and online.", {
        size: 52,
        color: SOFT,
        lines: 2,
      }),
      shape(80, 1560, 420, 120, { fill: MINT, radius: 60 }),
      text(80, 1589, 420, "Shop now", {
        size: 52,
        weight: 800,
        color: INK,
        align: "center",
      }),
    ],
  },
  {
    id: "title-slide",
    name: "Title slide",
    description: "Clean 16:9 opener for a presentation.",
    width: 1280,
    height: 720,
    background: "#FFFFFF",
    fonts: [
      { family: "Space Grotesk", weights: [700] },
      { family: "Inter", weights: [400] },
    ],
    build: () => [
      shape(940, 380, 420, 420, { fill: MINT, kind: "ellipse", opacity: 0.3 }),
      shape(1020, 110, 200, 200, { fill: TEAL, kind: "ellipse", opacity: 0.2 }),
      shape(0, 0, 48, 720, { fill: TEAL }),
      text(140, 190, 860, "Project title goes here", {
        size: 96,
        weight: 700,
        font: "Space Grotesk",
        color: INK,
        lineHeight: 1.1,
        lines: 2,
      }),
      line(140, 440, 300, 440, TEAL, 6),
      text(140, 480, 800, "Subtitle or presenter name", { size: 40, color: "#4B635E" }),
    ],
  },
  {
    id: "profile-banner",
    name: "Profile banner",
    description: "Wide header for a profile or a page.",
    width: 1584,
    height: 396,
    background: INK,
    fonts: [
      { family: "Poppins", weights: [700] },
      { family: "Inter", weights: [400] },
    ],
    build: () => [
      text(96, 90, 900, "Your Name", { size: 92, weight: 700, font: "Poppins", color: PAPER }),
      text(96, 214, 900, "Designer, developer, maker.", { size: 40, color: MINT }),
      line(96, 310, 296, 310, MINT, 6),
      icon("PenTool", 1100, 150, 92, "#9CC9C1", 1.5),
      icon("Code", 1230, 150, 92, "#9CC9C1", 1.5),
      icon("Camera", 1360, 150, 92, "#9CC9C1", 1.5),
    ],
  },
]
