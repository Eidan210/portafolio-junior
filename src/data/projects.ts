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
 *
 * El bloque `caseStudy` sale del README de cada repo: cada afirmación se
 * contrastó con una cita literal del README o de sus metadatos (2026-10-14).
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
    caseStudy: {
      problem: "Identifiqué que Recursos Humanos tardaba días revisando cientos de hojas de vida en PDF de forma manual.",
      solution: "Construí un flujo en n8n que evalúa el PDF con Google Gemini, registra el resultado en Google Sheets y notifica a RR. HH.",
      decisions: [
        "Configuré un nodo de código para limpiar y validar el JSON devuelto por Gemini, porque no se debe confiar a ciegas en las salidas estructuradas del LLM.",
        "Implementé el bot de Telegram con herramientas de solo lectura y acoté el prompt a modificar únicamente la columna Revision_RRHH, para mantener la decisión final en manos humanas.",
        "Diseñé webhooks con respuesta inmediata 200 y procesamiento posterior, para evitar demoras en la respuesta al portal de postulación.",
      ],
      results: [
        "Implementé el flujo completo en n8n mediante 39 nodos orquestados y persistencia en Google Sheets con 13 columnas.",
        "Establecí tres niveles de compatibilidad: revisión prioritaria con 80 % o más, manual entre 60 y 79 %, y secundaria con menos de 60 %.",
      ],
      learnings: [
        "Aprendí a estructurar prompts para exigir JSON estricto a un LLM y a limpiar el markdown antes de procesarlo.",
        "Reforcé la integración de frontends con automatizaciones mediante webhooks, gestión de CORS y estados de carga.",
      ],
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
    caseStudy: {
      problem: "Identifiqué la necesidad de vender prendas personalizadas sin asumir comisiones de plataformas de terceros ni catálogos cerrados.",
      solution: "Construí una SPA en JavaScript puro sin frameworks, respaldada por flujos en n8n para usuarios, recibos y pedidos.",
      decisions: [
        "Estructuré la navegación mediante un router propio que muestra u oculta secciones dentro de una sola página sin recargar.",
        "Utilicé n8n como backend mediante tres webhooks especializados, para evitar el desarrollo y mantenimiento de un servidor dedicado.",
        "Almacené carrito, favoritos, pedidos y sesión en localStorage y sessionStorage, para conservar el estado en el cliente sin base de datos en frontend.",
      ],
      results: [
        "Integré un personalizador con texto de hasta 50 caracteres, selección de 6 tipografías y vista previa interactiva.",
        "Añadí cálculo automático del IVA del 19 % en el carrito y completé el flujo con confirmación por correo.",
      ],
      learnings: [
        "Aprendí a coordinar una arquitectura frontend sin dependencias externas dividida en ocho módulos con responsabilidad única.",
        "Identifiqué que codificar credenciales en Base64 no equivale a cifrado y requiere algoritmos de hash como bcrypt en producción.",
      ],
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
    caseStudy: {
      problem: "Me propuse consolidar 25 ejercicios prácticos de programación orientada a objetos en un único programa ejecutable.",
      solution: "Construí un menú interactivo por consola que agrupa los ejercicios en paquetes temáticos independientes.",
      decisions: [
        "Diseñé una jerarquía con la clase abstracta Cuenta para reutilizar lógica común entre cuentas corrientes y de ahorro.",
        "Implementé persistencia en archivos planos para guardar y recuperar la agenda de contactos al iniciar o cerrar la aplicación.",
        "Apliqué control de excepciones con try-catch para capturar InputMismatchException cuando el usuario introduce caracteres no numéricos.",
      ],
      results: [
        "Resolví los 25 ejercicios de expansión distribuidos en 19 clases y 6 paquetes organizados.",
        "Configuré la lectura de números con coma decimal conforme al estándar regional colombiano con reintento automático.",
      ],
      learnings: [
        "Practiqué la aplicación de abstracción y polimorfismo para modelar comportamientos bancarios diferenciados.",
        "Reforcé la gestión dinámica de colecciones en memoria empleando ArrayList para registros y contactos sin límite prefijado.",
      ],
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
    caseStudy: {
      problem: "Detecté que evaluar con formularios sin control impedía limitar el tiempo, restringir accesos o calificar objetivamente.",
      solution: "Desarrollé una plataforma web en JavaScript puro para administrar exámenes y resolverlos bajo cuenta regresiva.",
      decisions: [
        "Encapsulé el login y la resolución en Web Components con Shadow DOM para aislar lógica y estructura visual.",
        "Calculé el tiempo restante a partir de la marca temporal inicial para impedir que una recarga reinicie la cuenta atrás.",
        "Centralicé la persistencia en localStorage para almacenar usuarios, catálogo de exámenes y resultados sin dependencias de backend.",
      ],
      results: [
        "Configuré la entrega obligatoria del examen al llegar a cero el cronómetro y el cálculo inmediato de la nota.",
        "Estructuré la solución en módulos que separan login, portal docente y entorno de presentación de pruebas.",
      ],
      learnings: [
        "Comprobé la viabilidad de gestionar estados complejos, render dinámico y vistas sin recurrir a frameworks.",
        "Reconocí el riesgo de almacenar contraseñas en texto plano dentro de localStorage como limitación para entornos productivos.",
      ],
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
    caseStudy: {
      problem: "Necesitaba consumir una API pública de videojuegos asegurando renderizado dinámico y tolerancia a errores de red o parámetros.",
      solution: "Construí un buscador web en JavaScript que consulta la API REST de RAWG con peticiones asíncronas sin recargar la página.",
      decisions: [
        "Validé respuesta.ok y el contenido devuelto además del bloque try-catch, para detectar fallos HTTP que no disparan errores en fetch.",
        "Configuré el parámetro metacritic enviando el mismo valor como mínimo y máximo, para filtrar puntajes exactos según la documentación.",
        "Asigné textos sustitutos mediante el operador lógico or en las plantillas, para prevenir valores indefinidos ante campos ausentes.",
      ],
      results: [
        "Implementé tres modalidades de búsqueda: identificador único, rango de fechas de lanzamiento y calificación de Metacritic.",
        "Añadí validación de presencia de la API key y avisos visuales en rojo ante búsquedas sin coincidencias o entradas inválidas.",
      ],
      learnings: [
        "Adopté la sintaxis async y await para estructurar llamadas asíncronas más limpias frente a promesas encadenadas con then.",
        "Reforcé la práctica de leer a fondo la documentación de APIs para aprovechar filtros específicos como rangos coincidentes.",
      ],
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
    caseStudy: {
      problem: "El registro manual generaba inconsistencias y la versión original del inventario era un script monolítico difícil de mantener.",
      solution: "Reescribí el sistema en Python distribuyendo las funciones en cinco módulos independientes con persistencia en JSON.",
      decisions: [
        "Centralicé la gestión de datos y almacenamiento en Productos.py para que modificaciones en la persistencia no alteren los demás módulos.",
        "Implementé manualmente el ordenamiento por burbuja en lugar de delegar en funciones nativas para ejercitar la algoritmia interna.",
        "Incorporé un mecanismo de recuperación ante archivos JSON dañados para arrancar con lista vacía en lugar de detener la ejecución.",
      ],
      results: [
        "Estructuré el sistema en cinco módulos dedicados a menú, altas, visualización ordenada, categorías únicas y almacenamiento.",
        "Formateé los listados y reportes en terminal mediante tablas fancy_grid generadas con la biblioteca tabulate.",
      ],
      learnings: [
        "Refactoricé código preexistente para transicionar de una estructura monolítica a un esquema desacoplado y mantenible.",
        "Practiqué la validación de datos en la frontera del sistema controlando tipos numéricos, rangos positivos y excepciones ValueError.",
      ],
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
    caseStudy: {
      problem: "Registrar gastos sin estructura impedía totalizar por fechas, filtrar categorías o conciliar movimientos en distintas monedas.",
      solution: "Desarrollé una CLI en Python distribuida en seis módulos que convierte divisas a COP y totaliza por día, semana y mes.",
      decisions: [
        "Aislé la carga y guardado en gastos_data.py para que todos los submódulos operen sobre una única fuente de verdad.",
        "Estandaricé la conversión con tasas de cambio fijas a COP para posibilitar comparaciones sin perder el valor ni la divisa original.",
        "Empleé fechas con formato ISO YYYY-MM-DD para calcular filtros y rangos temporales mediante comparaciones directas de cadenas.",
      ],
      results: [
        "Construí seis módulos de funcionalidad específica protegidos con el bloque condicional if __name__ == '__main__':.",
        "Generé reportes diarios, semanales y mensuales presentados en tablas con formato fancy_grid o exportados a ficheros JSON.",
      ],
      learnings: [
        "Practiqué la separación de responsabilidades distribuyendo menús, operaciones matemáticas y persistencia en módulos independientes.",
        "Reforcé la lógica de agregación temporal mediante filtrado de fechas exactas e intervalos para cálculos periódicos.",
      ],
    },
  },
  ] as readonly Project[],
};

/** Forma común de los proyectos: la versión inglesa debe tener exactamente las mismas claves. */
export type ProjectsCopy = typeof es;

export const { projects } = pick({ es, en });

export const projectById = (id: string) => projects.find((p) => p.id === id);
