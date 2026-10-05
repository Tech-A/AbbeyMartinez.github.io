import { useEffect, useState } from "react";
import { nav } from "../data/site";
import "./nav.css";

// fixed pill nav — each pill scrolls to its section on the home page
export default function Nav({ revealed = true }: { revealed?: boolean }) {
  const [active, setActive] = useState("home");

  // highlight whichever section fills the middle of the screen
  useEffect(() => {
    const ids = nav.map((n) => n.toLowerCase());
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <nav className={`nav${revealed ? " nav--in" : ""}`}>
      {nav.map((item) => {
        const id = item.toLowerCase();
        return (
          <a key={id} href={`#${id}`} className={`pill${active === id ? " pill--active" : ""}`}>
            {id}
          </a>
        );
      })}
    </nav>
  );
}
