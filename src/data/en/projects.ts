/** Proyectos destacados en inglés: mismas claves que `../projects.ts`. */
import type { ProjectsCopy } from "@/data/projects";

export const en: ProjectsCopy = {
  projects: [
    {
      id: "preseleccion",
      title: "AI Candidate Screening",
      repo: "Proyecto_n8n",
      summary:
        "End-to-end recruitment automation: Google Gemini evaluates PDF resumes against job postings, and n8n distributes the results across Sheets, Gmail, and Telegram.",
      stack: ["n8n", "Google Gemini", "JavaScript", "Google Sheets", "Gmail", "Telegram"],
      metrics: [
        { value: "13", label: "data points per candidate" },
        { value: "39", label: "n8n nodes" },
        { value: "3", label: "compatibility tiers" },
      ],
      repoUrl: "https://github.com/Eidan210/Proyecto_n8n",
      image: "./proyectos/preseleccion-n8n.webp",
      category: "AI · Automation",
      buddy: {
        challenge:
          "HR receives dozens or hundreds of PDF resumes per opening. Reviewing them manually takes days, and what candidates enter in the form doesn't always match their resume.",
        architecture:
          "A 39-node n8n workflow where Gemini scores resume compatibility against the job opening and classifies it into three tiers: priority review from 80%, manual between 60% and 79%, and secondary below that. 13 data points per candidate are stored in Sheets, notifications are sent via Gmail and Telegram, and a bot leaves the final call in the recruiter's hands.",
        takeaway:
          "What I like most: AI proposes, but a human decides. It's human-in-the-loop by design, not by accident.",
      },
    },
    {
      id: "mym",
      title: "Mym Designsx",
      repo: "Proyecto-Automatizacion-mym",
      summary:
        "Customizable apparel store built as a pure JavaScript SPA, with an automation backend powered by n8n, PostgreSQL, Gmail, and Google Sheets.",
      stack: ["JavaScript", "n8n", "PostgreSQL", "Gmail", "Google Sheets"],
      metrics: [
        { value: "8", label: "JS modules" },
        { value: "19 %", label: "VAT at checkout" },
      ],
      repoUrl: "https://github.com/Eidan210/Proyecto-Automatizacion-mym",
      demoUrl: "https://eidan210.github.io/Proyecto-Automatizacion-mym/app/index.html",
      image: "./proyectos/mym-designsx.webp",
      category: "Live · Full flow",
      buddy: {
        challenge:
          "A custom product store needs customers to design their apparel, check out, and receive a receipt without relying on third-party e-commerce platforms.",
        architecture:
          "Framework-free SPA across 8 single-responsibility modules: catalog, customizer, cart with VAT, auth, and admin panel. n8n acts as the backend: persists users in PostgreSQL, sends receipts via Gmail, and logs orders in Sheets.",
        takeaway: "A large vanilla JavaScript frontend talking to real services. And it's live: you can try it.",
      },
    },
    {
      id: "taller-java",
      title: "Java Workshop",
      repo: "Cajero",
      summary:
        "Java console application with 5 use cases in a single menu—ATM, academic records, online store, address book, and curved grading—solving 25 OOP exercises.",
      stack: ["Java", "POO", "Maven"],
      metrics: [
        { value: "25", label: "exercises" },
        { value: "5", label: "use cases" },
        { value: "19", label: "classes" },
      ],
      repoUrl: "https://github.com/Eidan210/Cajero",
      category: "Java · OOP",
      // Sesión real: compilado con javac y ejecutado con la cuenta de prueba del README (2026-10-13).
      terminal: {
        title: "Cajero — java",
        lines: [
          { out: "$ ", input: "java -cp target/classes com.mycompany.cajero.Cajero" },
          { out: "----------- MENU OPCIONES -----------" },
          { out: "1. Cajero Automatico" },
          { out: "2. Registro Academico" },
          { out: "3. Simulación de Tienda Online" },
          { out: "4. Agenda de Contactos" },
          { out: "5. Sistema de Notas con Curva" },
          { out: "6. Salir" },
          { out: "======================================" },
          { out: "Elija una opcion: ", input: "1" },
          { out: "" },
          { out: "        Cajero Electronico" },
          { out: "Ingrese el titular: ", input: "Ana" },
          { out: "Ingrese su pin: ", input: "1234" },
          { out: "Acceso Permitido. Bienvenido Ana (Cuenta de Ahorro)" },
          { out: "" },
          { out: " ----- MENU CAJERO -----" },
          { out: "1. Consultar Saldo" },
          { out: "2. Depositar" },
          { out: "3. Retirar" },
          { out: "4. Transferir" },
          { out: "5. Estadisticas" },
          { out: "6. Consultar Movimientos" },
          { out: "7. Salir" },
          { out: "================================" },
          { out: "", input: "2" },
          { out: "================================" },
          { out: "Ingrese el monto a depositar: ", input: "50000" },
          { out: "Deposito Realizado Correctamente" },
          { out: "Interes ganado: +$500,00" },
          { out: "Nuevo saldo: 550500.0" },
          { out: "================================" },
        ],
      },
      buddy: {
        challenge:
          "A practice guide with 25 exercises spread across 5 distinct use cases. Solved separately, they would be 25 standalone programs, difficult to run and review.",
        architecture:
          "A console menu and one package per use case. The ATM models inheritance with an abstract Cuenta class yielding savings accounts with interest and checking accounts with overdraft; the address book saves to and loads from a file, academic records export reports to .txt, and numeric inputs catch InputMismatchException to prompt for input again.",
        takeaway:
          "It's his first Java repository and it already uses genuine OOP: abstract classes, inheritance, collections with ArrayList, and validation on every input.",
      },
    },
    {
      id: "examenes",
      title: "Exam Platform",
      repo: "examen",
      summary: "Exam creation and taking with countdown timer and controlled access, built without frameworks.",
      stack: ["JavaScript ES6+", "HTML5", "CSS3"],
      metrics: [
        { value: "3", label: "modules" },
        { value: "66 KB", label: "of JavaScript" },
      ],
      repoUrl: "https://github.com/Eidan210/examen",
      image: "./proyectos/examenes.webp",
      category: "Frontend",
      buddy: {
        challenge: "Assessing students with standalone forms doesn't allow controlling response time or restricting access.",
        architecture:
          "Three independent modules—login, test creation portal, and timed exam environment—sharing state via local storage.",
        takeaway: "State management, timers, and dynamic rendering, all without libraries. This is where you learn how what frameworks hide really works.",
      },
    },
    {
      id: "videojuegos",
      title: "Video Game Search App",
      repo: "Control-De-Apis-JS",
      summary: "RAWG REST API client built with async/await and explicit error handling.",
      stack: ["JavaScript", "APIs REST", "async/await"],
      metrics: [
        { value: "3", label: "filter criteria" },
        { value: "9,7 KB", label: "total size" },
      ],
      repoUrl: "https://github.com/Eidan210/Control-De-Apis-JS",
      image: "./proyectos/videojuegos.webp",
      category: "REST API",
      buddy: {
        challenge: "Displaying data from an external service without reloading the page or crashing when the API fails.",
        architecture:
          "Validates the API key and identifier, verifies the HTTP status, parses JSON, and displays distinct messages for each type of error.",
        takeaway: "The key detail: handling errors in the response, not just the request. A fetch that doesn't throw isn't necessarily a fetch that succeeded.",
      },
    },
    {
      id: "campustech",
      title: "CampusTech v2.0",
      repo: "CampusTech-V2.0-Eidan",
      summary: "Inventory management in Python with modular architecture, input validation, and JSON persistence.",
      stack: ["Python", "JSON", "Arquitectura modular"],
      metrics: [
        { value: "5", label: "modules" },
        { value: "v2.0", label: "rewrite" },
      ],
      repoUrl: "https://github.com/Eidan210/CampusTech-V2.0-Eidan",
      image: "./proyectos/campustech.webp",
      category: "Backend · Python",
      buddy: {
        challenge: "Manual inventory tracking produces inconsistent data, with no traceability or grouping by category.",
        architecture:
          "Five single-responsibility modules—registration, display, reports, data, and menu—with input validation and explicit confirmation before saving.",
        takeaway: "Born from rewriting a monolithic v1. The refactor IS the project: Eidan revisits what already works.",
      },
    },
    {
      id: "gastos",
      title: "Expense Tracker",
      repo: "Moneda",
      summary: "Python CLI to track expenses and aggregate them by day, week, and month, with JSON persistence.",
      stack: ["Python", "JSON", "CLI"],
      metrics: [
        { value: "6", label: "modules" },
        { value: "3", label: "periods" },
      ],
      repoUrl: "https://github.com/Eidan210/Moneda",
      image: "./proyectos/gastos.webp",
      category: "CLI · Python",
      buddy: {
        challenge: "Loose expense notes can't be totaled by time period, filtered, or turned into reports.",
        architecture: "Six dedicated modules—entry, listing, calculation, reporting, data, and menu—with terminal table output.",
        takeaway: "Time-period data aggregation and strict separation of concerns in a compact, well-structured project.",
      },
    },
  ],
};
