import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Starfield from "../components/Scrapbook";
import ProjectsSection from "../components/ProjectsSection";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import "./home.css";

export default function Home() {
  const [orbit, setOrbit] = useState(false);                 // pieces ringing the name
  const nameRef = useRef<HTMLHeadingElement>(null);

  // honour a #projects / #contact link on first load
  useEffect(() => {
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  }, []);

  return (
    <main className="page">
      <Starfield revealed orbit={orbit} nameRef={nameRef} />
      <Nav revealed />
      <Hero revealed orbit={orbit} nameRef={nameRef} onOrbit={setOrbit} />
      <ProjectsSection />
      <Experience />
      <Contact />
    </main>
  );
}
