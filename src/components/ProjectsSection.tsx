import { useEffect, useState, type CSSProperties } from "react";
import { projects } from "../data/site";
import "./projects-section.css";

const TILT = [-2, 1.5, -1, 2, -1.5, 1];

export default function ProjectsSection() {
  const [tab, setTab] = useState<number | null>(null);     // open project tab
  const [peek, setPeek] = useState<number | null>(null);   // touch: shutters opened by first tap

  function onWindow(i: number) {
    const touch = window.matchMedia("(hover: none)").matches;
    if (touch && peek !== i) { setPeek(i); return; }      // first tap opens the shutters
    setTab(i);
  }

  return (
    <section className="projects" id="projects">
      <header className="sec-head" data-avoid>
        <p className="sec-head__eyebrow">02 <i>/</i> selected work</p>
        <h2 className="sec-head__title">projects</h2>
      </header>

      <div className="wins">
        {projects.map((p, i) => (
          <article
            key={p.id}
            data-avoid
           
            className={`win${peek === i ? " win--open" : ""}`}
            style={{ "--accent": p.accent, "--tilt": `${TILT[i % TILT.length]}deg` } as CSSProperties}
          >
            <button
              className="win__box"
              onClick={() => onWindow(i)}
              aria-label={`Open ${p.title}`}
            >
              {/* what's inside: a little browser tab */}
              <div className="win__inside">
                <div className="mtab">
                  <span className="mtab__dot" />
                  <span className="mtab__name">{p.title}</span>
                </div>
                <div className="mtab__body">
                  <p className="mtab__sub">{p.subtitle}</p>
                  <h3 className="mtab__title">{p.title}</h3>
                  {p.badge && <span className="mtab__badge">{p.badge}</span>}
                  <p className="mtab__desc">{p.description}</p>
                  <span className="mtab__open">view ↗</span>
                </div>
              </div>
              <img className="win__frame" src="/scrapbook/window-frame.png" alt="" draggable={false} />
              <span className="win__shutter win__shutter--l" />
              <span className="win__shutter win__shutter--r" />
            </button>
            <p className="win__label">
              <span>{String(i + 1).padStart(2, "0")}</span> {p.title}
            </p>
          </article>
        ))}
      </div>

      {tab !== null && <ProjectTabs index={tab} onSelect={setTab} onClose={() => setTab(null)} />}
    </section>
  );
}

/* ── the opened "browser window": one tab per project ──────── */

function ProjectTabs({ index, onSelect, onClose }: {
  index: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  const p = projects[index];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="ptabs" role="dialog" aria-modal="true" aria-label={p.title} onClick={onClose}>
      <div className="ptabs__win" onClick={(e) => e.stopPropagation()}>
        <div className="ptabs__bar">
          <span className="ptabs__dots"><i /><i /><i /></span>
          <div className="ptabs__tabs" role="tablist">
            {projects.map((q, i) => (
              <button
                key={q.id}
                role="tab"
                aria-selected={i === index}
                className={`ptabs__tab${i === index ? " ptabs__tab--on" : ""}`}
                style={{ "--accent": q.accent } as CSSProperties}
                onClick={() => onSelect(i)}
              >
                <span className="mtab__dot" />
                {q.title}
              </button>
            ))}
          </div>
          <button className="ptabs__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="ptabs__url">abbeymartinez.com/projects/{p.id}</div>

        <div className="ptabs__page" style={{ "--accent": p.accent } as CSSProperties} key={p.id}>
          <p className="ptabs__sub">{p.subtitle}</p>
          <h3 className="ptabs__title">{p.title}</h3>
          {p.badge && <span className="ptabs__badge">{p.badge}</span>}
          <p className="ptabs__desc">{p.description}</p>
          <ul className="ptabs__points">
            {p.points.map((pt) => <li key={pt}>{pt}</li>)}
          </ul>
          <div className="ptabs__tags">
            {p.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
          {p.links && (
            <div className="ptabs__links">
              {p.links.map((l) => (
                <a key={l.href} className="pill" href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
