import { contact } from "../data/site";
import "./contact.css";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <header className="sec-head" data-avoid>
        <p className="sec-head__eyebrow">04 <i>/</i> get in touch</p>
        <h2 className="sec-head__title">contact</h2>
      </header>

      <div className="note-card" data-avoid>
        <img className="note-card__paper" src="/scrapbook/lined-note.png" alt="" draggable={false} />
        <img className="note-card__snoopy" src="/scrapbook/snoopy-peek.png" alt="" draggable={false} />

        {/* each row sits on one ruled line of the paper */}
        <div className="note-card__lines">
          <p className="note-card__row note-card__row--head">{contact.heading}</p>
          <p className="note-card__row">{contact.intro}</p>
          <p className="note-card__row" />
          {contact.links.map((l) => (
            <p key={l.label} className="note-card__row">
              <span className="note-card__label">{l.label}</span>
              {l.href ? <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{l.value}</a> : l.value}
            </p>
          ))}
          <p className="note-card__row" />
          <p className="note-card__row note-card__row--sign">{contact.signoff}</p>
        </div>
      </div>

      <footer className="foot" data-avoid>
        © {new Date().getFullYear()} abbey <i>/</i> designed &amp; built from scratch <i>/</i>{" "}
        <a href="#home" className="foot__top">back to the top ↑</a>
      </footer>
    </section>
  );
}
