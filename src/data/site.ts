// Central content — edit copy here, not in components.
export const nav = ["HOME", "PROJECTS", "EXPERIENCE", "CONTACT"] as const;

export const hero = {
  eyebrow: "portfolio / vol. 01",
  name: "abbey",
  role: "software engineer",
  blurb: "3rd Year Software engineering student at the University of Auckland. Let's connect!",
};

export const contact = {
  heading: "let's talk.",
  intro: ["contact me!"],
  links: [
    { label: "email",    value: "abbeypmz@gmail.com",  href: "mailto:abbeypmz@gmail.com" },
    { label: "linkedin", value: "/in/abbey-martinez",  href: "https://www.linkedin.com/in/abbey-martinez-4aa07731a/" },
    { label: "github",   value: "@Tech-A",             href: "https://github.com/Tech-A" },
    { label: "resume",   value: "download ↗",          href: "/resume.pdf" },
    { label: "based in", value: "Auckland, NZ" },
  ],
  signoff: "— abbey",
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;   // context: where / role
  badge?: string;     // award or headline result
  description: string;
  points: string[];
  tags: string[];
  accent: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "medrevue",
    title: "Med Revue",
    subtitle: "WDCC · Project Manager",
    badge: "Leading 8 developers",
    description:
      "An improved ticketing and event platform for the Auckland Med Revue, built through WDCC — covering ticket sales, admin dashboards and reporting.",
    points: [
      "Leading a team of 8 developers from scoping to delivery",
      "Running agile sprints: scope, timelines and task allocation",
      "Working with client stakeholders on ticketing, admin dashboards and reporting",
    ],
    tags: ["Project Lead", "Agile", "Full-Stack", "Client Work"],
    accent: "#DCE3E8",
  },
  {
    id: "pokestudy",
    title: "Pokestudy",
    subtitle: "SESA x DEVS Hackathon",
    badge: "Best Design",
    description:
      "A Pokémon-themed student dashboard that turns study tasks into a game — finish work, level up.",
    points: [
      "Won Best Design out of 10+ teams",
      "Built in a team of 4 over the hackathon weekend",
    ],
    tags: ["React", "TypeScript", "Firebase"],
    accent: "#E8E2D4",
    links: [{ label: "code", href: "https://github.com/Tech-A/Pokestudy" }],
  },
  {
    id: "runlock",
    title: "Runlock",
    subtitle: "GDSC Hackathon 2024",
    badge: "3rd place",
    description:
      "A productivity app that locks your phone's apps until you've run a set number of steps — doomscrolling, but make it cardio.",
    points: [
      "Placed 3rd overall at the GDSC 2024 Hackathon",
      "Built in a team of 6",
    ],
    tags: ["React Native", "Mobile"],
    accent: "#D9E0D6",
  },
  {
    id: "esports",
    title: "UoA Esports",
    subtitle: "WDCC · Developer & UI Designer",
    badge: "2,500+ members",
    description:
      "The official website for the University of Auckland Esports Club, built to handle membership and events for a fast-growing community.",
    points: [
      "Built in a team of 10 developers",
      "Designed the UI/UX in Figma with a focus on accessibility",
      "Front-end in React, Next.js and TypeScript",
    ],
    tags: ["Next.js", "React", "TypeScript", "Figma"],
    accent: "#D3DCE6",
  },
  {
    id: "tuckshop",
    title: "Tuckshop App",
    subtitle: "Mobile ordering app",
    badge: "800+ weekly users",
    description:
      "A mobile ordering app for my school tuckshop with a real-time menu, so students order ahead instead of queueing.",
    points: [
      "Used weekly by 800+ students — shorter queues at lunch",
      "Real-time admin menu CRUD, auth and database integration",
    ],
    tags: ["React Native", "JavaScript", "Firebase"],
    accent: "#E2E0DA",
    links: [{ label: "code", href: "https://github.com/Tech-A/tuckshop-app" }],
  },
  {
    id: "schoolmap",
    title: "School Map",
    subtitle: "Interactive campus map",
    badge: "1,000+ students",
    description:
      "An interactive map of my high school campus with clickable buildings, room info and a colour-coded key.",
    points: ["Clickable buildings and room info built on Leaflet", "Used by 1,000+ students"],
    tags: ["JavaScript", "Leaflet", "HTML", "CSS"],
    accent: "#E6DDD0",
    links: [
      { label: "live site", href: "https://tech-a.github.io/SchoolMap/" },
      { label: "code", href: "https://github.com/Tech-A/SchoolMap" },
    ],
  },
];

// Timeline, latest first. kind sets the dot colour.
export type Moment = {
  when: string;
  title: string;
  org: string;
  note: string;
  kind: "work" | "club" | "study";
  upcoming?: boolean;
};

export const timeline: Moment[] = [
  { when: "2027",               title: "Secretary",                       org: "WDCC",     kind: "club", upcoming: true,
    note: "Incoming secretary on the 2027 committee." },
  { when: "Mar 2026 — now",     title: "Project Manager",                 org: "WDCC",     kind: "work",
    note: "Leading 8 developers on the Auckland Med Revue ticketing platform." },
  { when: "Dec 2025 — now",     title: "Sponsorship Manager",             org: "SESA",     kind: "club",
    note: "Partnerships with 10+ industry sponsors." },
  { when: "Dec 2025 — now",     title: "Industry Executive",              org: "WDCC",     kind: "club",
    note: "Industry networking nights and CV workshops for 100+ students." },
  { when: "Nov 2025 — Feb 2026", title: "Software Engineer Intern",       org: "Heartlab", kind: "work",
    note: "Full-stack features on a clinical imaging platform — Vue, NestJS, PostgreSQL." },
  { when: "Jun — Dec 2025",     title: "Marketing Director",              org: "WDCC",     kind: "club",
    note: "Led a team of 5 and designed the club mascot." },
  { when: "2025",               title: "Marketing Executive",             org: "WDCC",     kind: "club",
    note: "Campaigns and content for the club." },
  { when: "Feb — Nov 2025",     title: "Software Developer & UI Designer", org: "WDCC",    kind: "work",
    note: "Built the UoA Esports Club site for 2,500+ members." },
  { when: "Feb 2024",           title: "Started Software Engineering",    org: "University of Auckland", kind: "study",
    note: "BE (Hons), Software Engineering." },
];

// Main tools — icons live in /public/stack
// Main tools — icons live in /public/stack. `paper` picks the scrap each
// one is printed on: a film frame, a torn strip, or a lined note.
export type Tool = { name: string; icon: string; paper: "film" | "torn" | "note" };
export const stack: Tool[] = [
  { name: "React",        icon: "react",       paper: "film" },
  { name: "React Native", icon: "reactnative", paper: "note" },
  { name: "TypeScript",   icon: "typescript",  paper: "torn" },
  { name: "JavaScript",   icon: "javascript",  paper: "film" },
  { name: "Java",         icon: "java",        paper: "note" },
  { name: "Vue.js",       icon: "vuedotjs",    paper: "torn" },
  { name: "PostgreSQL",   icon: "postgresql",  paper: "film" },
  { name: "Node.js",      icon: "nodedotjs",   paper: "torn" },
  { name: "Git",          icon: "git",         paper: "note" },
  { name: "Figma",        icon: "figma",       paper: "film" },
];
