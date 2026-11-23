import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

type Piece = {
    id: string;
    label: string;
    box: { x: number; y: number; w: number; h: number };
    delay: string;
    shape: React.ReactNode;
};

const INK = "#10241F";
const TEAL = "#0F766E";
const MINT = "#2DD4BF";
const SELECT = "#3B6BFF";

const VIEW_W = 560;
const VIEW_H = 420;
const NUDGE = 10;

const PIECES: Piece[] = [
    {
        id: "card",
        label: "rounded rectangle",
        box: { x: 52, y: 60, w: 190, h: 124 },
        delay: "0.05s",
        shape: (
            <rect x={52} y={60} width={190} height={124} rx={24} fill={TEAL} />
        ),
    },
    {
        id: "dot",
        label: "circle",
        box: { x: 338, y: 56, w: 128, h: 128 },
        delay: "0.18s",
        shape: <circle cx={402} cy={120} r={64} fill={MINT} />,
    },
    {
        id: "title",
        label: "text",
        box: { x: 60, y: 240, w: 292, h: 70 },
        delay: "0.31s",
        shape: (
            <text
                x={60}
                y={296}
                fontSize={64}
                fontWeight={700}
                fill={INK}
                style={{ fontFamily: "var(--font-display)" }}
                letterSpacing={-1.5}
            >
                Draft it.
            </text>
        ),
    },
    {
        id: "scribble",
        label: "pen stroke",
        box: { x: 370, y: 250, w: 150, h: 84 },
        delay: "0.44s",
        shape: (
            <path
                d="M 376 322 C 390 262, 414 258, 424 300 S 462 340, 476 282 S 504 258, 514 292"
                fill="none"
                stroke={INK}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
    },
];

type Offset = { x: number; y: number };

function clampOffset(piece: Piece, o: Offset): Offset {
    const { x, y, w, h } = piece.box;
    return {
        x: Math.min(Math.max(o.x, -x), VIEW_W - (x + w)),
        y: Math.min(Math.max(o.y, -y), VIEW_H - (y + h)),
    };
}

export function HeroBoard() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [offsets, setOffsets] = useState<Record<string, Offset>>({});
    const [selected, setSelected] = useState<string | null>("card");
    const [dragging, setDragging] = useState<string | null>(null);
    const drag = useRef<{
        id: string;
        start: Offset;
        origin: Offset;
    } | null>(null);

    const toSvg = (e: PointerEvent): Offset => {
        const svg = svgRef.current!;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const m = svg.getScreenCTM();
        if (!m) return { x: 0, y: 0 };
        const p = pt.matrixTransform(m.inverse());
        return { x: p.x, y: p.y };
    };

    const offsetOf = (id: string): Offset => offsets[id] ?? { x: 0, y: 0 };

    const onDown = (e: PointerEvent<SVGGElement>, piece: Piece) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setSelected(piece.id);
        setDragging(piece.id);
        drag.current = {
            id: piece.id,
            start: toSvg(e),
            origin: offsetOf(piece.id),
        };
    };

    const onMove = (e: PointerEvent<SVGGElement>, piece: Piece) => {
        const d = drag.current;
        if (!d || d.id !== piece.id) return;
        const p = toSvg(e);
        const next = clampOffset(piece, {
            x: d.origin.x + (p.x - d.start.x),
            y: d.origin.y + (p.y - d.start.y),
        });
        setOffsets((prev) => ({ ...prev, [piece.id]: next }));
    };

    const onUp = () => {
        drag.current = null;
        setDragging(null);
    };

    const onKey = (e: KeyboardEvent<SVGGElement>, piece: Piece) => {
        const step: Record<string, Offset> = {
            ArrowLeft: { x: -NUDGE, y: 0 },
            ArrowRight: { x: NUDGE, y: 0 },
            ArrowUp: { x: 0, y: -NUDGE },
            ArrowDown: { x: 0, y: NUDGE },
        };
        const s = step[e.key];
        if (!s) return;
        e.preventDefault();
        const cur = offsetOf(piece.id);
        setOffsets((prev) => ({
            ...prev,
            [piece.id]: clampOffset(piece, { x: cur.x + s.x, y: cur.y + s.y }),
        }));
    };

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="block h-auto w-full select-none"
            role="group"
            aria-label="Interactive demo board. Drag the shapes, or focus one and use the arrow keys."
        >
            <rect
                width={VIEW_W}
                height={VIEW_H}
                fill="transparent"
                onPointerDown={() => setSelected(null)}
            />
            {PIECES.map((piece) => {
                const o = offsetOf(piece.id);
                const isSel = selected === piece.id;
                const { x, y, w, h } = piece.box;
                return (
                    <g
                        key={piece.id}
                        transform={`translate(${o.x} ${o.y})`}
                        tabIndex={0}
                        role="button"
                        aria-label={`Move ${piece.label}`}
                        style={{
                            cursor: dragging === piece.id ? "grabbing" : "grab",
                            touchAction: "none",
                            outline: "none",
                        }}
                        onPointerDown={(e) => onDown(e, piece)}
                        onPointerMove={(e) => onMove(e, piece)}
                        onPointerUp={onUp}
                        onPointerCancel={onUp}
                        onFocus={() => setSelected(piece.id)}
                        onKeyDown={(e) => onKey(e, piece)}
                    >
                        <g
                            className="db-settle"
                            style={{ animationDelay: piece.delay }}
                        >
                          <g
                            className="db-lift"
                            data-lifted={dragging === piece.id}
                          >
                            {/* Transparent hit area so thin strokes are easy to grab. */}
                            <rect
                                x={x}
                                y={y}
                                width={w}
                                height={h}
                                fill="transparent"
                            />
                            {piece.shape}
                          </g>
                        </g>
                        {isSel && (
                            <g pointerEvents="none">
                                <rect
                                    x={x - 6}
                                    y={y - 6}
                                    width={w + 12}
                                    height={h + 12}
                                    fill="none"
                                    stroke={SELECT}
                                    strokeWidth={1.5}
                                />
                                {[
                                    [x - 6, y - 6],
                                    [x + w + 6, y - 6],
                                    [x - 6, y + h + 6],
                                    [x + w + 6, y + h + 6],
                                ].map(([hx, hy]) => (
                                    <rect
                                        key={`${hx}-${hy}`}
                                        x={hx - 4.5}
                                        y={hy - 4.5}
                                        width={9}
                                        height={9}
                                        fill="#fff"
                                        stroke={SELECT}
                                        strokeWidth={1.5}
                                    />
                                ))}
                            </g>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}
