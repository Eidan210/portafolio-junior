/**
 * Proyectos destacados. Las capturas salen de la carpeta `docs/` de cada repo
 * y la sesión de consola del taller de Java, de ejecutar el programa real.
 * Fuente de los textos: README de cada repositorio y
 * `Portafolio v3/data/projects.ts` (verificado 2026-09-08). El taller de Java
 * (`Cajero`) se contrastó con su código el 2026-10-13: 19 clases en 6
 * paquetes. Las métricas son cifras del propio repo o del flujo, nunca
 * estimaciones.
 *
 * El bloque `buddy` es lo que cuenta la mascota en el explicador: reformula
 * problema → arquitectura → aprendizaje sin añadir datos nuevos.
 */
import { pick } from "@/i18n/lang";
import { en } from "@/data/en/projects";
import type { Project } from "@/lib/types";

const es = {
  projects: [
  {
    id: "preseleccion",
    title: "Preselección Inteligente de Candidatos",
    repo: "Proyecto_n8n",
    summary:
      "Automatización de reclutamiento de punta a punta: Google Gemini evalúa el CV en PDF contra la vacante y n8n reparte el resultado entre Sheets, Gmail y Telegram.",
    stack: ["n8n", "Google Gemini", "JavaScript", "Google Sheets", "Gmail", "Telegram"],
    metrics: [
      { value: "13", label: "datos por candidato" },
      { value: "39", label: "nodos en n8n" },
      { value: "3", label: "niveles de compatibilidad" },
    ],
    repoUrl: "https://github.com/Eidan210/Proyecto_n8n",
    image: "./proyectos/preseleccion-n8n.webp",
    category: "IA · Automatización",
    buddy: {
      challenge:
        "RR. HH. recibe decenas o cientos de CV en PDF por vacante. Revisarlos a mano toma días, y lo que el candidato escribe en el formulario no siempre coincide con su hoja de vida.",
      architecture:
        "Un flujo de 39 nodos en n8n donde Gemini puntúa la compatibilidad del CV con la vacante y la clasifica en tres niveles: revisión prioritaria desde el 80 %, manual entre el 60 y el 79 % y secundaria por debajo. Se guardan 13 datos por candidato en Sheets, se notifica por Gmail y Telegram, y un bot deja la decisión final en manos del reclutador.",
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
    id: "taller-java",
    title: "Taller de Java",
    repo: "Cajero",
    summary:
      "Consola en Java con 5 casos en un solo menú —cajero automático, registro académico, tienda online, agenda y notas con curva— que resuelve 25 ejercicios de POO.",
    stack: ["Java", "POO", "Maven"],
    metrics: [
      { value: "25", label: "ejercicios" },
      { value: "5", label: "casos" },
      { value: "19", label: "clases" },
    ],
    repoUrl: "https://github.com/Eidan210/Cajero",
    category: "Java · POO",
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
        "Una guía de práctica con 25 ejercicios repartidos en 5 casos distintos. Resueltos por separado serían 25 programas sueltos, difíciles de ejecutar y de revisar.",
      architecture:
        "Un menú de consola y un paquete por caso. El cajero modela la herencia con una Cuenta abstracta de la que salen cuentas de ahorro con interés y corrientes con sobregiro; la agenda se guarda y se carga desde un archivo, el registro académico exporta su reporte a .txt y las entradas numéricas capturan InputMismatchException para volver a pedir el dato.",
      takeaway:
        "Es su primer repositorio en Java y ya usa POO de verdad: clases abstractas, herencia, colecciones con ArrayList y validación de cada entrada.",
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
      { value: "66 KB", label: "de JavaScript" },
    ],
    repoUrl: "https://github.com/Eidan210/examen",
    image: "./proyectos/examenes.webp",
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
    image: "./proyectos/videojuegos.webp",
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
    image: "./proyectos/campustech.webp",
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
    image: "./proyectos/gastos.webp",
    category: "CLI · Python",
    buddy: {
      challenge: "Los apuntes sueltos de gastos no se pueden sumar por periodo, filtrar ni convertir en reporte.",
      architecture: "Seis módulos dedicados —registro, listado, cálculo, reporte, datos y menú— con salida en tablas en la terminal.",
      takeaway: "Agregación de datos por periodo y separación estricta de responsabilidades, en un proyecto pequeño y bien cortado.",
    },
  },
  ] as readonly Project[],
};

/** Forma común de los proyectos: la versión inglesa debe tener exactamente las mismas claves. */
export type ProjectsCopy = typeof es;

export const { projects } = pick({ es, en });

export const projectById = (id: string) => projects.find((p) => p.id === id);
