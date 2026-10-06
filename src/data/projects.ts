/**
 * Proyectos destacados. Fuente: README de cada repositorio y
 * `Portafolio v3/data/projects.ts` (verificado 2026-09-08). Las métricas son
 * cifras del propio repo o del flujo, nunca estimaciones.
 *
 * El bloque `buddy` es lo que cuenta la mascota en el explicador: reformula
 * problema → arquitectura → aprendizaje sin añadir datos nuevos.
 */
import type { Project } from "@/lib/types";

export const projects: readonly Project[] = [
  {
    id: "preseleccion",
    title: "Preselección Inteligente de Candidatos",
    repo: "Proyecto_n8n",
    summary:
      "Automatización de reclutamiento de punta a punta: Google Gemini evalúa el CV en PDF contra la vacante y n8n reparte el resultado entre Sheets, Gmail y Telegram.",
    stack: ["n8n", "Google Gemini", "JavaScript", "Google Sheets", "Gmail", "Telegram"],
    metrics: [
      { value: "13", label: "datos por candidato" },
      { value: "5", label: "competencias ponderadas" },
      { value: "65 %", label: "umbral de avance" },
    ],
    repoUrl: "https://github.com/Eidan210/Proyecto_n8n",
    image: "./proyectos/preseleccion-n8n.webp",
    category: "IA · Automatización",
    buddy: {
      challenge:
        "RR. HH. recibe decenas o cientos de CV en PDF por vacante. Revisarlos a mano toma días, y lo que el candidato escribe en el formulario no siempre coincide con su hoja de vida.",
      architecture:
        "Un flujo en n8n donde Gemini puntúa 5 competencias ponderadas y decide contra un umbral del 65 %. Se guardan 13 datos por candidato en Sheets, se notifica por Gmail y Telegram, y un bot deja la decisión final en manos del reclutador.",
      takeaway:
        "Lo que más me gusta: la IA propone, pero el humano decide. Es human-in-the-loop por diseño, no por accidente.",
    },
  },
  {
    id: "mym",
    title: "Mym Designsx",
    repo: "Proyecto-Automatizacion-mym",
    summary:
      "Tienda de prendas personalizables como SPA en JavaScript puro, con backend de automatización en n8n, PostgreSQL, Gmail y Google Sheets.",
    stack: ["JavaScript", "n8n", "PostgreSQL", "Gmail", "Google Sheets"],
    metrics: [
      { value: "8", label: "módulos JS" },
      { value: "19 %", label: "IVA en checkout" },
    ],
    repoUrl: "https://github.com/Eidan210/Proyecto-Automatizacion-mym",
    demoUrl: "https://eidan210.github.io/Proyecto-Automatizacion-mym/app/index.html",
    image: "./proyectos/mym-designsx.webp",
    category: "Live · Full flow",
    buddy: {
      challenge:
        "Una tienda de productos personalizados necesita que el cliente diseñe su prenda, compre y reciba su recibo sin depender de una plataforma de e-commerce de terceros.",
      architecture:
        "SPA sin frameworks en 8 módulos de responsabilidad única: catálogo, personalizador, carrito con IVA, auth y panel admin. n8n hace de backend: persiste usuarios en PostgreSQL, envía el recibo por Gmail y registra pedidos en Sheets.",
      takeaway: "Un frontend grande en JavaScript vanilla que habla con servicios reales. Y está desplegado: puedes probarlo.",
    },
  },
  {
    id: "examenes",
    title: "Plataforma de Exámenes",
    repo: "examen",
    summary: "Creación y resolución de exámenes con temporizador y acceso controlado, sin frameworks.",
    stack: ["JavaScript ES6+", "HTML5", "CSS3"],
    metrics: [
      { value: "3", label: "módulos" },
      { value: "111 KB", label: "de JavaScript" },
    ],
    repoUrl: "https://github.com/Eidan210/examen",
    category: "Frontend",
    buddy: {
      challenge: "Evaluar con formularios sueltos no permite controlar el tiempo de respuesta ni quién accede.",
      architecture:
        "Tres módulos independientes —login, portal de creación y resolución con cuenta atrás— que comparten estado por almacenamiento local.",
      takeaway: "Estado, temporizadores y render dinámico, todo sin librerías. Aquí se aprende cómo funciona lo que los frameworks esconden.",
    },
  },
  {
    id: "videojuegos",
    title: "Buscador de Videojuegos",
    repo: "Control-De-Apis-JS",
    summary: "Cliente de la API REST de RAWG con async/await y manejo explícito de errores.",
    stack: ["JavaScript", "APIs REST", "async/await"],
    metrics: [
      { value: "3", label: "criterios de filtrado" },
      { value: "9,7 KB", label: "peso total" },
    ],
    repoUrl: "https://github.com/Eidan210/Control-De-Apis-JS",
    category: "API REST",
    buddy: {
      challenge: "Mostrar datos de un servicio externo sin recargar la página ni romperse cuando la API falla.",
      architecture:
        "Valida la API key y el identificador, verifica el estado HTTP, procesa el JSON y muestra un mensaje distinto para cada tipo de fallo.",
      takeaway: "El detalle clave: controla errores en la respuesta, no solo en la petición. Un fetch que no lanza no es un fetch que funcionó.",
    },
  },
  {
    id: "campustech",
    title: "CampusTech v2.0",
    repo: "CampusTech-V2.0-Eidan",
    summary: "Gestión de inventario en Python con arquitectura modular, validación y persistencia en JSON.",
    stack: ["Python", "JSON", "Arquitectura modular"],
    metrics: [
      { value: "5", label: "módulos" },
      { value: "v2.0", label: "reescritura" },
    ],
    repoUrl: "https://github.com/Eidan210/CampusTech-V2.0-Eidan",
    category: "Backend · Python",
    buddy: {
      challenge: "Un inventario llevado a mano genera datos inconsistentes, sin trazabilidad ni agrupación por categoría.",
      architecture:
        "Cinco módulos de responsabilidad única —registro, visualización, reportes, datos y menú— con validación de entrada y confirmación explícita antes de guardar.",
      takeaway: "Nació de reescribir una v1 monolítica. La refactorización ES el proyecto: Eidan revisa lo que ya funciona.",
    },
  },
  {
    id: "gastos",
    title: "Reporte de Gastos",
    repo: "Moneda",
    summary: "CLI en Python para registrar gastos y agregarlos por día, semana y mes, con persistencia en JSON.",
    stack: ["Python", "JSON", "CLI"],
    metrics: [
      { value: "6", label: "módulos" },
      { value: "3", label: "periodos" },
    ],
    repoUrl: "https://github.com/Eidan210/Moneda",
    category: "CLI · Python",
    buddy: {
      challenge: "Los apuntes sueltos de gastos no se pueden sumar por periodo, filtrar ni convertir en reporte.",
      architecture: "Seis módulos dedicados —registro, listado, cálculo, reporte, datos y menú— con salida en tablas en la terminal.",
      takeaway: "Agregación de datos por periodo y separación estricta de responsabilidades, en un proyecto pequeño y bien cortado.",
    },
  },
];

export const projectById = (id: string) => projects.find((p) => p.id === id);
