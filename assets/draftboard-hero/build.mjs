// Landing-page asset: a drafting board. A pinned sheet with a dot grid carries a filled shape
// with selection handles, a circle and a pen stroke, the same things the editor draws. A
// T-square drifts across the sheet and a pencil floats above it.
//
//   node assets/draftboard-hero/build.mjs  ->  public/draftboard-hero.svg (+ preview html)
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const KIT = "../../.agents/skills/anatomy-asset/kit";
const k = await import(`${KIT}/iso-kit.mjs`);
const a = await import(`${KIT}/asset.mjs`);
const G = await import(`${KIT}/lathe.mjs`);
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../public");

const PAPER = "#F1F5F4";
const BRAND = "#0F9F8E";
const W = 720;
const H = 520;
const REGION = { x: 16, y: 16, w: W - 32, h: H - 32 };

// ---------- world ----------
const BOARD = { x: -180, y: -130, w: 360, d: 260, r: 6 };
const BOARD_H = 14;
const FOOT_H = 6;
const SHEET = { x: -150, y: -105, w: 300, d: 210, r: 1 };
const SZ = BOARD_H; // sheet bottom
const TOP = BOARD_H + 0.8; // sheet top
const INK_Z = TOP + 0.7;
const HEAD = { x: -200, y: -118, w: 18, d: 236, r: 2 };

const P = a.fitInto(
  [
    ...k.boxCorners(BOARD, -FOOT_H, BOARD_H),
    ...k.boxCorners(HEAD, 0, 26),
    [30, 10, 48],
  ],
  REGION,
  { pad: 6, azimuth: 45 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const depth = ([x, y, z = 0]) => k.depthOf([x, y, z], P);
const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
const accent = (svg) => `<g class="ac-brand">${svg}</g>`;

// ---------- base: halo, feet, board ----------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BOARD, -8), -FOOT_H, 4, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BOARD, 22))) {
    out.push(S(k.cylinder(x, y, 9, -FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 7.4, -FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  return out.join("");
}

function board() {
  const out = [];
  out.push(S(k.slabOf(BOARD, 0, BOARD_H, P, 6, 1.2), { tone: "mid", inner: L(k.sideSeam(BOARD, 5, P, 6), { tone: "faint" }) }));
  // edge groove and brass corner caps
  out.push(L(k.planOutline(k.insetPlan(BOARD, 4), BOARD_H, P, 6), { tone: "faint" }));
  for (const [x, y] of byDepth(k.corners(BOARD, 0), (c) => [c[0], c[1]])) {
    const cap = { x: x - (x < 0 ? 0 : 16), y: y - (y < 0 ? 0 : 16), w: 16, d: 16, r: 2 };
    out.push(S(k.slabOf(cap, BOARD_H, 1.4, P, 3, 0.4), { tone: "hi" }));
    out.push(D([at([cap.x + 8, cap.y + 8, BOARD_H + 1.4])], { size: 0.55 }));
  }
  return out.join("");
}

// ---------- sheet and what is drawn on it ----------
function sheet() {
  const out = [S(k.slabOf(SHEET, SZ, 0.8, P, 2), { tone: "hi", crease: "none" })];
  out.push(L(k.planOutline(k.insetPlan(SHEET, 5), TOP, P, 2), { tone: "faint" }));
  out.push(D(k.dotGrid(SHEET.x + 15, SHEET.y + 15, 15, 10, 20, TOP, P), { size: 0.5, tone: "lo" }));
  return out.join("");
}

const RECT = { x: -124, y: -84, w: 84, d: 54, r: 12 };
const DISC = { x: 28, y: -58, r: 30 };

function shapes() {
  const out = [];
  // filled rounded rectangle, with the editor's selection box and four handles
  out.push(accent(S(k.slabOf(RECT, TOP, 1.4, P, 6, 0.4), { tone: "hi" })));
  const box = k.insetPlan(RECT, -7);
  out.push(accent(L(k.planOutline({ ...box, r: 0 }, TOP + 1.4, P, 1), { tone: "lit" })));
  for (const [x, y] of byDepth(
    [
      [box.x, box.y],
      [box.x + box.w, box.y],
      [box.x, box.y + box.d],
      [box.x + box.w, box.y + box.d],
    ],
    (c) => [c[0], c[1]],
  )) {
    out.push(S(k.slabOf({ x: x - 3.4, y: y - 3.4, w: 6.8, d: 6.8, r: 0.8 }, TOP + 1.4, 1.2, P, 2), { tone: "hi", lit: true }));
  }
  // disc
  out.push(accent(S(k.cylinder(DISC.x, DISC.y, DISC.r, TOP, 1.4, P, 56, 0.4), { tone: "hi" })));
  out.push(accent(L(k.ring(DISC.x, DISC.y, DISC.r - 5, TOP + 1.4, P, 48), { tone: "lo" })));
  // freehand pen stroke
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push([-128 + t * 150, -2 + Math.sin(t * Math.PI * 3) * 11 * (1 - t * 0.3)]);
  }
  out.push(L(k.onTop(pts, INK_Z, P), { tone: "hi", free: true }));
  // ruler-style dimension line under the disc
  out.push(L(k.lineOnTop([DISC.x - DISC.r, -12], [DISC.x + DISC.r, -12], INK_Z, P), { tone: "lo", free: true }));
  out.push(L(k.lineOnTop([DISC.x - DISC.r, -16], [DISC.x - DISC.r, -8], INK_Z, P), { tone: "lo", free: true }));
  out.push(L(k.lineOnTop([DISC.x + DISC.r, -16], [DISC.x + DISC.r, -8], INK_Z, P), { tone: "lo", free: true }));
  return out.join("");
}

// ---------- set square ----------
function setSquare() {
  const tri = [[76, -98], [144, -98], [76, -22]];
  const inner = [[84, -90], [130, -90], [84, -38]];
  const out = [S(k.extrude(tri, TOP, 1.8, P, { convex: true, bevel: 0.5 }), { tone: "mid" })];
  out.push(L(k.onTop(inner, TOP + 1.8, P, true), { tone: "faint" }));
  const t = k.topTicks(80, 138, 3, 5, -97, TOP + 1.8, [1.4, 2.6], P, "x");
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  return out.join("");
}

// ---------- pins ----------
function pins() {
  const out = [];
  const spots = k.corners(SHEET, 8);
  for (const [x, y] of byDepth(spots, (c) => [c[0], c[1]])) {
    out.push(S(k.cylinder(x, y, 4, TOP, 1, P, 20), { tone: "lo" }));
    out.push(accent(S(k.cylinder(x, y, 2.6, TOP + 1, 3.2, P, 20, 0.3), { tone: "hi" })));
    out.push(D([at([x, y, TOP + 4.2])], { size: 0.4, tone: "hi" }));
  }
  return out.join("");
}

// ---------- eraser ----------
function eraser() {
  const plan = { x: 96, y: 72, w: 36, d: 18, r: 2 };
  const out = [S(k.slabOf(plan, TOP, 8, P, 3, 0.5), { tone: "hi" })];
  out.push(accent(S(k.slabOf({ x: plan.x + 22, y: plan.y - 0.4, w: 14.4, d: 18.8, r: 2 }, TOP, 8.4, P, 3, 0.5), { tone: "mid" })));
  out.push(L(k.sideSeam(plan, 4, P, 3), { tone: "faint", free: true }));
  return out.join("");
}

// ---------- T-square: head against the board's left edge, blade across the sheet ----------
const BLADE = { x: -182, y: 38, w: 296, d: 12, r: 1 };
function tsquareHead() {
  const out = [S(k.slabOf(HEAD, 0, 24, P, 3, 0.8), { tone: "mid", inner: L(k.sideSeam(HEAD, 12, P, 3), { tone: "faint" }) })];
  out.push(L(k.planOutline(k.insetPlan(HEAD, 3), 24, P, 3), { tone: "faint" }));
  out.push(D([at([HEAD.x + 9, HEAD.y + 14, 24]), at([HEAD.x + 9, HEAD.y + HEAD.d - 14, 24])], { size: 0.55 }));
  return out.join("");
}
function tsquareBlade() {
  const z = TOP;
  const out = [S(k.slabOf(BLADE, z, 2.4, P, 2, 0.4), { tone: "hi" })];
  const t = k.topTicks(-176, 108, 4, 5, BLADE.y, z + 2.4, [1.6, 3], P, "x");
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([108, BLADE.y + 8, z + 2.4]), at([-176, BLADE.y + 8, z + 2.4])], { size: 0.5 }));
  return out.join("");
}

// ---------- pencil, floating above the sheet ----------
function pencil() {
  const z0 = TOP + 22;
  const F = G.frameAlong([-26, 14, z0], [1, 0, 0]);
  const body = S(G.solidOf([[16, 3.6], [88, 3.6]], F, P), { tone: "hi" });
  const tip = S(G.solidOf([[0, 0], [16, 3.6]], F, P), { tone: "mid" });
  const lead = accent(S(G.solidOf([[0, 0], [4.4, 1.2]], F, P), { tone: "hi" }));
  const ferrule = S(G.solidOf([[88, 3.9], [98, 3.9]], F, P), { tone: "lo" });
  const rubber = accent(S(G.solidOf([[98, 3.6], [108, 3.6]], F, P), { tone: "hi" }));
  const halo = `<path class="iso-halo" d="${k.haloOf({ x: -26, y: 10, w: 108, d: 8, r: 3 }, TOP, 0.1, P)}" style="filter:blur(5px)"/>`;
  return a.amFloat([tip, lead, body, ferrule, rubber].join(""), P, { rise: 5, period: 5200, halo });
}

// ---------- assemble ----------
const body = [
  tsquareHead(),
  base(),
  board(),
  sheet(),
  shapes(),
  setSquare(),
  pins(),
  eraser(),
  a.amSlide(tsquareBlade(), [0, 22, 0], P, { period: 9000, delay: 0 }),
  pencil(),
].join("");

const name = "draftboard-hero";
const svg = a.assetSvg({
  width: W,
  height: H,
  label:
    "An isometric drafting board with a pinned dot-grid sheet showing a teal rounded rectangle with selection handles, a teal circle and a pen stroke, a T-square that slides across it and a pencil floating above.",
  body,
  paper: PAPER,
  accents: { brand: BRAND },
  weight: 0.7,
  id: name,
});
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `${name}.svg`), svg);
writeFileSync(join(HERE, `${name}.html`), a.previewHtml({ title: name, svg, paper: PAPER, width: W, safe: { x: 0, y: 0, w: 0, h: 0 } }));
console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
