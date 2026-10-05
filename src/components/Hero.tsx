import { useRef, type RefObject } from "react";
import { hero } from "../data/site";
import "./hero.css";

type Props = {
  revealed?: boolean;
  orbit?: boolean;
  nameRef: RefObject<HTMLHeadingElement>;
  onOrbit: (on: boolean | ((o: boolean) => boolean)) => void;
};

// `revealed` holds the entrance animations until the dots gate lifts.
// Hovering the name pulls the scrapbook starfield into a ring around it.
// Anything marked data-avoid is kept clear of resting scrapbook pieces.
export default function Hero({ revealed = true, orbit = false, nameRef, onOrbit }: Props) {
  const release = useRef<ReturnType<typeof setTimeout>>();

  function enter() {
    clearTimeout(release.current);
    onOrbit(true);
  }
  function leave() {
    // small grace period so brushing past the edge doesn't snap it apart
    release.current = setTimeout(() => onOrbit(false), 350);
  }

  return (
    <section className={`hero${revealed ? " hero--in" : ""}${orbit ? " hero--orbit" : ""}`} id="home">
      <header className="hero__text">
        <p className="hero__eyebrow" data-avoid>{hero.eyebrow}</p>
        <div className="hero__name-wrap">
          <h1
            ref={nameRef}
            className="hero__name"
            data-avoid
            onPointerEnter={(e) => e.pointerType === "mouse" && enter()}
            onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
            onClick={() => {
              if (!window.matchMedia("(hover: none)").matches) return;
                        onOrbit((o) => !o);
            }}
          >
            {hero.name}
          </h1>
          {/* hand-circled nudge beside the name (fades while the ring orbits) */}
          <span className="hero__tag" data-avoid aria-hidden="true">
            <svg viewBox="0 0 40 20" className="hero__arrow"><path d="M36 4 C 26 2, 14 6, 4 15 M4 15 l 7 -1 M4 15 l 1 -7" /></svg>
            <span className="hero__circled">
              <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="hero__ring">
                <path d="M30 14 C 70 2, 160 4, 188 26 C 204 44, 176 70, 110 74 C 50 78, 8 66, 10 42 C 12 24, 50 10, 100 9 C 140 8, 170 14, 182 22" />
              </svg>
              <span className="hero__hint-mouse">hover me</span>
              <span className="hero__hint-touch">tap me</span>
            </span>
          </span>
        </div>
        <p className="hero__role" data-avoid>{hero.role}</p>
        <p className="hero__blurb" data-avoid>{hero.blurb}</p>
      </header>

      <a className="hero__scroll" href="#projects" data-avoid>scroll <span>↓</span></a>
    </section>
  );
}
