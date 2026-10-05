import { useCallback, useEffect, useRef, useState } from "react";
import "./connect-dots.css";

const VB_W = 400;
const VB_H = 280;
const HIT_R = 24; // snap radius in SVG units

type Pt = { x: number; y: number };
type Dot = Pt & { heart: boolean };

// First 5 are the heart; rest are decoys tucked in the corners.
const DOTS: Dot[] = [
  { x: 200, y: 212, heart: true  }, // 0  tip
  { x: 134, y: 158, heart: true  }, // 1  lower-left
  { x: 150, y:  88, heart: true  }, // 2  left peak
  { x: 250, y:  88, heart: true  }, // 3  right peak
  { x: 266, y: 158, heart: true  }, // 4  lower-right
  { x:  58, y:  64, heart: false }, // 5  decoy — far top-left
  { x: 344, y:  68, heart: false }, // 6  decoy — far top-right
  { x:  52, y: 238, heart: false }, // 7  decoy — far bottom-left
  { x: 356, y: 234, heart: false }, // 8  decoy — far bottom-right
];

// All valid heart edges (sorted "lo-hi" key)
const HEART_EDGES = new Set(["0-1", "1-2", "2-3", "3-4", "0-4"]);

function eKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join("-");
}

export default function ConnectDots({ onDone, onSolved }: { onDone: () => void; onSolved?: () => void }) {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [active,    setActive]    = useState<number | null>(null);
  const [cursor,    setCursor]    = useState<Pt | null>(null);
  const [wrongDot,  setWrongDot]  = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);
  const [done,      setDone]      = useState(false);
  const [exiting,   setExiting]   = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  // parent callbacks change identity on re-render; keep the exit timers stable
  const cbs = useRef({ onDone, onSolved });
  cbs.current = { onDone, onSolved };

  // Auto-exit once the heart is complete
  useEffect(() => {
    if (!done) return;
    let t2: ReturnType<typeof setTimeout>;
    const t = setTimeout(() => {
      setExiting(true);
      cbs.current.onSolved?.();
      t2 = setTimeout(() => cbs.current.onDone(), 750);
    }, 950);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [done]);

  // ── coordinate helpers ──────────────────────────────────────

  function toSVG(clientX: number, clientY: number): Pt | null {
    const el = svgRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width)  * VB_W,
      y: ((clientY - r.top)  / r.height) * VB_H,
    };
  }

  function nearest(pt: Pt, exclude?: number): number | null {
    const i = DOTS.findIndex((d, idx) =>
      idx !== exclude && Math.hypot(pt.x - d.x, pt.y - d.y) < HIT_R
    );
    return i >= 0 ? i : null;
  }

  // ── reset with gentle animation ─────────────────────────────

  const softReset = useCallback((badIdx?: number) => {
    if (badIdx !== undefined) setWrongDot(badIdx);
    setActive(null);
    setCursor(null);
    setResetting(true);
    setTimeout(() => {
      setConnected(new Set());
      setWrongDot(null);
      setResetting(false);
    }, 520);
  }, []);

  // ── pointer handlers on the SVG ─────────────────────────────

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (done || resetting) return;
    const pt = toSVG(e.clientX, e.clientY);
    if (!pt) return;
    const idx = nearest(pt);
    if (idx === null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!DOTS[idx].heart) { softReset(idx); return; }
    setActive(idx);
    setCursor(pt);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (active === null || done || resetting) return;
    const pt = toSVG(e.clientX, e.clientY);
    if (pt) setCursor(pt);
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (active === null || done || resetting) return;
    const pt = toSVG(e.clientX, e.clientY);
    setActive(null);
    setCursor(null);
    if (!pt) return;

    const target = nearest(pt, active);
    if (target === null) return; // released in empty space — just cancel

    const valid = DOTS[target].heart && HEART_EDGES.has(eKey(active, target));
    if (!valid) { softReset(target); return; }

    const key = eKey(active, target);
    if (connected.has(key)) return; // already connected

    const next = new Set(connected);
    next.add(key);
    setConnected(next);
    if (next.size === HEART_EDGES.size) setDone(true);
  }

  // ── render ──────────────────────────────────────────────────

  const rootCls = [
    "cd",
    done      ? "cd--done"      : "",
    resetting ? "cd--resetting" : "",
    exiting   ? "cd--exit"      : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={`${rootCls} paper-bg`}>
      <div className="cd__card">
        <span className="cd__tape cd__tape--a" aria-hidden="true" />
        <span className="cd__tape cd__tape--b" aria-hidden="true" />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="cd__svg"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          aria-label="Connect the heart dots"
        >
          {/* heart fill — fades in when complete */}
          {done && (
            <polygon
              points={DOTS.filter(d => d.heart).map(d => `${d.x},${d.y}`).join(" ")}
              className="cd__heart-fill"
            />
          )}

          {/* connected line segments */}
          <g className={resetting ? "cd__segs--reset" : ""}>
            {[...connected].map(key => {
              const [a, b] = key.split("-").map(Number);
              return (
                <path
                  key={key}
                  d={`M ${DOTS[a].x},${DOTS[a].y} L ${DOTS[b].x},${DOTS[b].y}`}
                  pathLength="1"
                  className={`cd__seg${done ? " cd__seg--done" : ""}`}
                />
              );
            })}
          </g>

          {/* rubber-band drag line */}
          {active !== null && cursor && (
            <line
              x1={DOTS[active].x} y1={DOTS[active].y}
              x2={cursor.x}       y2={cursor.y}
              className="cd__band"
            />
          )}

          {/* dots */}
          {DOTS.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={6}
              className={[
                "cd__dot",
                i === active   ? "cd__dot--active" : "",
                i === wrongDot ? "cd__dot--wrong"  : "",
                done           ? "cd__dot--done"   : "",
              ].filter(Boolean).join(" ")}
            />
          ))}
        </svg>
      </div>

      <p className={`cd__hint${done ? " cd__hint--done" : ""}`}>
        {done ? "you're in." : "connect the dots to enter"}
      </p>
    </div>
  );
}
