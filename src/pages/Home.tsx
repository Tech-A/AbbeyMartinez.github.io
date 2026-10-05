import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Starfield from "../components/Scrapbook";
import ProjectsSection from "../components/ProjectsSection";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import ConnectDots from "../components/ConnectDots";
import "./home.css";

// once the heart is drawn, skip the gate for the rest of the browser session
const KEY = "dots-solved";
function alreadySolved() {
  if (location.search.includes("skip")) return true; try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
}

export default function Home() {
  const [revealed, setRevealed] = useState(alreadySolved);  // gate starts fading
  const [gateGone, setGateGone] = useState(alreadySolved);  // gate unmounted
  const [orbit, setOrbit] = useState(false);                 // pieces ringing the name
  const nameRef = useRef<HTMLHeadingElement>(null);

  function onSolved() {
    try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ }
    setRevealed(true);
  }

  // no scrolling behind the gate; once in, honour a #projects / #contact link
  useEffect(() => {
    document.documentElement.style.overflow = revealed ? "" : "hidden";
    if (revealed && location.hash) {
      document.querySelector(location.hash)?.scrollIntoView();
    }
  }, [revealed]);

  return (
    <main className="page">
      {!gateGone && <ConnectDots onSolved={onSolved} onDone={() => setGateGone(true)} />}
      <Starfield revealed={revealed} orbit={orbit} nameRef={nameRef} />
      <Nav revealed={revealed} />
      <Hero revealed={revealed} orbit={orbit} nameRef={nameRef} onOrbit={setOrbit} />
      <ProjectsSection />
      <Experience />
      <Contact />
    </main>
  );
}
