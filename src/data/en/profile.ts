/** Perfil personal en inglés: mismas claves que `../profile.ts`. */
import githubStats from "@/data/github-stats.json" with { type: "json" };
import type { ProfileCopy } from "@/data/profile";

export const en: ProfileCopy = {
  profile: {
    name: "Eidan Alexander Carreño",
    shortName: "Eidan Carreño",
    firstName: "Eidan",
    role: "Junior Software Developer",
    headline: "Software that works,",
    headlineAccent: "details that stand out.",
    tagline: "AI Automation, Python and JavaScript",
    location: "Floridablanca, Santander — Colombia",
    email: "eidanalexander210@gmail.com",
    githubUser: "Eidan210",
    github: "https://github.com/Eidan210",
    cv: "./cv/CV-Eidan-Carreno.pdf",
    availability: "Available for Junior roles · Internships · Projects",
    contactEndpoint: "",
    valueProp:
      "I build AI automations on n8n, modular Python applications, and web apps that consume REST APIs. I prefer native solutions over extra dependencies, and understanding the 'why' before the 'how'.",
    bio: [
      "My background was built at Campuslands, an intensive program where every module is passed by delivering working software, not theory. Four out of four modules passed at 100%, each with its own repository and commit history.",
      "I work with Python, JavaScript, Java, HTML, CSS, and SQL, moving comfortably across databases, APIs, and workflow automation. I care about the details: the bug no one can spot, the contrast that fails AA, the delivery that actually arrives on time.",
    ],
    objective:
      "To keep growing as a developer, joining projects that challenge me to learn and contribute while consolidating relational databases, agile methodologies, and automated testing.",
  },

  profileCode: [
    { key: "rol", label: "Role", value: "Junior Dev" },
    { key: "base", label: "Location", value: "Floridablanca, CO" },
    { key: "campuslands", label: "Campuslands Modules", value: "4/4 at 100%" },
    { key: "repos", label: "Public repositories", value: githubStats.repos, comment: "public" },
    { key: "contribuciones", label: "Contributions in the last year", value: githubStats.contributions, comment: "last year" },
    { key: "ingles", label: "English", value: "B2 → C1" },
    { key: "disponible", label: "Available", value: true, live: true },
  ],

  principles: [
    {
      area: "Systematic problem solving",
      claim: "Diagnosis before patchwork",
      detail:
        "I don't touch a single line until I reproduce the bug. I isolate the root cause, fix the source—not the symptom—and make sure the failing case now passes.",
    },
    {
      area: "Agile / Scrum",
      claim: "I deliver in increments",
      detail:
        "I break work down into sprints and backlogs, prioritizing releasable partial deliveries. Atomic commits over a massive dump at the end of the sprint.",
    },
    {
      area: "Documentation",
      claim: "I document the 'why'",
      detail:
        "README files that explain the decisions made, not just how to install. Conventional Commits so git history reads like a changelog.",
    },
    {
      area: "Ownership",
      claim: "I revisit what already works",
      detail:
        "A working version isn't the finish line: CampusTech v2.0 came from rewriting my own monolithic v1 into single-responsibility modules.",
    },
  ],

  timeline: [
    {
      period: "2026 — Present",
      title: "Hands-on Software Development Training",
      org: "Campuslands · Floridablanca",
      detail: "Four out of four modules passed at 100%: algorithms, frontend, backend with Python, and Git.",
    },
    {
      period: "2026",
      title: '"If I Were CEO" challenge',
      org: "Campuslands",
      detail: "Lead's right hand: coordinated a team of 5, proposal dossier, and an 8-minute pitch before a jury.",
    },
    {
      period: "2025",
      title: "B2 English Certificate",
      org: "Celai Institute",
      detail: "Currently pursuing C1 level. I read technical documentation in English every day.",
    },
    {
      period: "2023 — 2025",
      title: "Teleinformatics Systems Technician",
      org: "SENA",
      detail: "Fundamentals of networking, computer systems, and teleinformatics support.",
    },
  ],
};
