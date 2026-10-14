/** Guion de Buddy en inglés: mismas claves que `../buddy-script.ts`. */
import { projects } from "@/data/projects";
import { techs } from "@/data/skills";
import type { BuddyScriptCopy } from "@/data/buddy-script";

export const en: BuddyScriptCopy = {
  intro: {
    skip: "Skip intro",
  },

  introGreetings: [
    { mood: "wave", hello: "HELLO!", line: "I'm Buddy, your guide through Eidan's portfolio" },
    { mood: "cool", hello: "HOWDY!", line: "Buddy in charge: let me show you what Eidan builds" },
    { mood: "love", hello: "HIYA!", line: "Great to see you here! I'm Buddy, your guide" },
    { mood: "happy", hello: "HEY!", line: "I'm Buddy, and today the tour is on me" },
    { mood: "coding", hello: "<HELLO/>", line: "Hello, world: I'm Buddy, Eidan's guide" },
    { mood: "surprised", hello: "OH!", line: "A visitor! I'm Buddy, let me show you around" },
  ],

  welcome: {
    title: "Hi! I'm Buddy 👋",
    body: "I'm the guide for this portfolio. Eidan is a junior software developer: he automates workflows with AI, builds in Python and JavaScript, and sweats the details. Want a one-minute tour?",
  },

  sectionLines: {
    inicio: {
      mood: "wave",
      lines: ["Back to the start. If you like, I can give you the guided tour from here."],
    },
    "sobre-mi": {
      mood: "talk",
      lines: [
        "Here's how he works: diagnosis before patchwork, and always the 'why' behind every decision.",
        "Quick fact: he passed 4 out of 4 Campuslands modules at 100%, each with its repo and commit history.",
      ],
    },
    stack: {
      mood: "coding",
      lines: [
        `His inventory: ${techs.length} technologies. Click any of them and I'll tell you how he uses it and where to see it.`,
        "His strong suit is automation: n8n + Gemini orchestrating Sheets, Gmail, and Telegram.",
      ],
    },
    proyectos: {
      mood: "cool",
      lines: [
        "My favorite part! Click \"What does Buddy say?\" on any card and I'll break down the technical challenge.",
        "Start with AI Candidate Screening: it's the most complete end-to-end project.",
      ],
    },
    contacto: {
      mood: "love",
      lines: [
        "Convinced? Drop him a line: he's available for junior roles, internships, and projects.",
      ],
    },
  },

  tour: [
    {
      section: "inicio",
      mood: "wave",
      text: "Let's begin. Eidan Carreño, from Floridablanca (Colombia): AI automation, Python, and JavaScript.",
    },
    {
      section: "sobre-mi",
      mood: "talk",
      text: "His philosophy: reproduce the bug before touching code, deliver in increments, and document the 'why'.",
    },
    {
      section: "stack",
      mood: "coding",
      text: "Five areas: Frontend, Backend in Python, Databases, AI Automation, and Workflow tools.",
    },
    {
      section: "proyectos",
      mood: "cool",
      text: `${projects.length} real projects, each with its own repository. Click "What does Buddy say?" on any of them and I'll break it down.`,
    },
    {
      section: "contacto",
      mood: "love",
      text: "And that's it! If he's a fit for your team, he's just a click away. I'll stick around in the corner if you need me.",
    },
  ],

  faq: [
    {
      q: "Is he available?",
      a: "Yes: looking for junior roles, internships, or projects. He's based in Floridablanca, Santander (Colombia).",
    },
    {
      q: "What's his strongest skill?",
      a: "AI automation: n8n workflows where Gemini evaluates documents and the output is distributed across Sheets, Gmail, and Telegram, with a human making the final call.",
    },
    {
      q: "What is he learning right now?",
      a: "Consolidating relational databases and automated testing, while working towards C1 English (already certified B2).",
    },
    {
      q: "Does he work well in teams?",
      a: 'In the "If I Were CEO" challenge he served as the leader\'s right hand: coordinated 5 teammates for a proposal dossier and an 8-minute pitch.',
    },
  ],

  skillsSummary:
    "In short: JavaScript and Python as core languages, Java for object-oriented programming, PostgreSQL and SQL for data, n8n + Gemini for automation, and Git with Conventional Commits for complete traceability.",

  idleQuips: [
    "Still here. Click me if you need anything.",
    "Did you know this portfolio respects prefers-reduced-motion? Eidan cares about those details.",
    "Psst… Mym Designsx has a live demo.",
  ],

  completion: {
    mood: "happy",
    title: "Tour complete! 5/5",
    text: "You explored the portfolio from start to finish. If Eidan fits your team, he's just a message away.",
  },

  surprises: [
    "CampusTech v2.0 came from rewriting his own monolithic v1 into 5 single-responsibility modules.",
    "The AI screening workflow saves 13 data points per candidate… and the final decision is always made by a human.",
    "The video game search app is just 9.7 KB in total. Zero libraries.",
    "His Java workshop packs 25 exercises into a single console menu: from an ATM with PIN to an address book saved to a file.",
    "Mym Designsx has a live demo: a complete store in vanilla JavaScript backed by n8n.",
    'In the "If I Were CEO" challenge, he coordinated 5 people and delivered an 8-minute pitch.',
    "He passed 4 out of 4 Campuslands modules at 100%, each with its repo and commit history.",
  ],

  contactThanks: 'All set! Your message is already written for Eidan: just press "Send" in your email.',
  contactBlocked: "Your email didn't open. Use the button in the notice or copy Eidan's email: your message is still here.",
  contactSent: "Sent! Your message is now in Eidan's inbox and he'll reply to your email.",
  contactFailed: "Automatic sending failed, but your message is still here: open it in your email using the button in the notice.",
  copiedEmail: "Email copied to clipboard. 📋",

  konamiLine: "Konami Code! 🕶️ Legend mode activated. Eidan cares about the details no one sees, too.",
};
