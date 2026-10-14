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
      caseStudy: {
        problem: "I identified that HR spent days manually reviewing hundreds of PDF resumes.",
        solution: "I built an n8n workflow that evaluates PDFs with Google Gemini, logs results in Google Sheets, and notifies HR.",
        decisions: [
          "I configured a code node to clean and validate the JSON returned by Gemini, because structured LLM outputs should never be trusted blindly.",
          "I implemented the Telegram bot with read-only tools and scoped the prompt to modify only the Revision_RRHH column, keeping the final decision in human hands.",
          "I designed webhooks with an immediate 200 response and deferred processing to prevent response delays on the job application portal.",
        ],
        results: [
          "I implemented the complete workflow in n8n using 39 orchestrated nodes and persistence in Google Sheets across 13 columns.",
          "I established three compatibility tiers: priority review at 80% or more, manual between 60% and 79%, and secondary with less than 60%.",
        ],
        learnings: [
          "I learned how to structure prompts to enforce strict JSON from an LLM and strip markdown code blocks before processing.",
          "I reinforced frontend integration with automations using webhooks, CORS management, and loading states.",
        ],
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
      caseStudy: {
        problem: "I identified the need to sell custom garments without paying third-party platform commissions or being locked into closed catalogs.",
        solution: "I built a pure JavaScript SPA without frameworks, backed by n8n workflows for users, receipts, and orders.",
        decisions: [
          "I structured navigation using a custom router that toggles section visibility on a single page without reloading.",
          "I used n8n as the backend via three specialized webhooks to avoid developing and maintaining a dedicated server.",
          "I stored cart, favorites, orders, and session state in localStorage and sessionStorage to preserve client-side state without a frontend database.",
        ],
        results: [
          "I integrated a customizer supporting up to 50 characters of text, 6 selectable fonts, and an interactive preview.",
          "I added automatic 19% VAT calculation in the cart and completed the checkout loop with email confirmations.",
        ],
        learnings: [
          "I learned to coordinate a dependency-free frontend architecture divided into eight single-responsibility modules.",
          "I recognized that Base64-encoding credentials is not encryption and requires hashing algorithms like bcrypt in production.",
        ],
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
      caseStudy: {
        problem: "I set out to consolidate 25 practical object-oriented programming exercises into a single executable program.",
        solution: "I built an interactive console menu that groups the exercises into independent thematic packages.",
        decisions: [
          "I designed a class hierarchy with the abstract Cuenta class to reuse shared logic between checking and savings accounts.",
          "I implemented flat-file persistence to save and load the contact address book when opening or closing the application.",
          "I applied exception handling with try-catch to catch InputMismatchException whenever the user enters non-numeric input.",
        ],
        results: [
          "I solved all 25 extension exercises distributed across 19 classes and 6 organized packages.",
          "I configured decimal reading with comma separators according to the Colombian regional standard with automatic retries.",
        ],
        learnings: [
          "I practiced applying abstraction and polymorphism to model differentiated banking behaviors.",
          "I reinforced dynamic in-memory collection management using ArrayList for records and contacts without predefined size limits.",
        ],
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
      caseStudy: {
        problem: "I identified that evaluating students with uncontrolled forms prevented setting time limits, restricting access, or grading objectively.",
        solution: "I developed a pure JavaScript web platform to manage exams and take them under a countdown timer.",
        decisions: [
          "I encapsulated login and exam taking into Web Components with Shadow DOM to isolate logic and visual styling.",
          "I calculated remaining time from the initial timestamp to prevent page refreshes from resetting the countdown.",
          "I centralized persistence in localStorage to store users, exam catalogs, and test results without backend dependencies.",
        ],
        results: [
          "I configured mandatory exam submission when the countdown reaches zero alongside instant score calculation.",
          "I structured the solution into modules separating login, instructor portal, and the testing environment.",
        ],
        learnings: [
          "I proved the viability of managing complex state, dynamic rendering, and views without relying on frameworks.",
          "I recognized the security risk of storing plaintext passwords in localStorage as a limitation for production environments.",
        ],
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
      caseStudy: {
        problem: "I needed to consume a public video game API ensuring dynamic rendering and resilience to network or parameter errors.",
        solution: "I built a web search app in JavaScript that queries the RAWG REST API with asynchronous requests without reloading the page.",
        decisions: [
          "I validated response.ok and payload content alongside the try-catch block to catch HTTP failures that do not trigger fetch errors.",
          "I configured the metacritic parameter by sending the same value as minimum and maximum to filter exact scores per the documentation.",
          "I assigned fallback text using the logical OR operator in templates to prevent undefined values when fields were missing.",
        ],
        results: [
          "I implemented three search modes: unique identifier, release date range, and Metacritic score.",
          "I added API key validation and red visual warnings for empty query results or invalid inputs.",
        ],
        learnings: [
          "I adopted async/await syntax to write cleaner asynchronous calls compared to chained promises with then.",
          "I reinforced the habit of reading API documentation thoroughly to take advantage of specific filters like matching ranges.",
        ],
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
      caseStudy: {
        problem: "Manual record-keeping led to inconsistencies, and the original inventory version was a monolithic script that was difficult to maintain.",
        solution: "I rewrote the system in Python, distributing functionality across five independent modules with JSON persistence.",
        decisions: [
          "I centralized data management and storage in Productos.py so changes to persistence would not affect other modules.",
          "I manually implemented bubble sort instead of delegating to built-in functions to exercise core algorithms.",
          "I incorporated a recovery mechanism for corrupted JSON files to start with an empty list instead of crashing execution.",
        ],
        results: [
          "I structured the system into five modules dedicated to menu, product creation, sorted display, unique categories, and storage.",
          "I formatted terminal listings and reports using fancy_grid tables generated with the tabulate library.",
        ],
        learnings: [
          "I refactored legacy code to transition from a monolithic structure to a decoupled, maintainable architecture.",
          "I practiced data validation at system boundaries by verifying numeric types, positive ranges, and handling ValueError exceptions.",
        ],
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
      caseStudy: {
        problem: "Unstructured expense tracking made it impossible to total by date, filter categories, or reconcile transactions across different currencies.",
        solution: "I developed a Python CLI across six modules that converts currencies to COP and totals expenses by day, week, and month.",
        decisions: [
          "I isolated loading and saving in gastos_data.py so all submodules operate on a single source of truth.",
          "I standardized conversion using fixed COP exchange rates to enable comparisons without losing the original currency or value.",
          "I used ISO YYYY-MM-DD dates to calculate filters and time ranges through direct string comparisons.",
        ],
        results: [
          "I built six single-purpose modules protected with the if __name__ == '__main__': conditional block.",
          "I generated daily, weekly, and monthly reports presented in fancy_grid tables or exported to JSON files.",
        ],
        learnings: [
          "I practiced separation of concerns by distributing menus, mathematical operations, and persistence across independent modules.",
          "I reinforced time-based aggregation logic using exact date matching and range filtering for periodic calculations.",
        ],
      },
    },
  ],
};
