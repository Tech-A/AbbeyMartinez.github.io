import { useEffect, useLayoutEffect, useRef, type CSSProperties, type RefObject } from "react";
import "./scrapbook.css";

/* ============================================================
   SCRAPBOOK STARFIELD — real photo cutouts scattered like stars
   around the title and on down the page. Hover the name and every
   piece swoops into a tilted planet ring that orbits it.

   Each piece has a preferred spot in a section — `at` =
   [x % of page width, y % of that section's height, rotation°] —
   and is then nudged to the nearest free space so it never sits
   on text, windows, the contact note or another piece (anything
   marked `data-avoid`). If there's no room (small screens) it
   stays hidden until it joins the orbit.

   Cutouts live in /public/scrapbook/. `w` = size in starfield units.
   ============================================================ */

type Item = {
  img: string;
  w: number;
  sec: "home" | "projects" | "experience" | "contact";
  at: [number, number, number];
  star?: boolean;
  screen?: boolean; // the camera: glass shows through its cut-out screen
};

const S = "/scrapbook/";
const star = (size: "sm" | "md" | "lg", w: number, sec: Item["sec"], at: Item["at"]): Item =>
  ({ img: `${S}star-${size}.png`, w, sec, at, star: true });

const ITEMS: Item[] = [
  // ── around the title ──
  { img: S + "snoopy-stamp.png",   w: 14, sec: "home", at: [13, 22, -8] },
  { img: S + "outside-patch.png",  w: 8,  sec: "home", at: [31, 13, -10] },
  { img: S + "beatles.png",        w: 16, sec: "home", at: [86, 20, 6] },
  { img: S + "vangogh-stamp.png",  w: 11, sec: "home", at: [69, 12, 7] },
  { img: S + "glasses-cat.png",    w: 15, sec: "home", at: [12, 66, -4] },
  { img: S + "camera.png",         w: 15, sec: "home", at: [86, 60, 6], screen: true },
  { img: S + "butterfly.png",      w: 7,  sec: "home", at: [24, 44, -12] },
  { img: S + "kodak-film.png",     w: 5,  sec: "home", at: [77, 42, 14] },
  { img: S + "records.png",        w: 10, sec: "home", at: [30, 86, 8] },
  { img: S + "abbey-road.png",     w: 24, sec: "home", at: [70, 90, 0] },
  { img: S + "smile-zone.png",     w: 7,  sec: "home", at: [50, 92, -6] },
  star("lg", 4.5, "home", [5, 8, 8]),
  star("sm", 3,   "home", [95, 40, -6]),

  // ── drifting past the windows ──
  { img: S + "laptop-buddy.png",   w: 12, sec: "projects", at: [92, 14, -4] },
  { img: S + "computer.png",       w: 14, sec: "projects", at: [8, 26, 3] },
  { img: S + "uno-reverse.png",    w: 9,  sec: "projects", at: [92, 40, 8] },
  { img: S + "kodak-film.png",     w: 5,  sec: "projects", at: [7, 50, -8] },
  { img: S + "daisies.png",        w: 7,  sec: "projects", at: [8, 74, -4] },
  { img: S + "disposable-cam.png", w: 7,  sec: "projects", at: [93, 90, 10] },
  star("md", 3.6, "projects", [5, 92, 8]),

  // ── beside the timeline ──
  { img: S + "snoopy-computer.png", w: 14, sec: "experience", at: [10, 18, -3] },
  { img: S + "bonjour-cat.png",    w: 11, sec: "experience", at: [90, 24, 5] },
  { img: S + "crossword.png",      w: 12, sec: "experience", at: [9, 46, -6] },
  { img: S + "lucky-ticket.png",   w: 12, sec: "experience", at: [91, 50, 7] },
  { img: S + "velvet-flower.png",  w: 10, sec: "experience", at: [8, 72, 10] },
  { img: S + "gathering.png",      w: 6,  sec: "experience", at: [92, 74, -8] },
  { img: S + "matchbox.png",       w: 9,  sec: "experience", at: [90, 90, 4] },
  { img: S + "pinecone-stamp.png", w: 5,  sec: "experience", at: [7, 92, -6] },

  // ── up by the note ──
  { img: S + "snoopy-music.png",   w: 12, sec: "contact", at: [87, 22, 7] },
  { img: S + "red-envelope.png",   w: 9,  sec: "contact", at: [12, 24, -8] },
  { img: S + "computer.png",       w: 11, sec: "contact", at: [14, 54, 3] },
  { img: S + "monkey.png",         w: 12, sec: "contact", at: [90, 92, -4] },
  { img: S + "yellowstone.png",    w: 8,  sec: "contact", at: [80, 90, 5] },
  { img: S + "outside-sticker.png", w: 8, sec: "contact", at: [10, 8, -5] },
  star("sm", 3, "contact", [92, 6, 14]),
];

// how the ring looks + moves
const ORBIT_SECONDS = 40;   // one full lap
const TILT = -0.17;         // ring tilt (radians)
const SQUASH = 0.24;        // ring height ÷ width
const CLEARANCE = 26;       // px kept clear around text + other pieces

// an ellipse parameter crowds points at its ends — this table maps
// "fraction of the way round" → angle so pieces stay evenly spaced
const ARC = (() => {
  const N = 720, len = [0];
  for (let j = 1; j <= N; j++) {
    const a = (j / N) * Math.PI * 2;
    len.push(len[j - 1] + Math.hypot(Math.sin(a), SQUASH * Math.cos(a)));
  }
  return len.map((l) => l / len[N]);
})();
function angleAt(f: number) {
  f = f - Math.floor(f);
  let lo = 0, hi = ARC.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ARC[mid] < f) lo = mid; else hi = mid; }
  return (lo / (ARC.length - 1)) * Math.PI * 2;
}

type Rect = { l: number; t: number; r: number; b: number };
const hits = (a: Rect, b: Rect) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

type Props = { revealed?: boolean; orbit: boolean; nameRef: RefObject<HTMLElement> };

export default function Starfield({ revealed = true, orbit, nameRef }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const geo = useRef<{ x: number; y: number; size: number; hidden: boolean }[] | null>(null);
  const orbitRef = useRef(orbit);
  orbitRef.current = orbit;
  const remeasure = useRef(() => {});
  const kick = useRef(() => {});

  // find each piece a free spot near where it wants to be
  useLayoutEffect(() => {
    const layer = layerRef.current;
    const page = layer?.parentElement;
    if (!layer || !page) return;
    let queued = 0;

    const measure = () => {
      queued = 0;
      const W = page.clientWidth;
      const origin = page.getBoundingClientRect();
      const toPage = (r: DOMRect, pad: number): Rect => ({
        l: r.left - origin.left - pad, t: r.top - origin.top - pad,
        r: r.right - origin.left + pad, b: r.bottom - origin.top + pad,
      });
      const taken: Rect[] = [...document.querySelectorAll("[data-avoid]")]
        .map((el) => toPage(el.getBoundingClientRect(), CLEARANCE));
      taken.push({ l: 0, t: 0, r: W, b: 90 });  // the fixed nav at the top

      geo.current = ITEMS.map((it, i) => {
        const el = els.current[i];
        const sec = document.getElementById(it.sec);
        const w = el?.offsetWidth || 100, h = el?.offsetHeight || w;
        if (!sec) return { x: -9999, y: -9999, size: Math.max(w, h), hidden: true };

        const top = sec.offsetTop, bottom = top + sec.offsetHeight;
        const want = { x: (it.at[0] / 100) * W, y: top + (it.at[1] / 100) * sec.offsetHeight };
        const box = (x: number, y: number): Rect => ({ l: x - w / 2, t: y - h / 2, r: x + w / 2, b: y + h / 2 });
        const fits = (x: number, y: number) => {
          const b = box(x, y);
          if (b.l < 6 || b.r > W - 6 || b.t < top + 6 || b.b > bottom - 6) return false;
          return !taken.some((t) => hits(b, t));
        };

        // spiral outward from the preferred spot
        let spot: { x: number; y: number } | null = null;
        for (let r = 0; r <= 520 && !spot; r += 18) {
          const steps = r === 0 ? 1 : Math.max(8, Math.round(r / 12));
          for (let s = 0; s < steps; s++) {
            const a = (s / steps) * Math.PI * 2;
            const x = want.x + Math.cos(a) * r, y = want.y + Math.sin(a) * r;
            if (fits(x, y)) { spot = { x, y }; break; }
          }
        }
        const p = spot ?? want;
        if (spot) {
          const b = box(p.x, p.y);
          taken.push({ l: b.l - CLEARANCE / 2, t: b.t - CLEARANCE / 2, r: b.r + CLEARANCE / 2, b: b.b + CLEARANCE / 2 });
        }
        if (el) { el.style.left = `${p.x}px`; el.style.top = `${p.y}px`; el.style.visibility = "visible"; }
        return { ...p, size: Math.max(w, h), hidden: !spot };
      });
      kick.current();
    };
    const queue = () => { if (!queued) queued = requestAnimationFrame(measure); };
    remeasure.current = queue;

    measure();
    document.fonts?.ready.then(queue);
    const ro = new ResizeObserver(queue);
    ro.observe(page);
    return () => { ro.disconnect(); cancelAnimationFrame(queued); };
  }, []);

  // the orbit loop only runs while pieces are in (or flying to/from) the
  // ring — at rest nothing animates, so scrolling stays cheap
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = ITEMS.length;
    const v = ITEMS.map(() => 0);   // 0 = resting star … 1 = in the ring
    const t0 = performance.now();
    let raf = 0;

    const rest = () => {
      const g = geo.current;
      for (let i = 0; i < n; i++) {
        const el = els.current[i];
        if (!el || !g) continue;
        el.style.transform = `translate(-50%, -50%) rotate(${ITEMS[i].at[2]}deg)`;
        el.style.zIndex = "";
        el.style.opacity = g[i].hidden ? "0" : "";
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const g = geo.current, layer = layerRef.current, name = nameRef.current;
      if (!g || !layer) return;
      const target = orbitRef.current ? 1 : 0;

      // settled back in place: write the resting pose once and stop
      if (!target && v.every((k) => k < 0.003)) { v.fill(0); rest(); return; }

      const vw = window.innerWidth, vh = window.innerHeight;
      const lb = layer.getBoundingClientRect();
      const nb = name?.getBoundingClientRect();
      const cx = nb ? nb.left + nb.width / 2 - lb.left : vw / 2;
      const cy = nb ? nb.top + nb.height / 2 - lb.top : vh / 2;
      // phones get a rounder ring so pieces have room
      const narrow = vw < 700;
      const Rx = narrow ? vw * 0.36 : Math.min(vw * 0.37, 540), Ry = Rx * (narrow ? 0.8 : SQUASH);
      const size = Math.max(40, Math.min(Rx / 6, 100));      // piece size in the ring
      const lap = reduce ? 0 : (now - t0) / 1000 / ORBIT_SECONDS;

      for (let i = 0; i < n; i++) {
        const el = els.current[i];
        if (!el) continue;
        v[i] += (target - v[i]) * (reduce ? 1 : 0.06 + (i % 5) * 0.008);
        const k = v[i];
        const p = g[i], it = ITEMS[i];

        // ring: two slightly offset bands so it has some thickness
        const a = angleAt(i / n + lap);
        const band = 1 + (i % 3) * 0.06;
        const ex = Math.cos(a) * Rx * band, ey = Math.sin(a) * Ry * band;
        const rx = cx + ex * Math.cos(TILT) - ey * Math.sin(TILT);
        const ry = cy + ex * Math.sin(TILT) + ey * Math.cos(TILT);
        const near = Math.sin(a);                           // +1 front … -1 back
        const ringScale = Math.min(1, ((it.star ? 0.45 : 1) * size) / p.size) * (0.8 + 0.2 * (near + 1));

        const s = 1 + (ringScale - 1) * k;
        const rot = it.at[2] * (1 - k) + k * near * 6;
        el.style.transform = `translate(-50%, -50%) translate(${((rx - p.x) * k).toFixed(1)}px, ${((ry - p.y) * k).toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;
        // back half of the ring passes behind the name, front half in front
        el.style.zIndex = k > 0.4 ? (near > 0 ? "6" : "1") : "";
        const ringFade = k > 0.4 && near < 0 ? 1 + near * 0.3 : 1;
        el.style.opacity = String((p.hidden ? k : 1) * ringFade);
      }
      raf = requestAnimationFrame(tick);
    };

    kick.current = () => { if (!raf) raf = requestAnimationFrame(tick); };
    kick.current();
        return () => cancelAnimationFrame(raf);
  }, [nameRef]);

  // start the loop whenever the orbit turns on or off
  useEffect(() => { kick.current(); }, [orbit]);

  const cls = ["sb", orbit && "sb--orbit", revealed && "sb--in"].filter(Boolean).join(" ");

  return (
    <div ref={layerRef} className={cls} aria-hidden="true">
      {ITEMS.map((it, i) => (
        <div
          key={i}
          ref={(el) => { els.current[i] = el; }}
          className={`sb__piece${it.star ? " sb__piece--star" : ""}`}
          style={{ "--i": i, "--w": it.w, "--fd": `${5 + ((i * 1.7) % 3)}s`, visibility: "hidden" } as CSSProperties}
        >
          <div className="sb__float">
            <div className="sb__pop">
              {it.screen && <span className="sb__screen" />}
              <img src={it.img} alt="" draggable={false} onLoad={() => remeasure.current()} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
