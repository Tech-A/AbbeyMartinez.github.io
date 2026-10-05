import { useState, type CSSProperties } from "react";
import { timeline, stack } from "../data/site";
import "./experience.css";

// where each tool sits inside the open case, and where it lands when the
// case is hovered: they pop straight up out of the box into three loose,
// overlapping rows over the open case — a short hop, everything readable.
// Positions are % of the case width.
const SPREAD: [number, number, number][] = [
  [4, 38, -7],   [14, 10, 5],   [46, 4, -3],   [81, 12, 6],   [34, 36, 4],
  [64, 40, -5],  [97, 40, 7],   [19, 64, -4],  [52, 66, 3],   [83, 64, -6],
];
const spots = stack.map((_, i) => {
  const back = i % 2 === 0;                       // two loose rows in the base
  const col = Math.floor(i / 2);
  const rest = { x: 24 + col * 13 + (back ? 0 : 6), y: back ? 69 : 77, r: ((i * 37) % 21) - 10 };
  const [x, y, r] = SPREAD[i % SPREAD.length];
  return { rest, out: { x, y, r } };
});

// A timeline (earliest → latest) whose entries open on hover/tap, then the
// toolkit printed on paper scraps, packed in a suitcase.
export default function Experience() {
  const [open, setOpen] = useState(false);   // touch: tap the case to unpack
  const [pinned, setPinned] = useState<number | null>(null);   // tapped / clicked entry

  return (
    <section className="exp" id="experience">
      <header className="sec-head" data-avoid>
        <p className="sec-head__eyebrow">03 <i>/</i> experience</p>
        <h2 className="sec-head__title">experience</h2>
      </header>

      <ol className="tl" data-avoid>
        {timeline.map((m, i) => (
          <li
            key={m.title + m.when}
            className={`tl__item tl__item--${m.kind}${pinned === i ? " tl__item--open" : ""}`}
            style={{ "--tilt": `${i % 2 ? 1.2 : -1.4}deg` } as CSSProperties}
          >
            <button
              className="tl__hit"
              aria-expanded={pinned === i}
              onClick={() => setPinned((p) => (p === i ? null : i))}
            >
              <span className="tl__dot" aria-hidden="true" />
              <span className="tl__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="tl__when">
                {m.when}
                {m.upcoming && <span className="tl__soon">incoming</span>}
              </span>
              <span className="tl__title">{m.title} <span className="tl__org">— {m.org}</span></span>
              <span className="tl__more">
                <span className="tl__note">{m.note}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="kit" data-avoid>
        <p className="sec-head__eyebrow">toolkit <i>/</i> <span className="hero__hint-mouse">hover</span><span className="hero__hint-touch">tap</span> to unpack</p>
        <div
          className={`case${open ? " case--open" : ""}`}
          role="img"
          aria-label={`Toolkit: ${stack.map((t) => t.name).join(", ")}`}
          onClick={() => { if (window.matchMedia("(hover: none)").matches) setOpen((o) => !o); }}
        >
          <img className="case__back" src="/scrapbook/suitcase.png" alt="" draggable={false} />
          {stack.map((t, i) => {
            const { rest, out } = spots[i];
            const style = {
              "--x": rest.x, "--y": rest.y, "--r": `${rest.r}deg`,
              "--ox": out.x, "--oy": out.y, "--or": `${out.r}deg`,
              "--d": `${i * 35}ms`,
            } as CSSProperties;
            return (
              <div key={t.name} className={`chip chip--${t.paper}`} style={style}>
                <span className="chip__art">
                  <img src={`/stack/${t.icon}.svg`} alt="" draggable={false} />
                  <span className="chip__name">{t.name}</span>
                </span>
              </div>
            );
          })}
          {/* front wall of the case sits over the packed tools */}
          <img className="case__front" src="/scrapbook/suitcase-front.png" alt="" draggable={false} />
        </div>
      </div>
    </section>
  );
}
