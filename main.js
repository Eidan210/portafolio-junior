/* ============================================================
   Portafolio — Eidan Cuadros
   JavaScript puro (ES6+), sin dependencias externas.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CONFIGURACIÓN
     ---------------------------------------------------------- */
  const CONFIG = {
    github: 'https://github.com/Eidan210'
  };

  /* ----------------------------------------------------------
     2. PROYECTOS
     Selección hecha con Antigravity CLI (agy) sobre el análisis
     de repositorios, y verificada contra el código real de cada
     repo vía la API de GitHub.

     Para publicar una demo: activa GitHub Pages en el repo y pega
     la URL en `demo_url`. El botón "Ver demo" aparece solo.
     ---------------------------------------------------------- */
  const PROJECTS = [
    {
      nombre: 'Preselección Inteligente de Candidatos',
      repo: 'Proyecto_n8n',
      enlace_repo: 'https://github.com/Eidan210/Proyecto_n8n',
      demo_url: '',
      // Captura real de la interfaz. Es opcional: sin `imagen`, la tarjeta
      // muestra la vista previa de código como portada.
      imagen: 'img/proyectos/preseleccion-n8n.webp',
      imagen_alt: 'Formulario de postulación del portal: datos del candidato, vacante y carga del CV en PDF.',
      privado: false,
      destacado: true,
      tecnologias: ['n8n', 'Google Gemini', 'JavaScript', 'HTML5', 'CSS3'],
      descripcion_corta:
        'Automatización de reclutamiento con IA: evalúa CVs, puntúa candidatos y avisa al equipo de RRHH.',
      problema_resuelto:
        'Recursos Humanos recibe decenas o cientos de currículums en PDF por vacante. Revisarlos a mano ' +
        'toma días, y lo que el candidato escribe en el formulario no siempre coincide con lo que dice su ' +
        'hoja de vida.',
      solucion:
        'Flujo automatizado de punta a punta orquestado con n8n: recibe la postulación y el PDF desde un ' +
        'portal web propio, lee y evalúa el CV con Google Gemini calculando un porcentaje de compatibilidad ' +
        'contra los requisitos reales del puesto, guarda 13 datos por candidato en Google Sheets, envía ' +
        'correos automáticos al candidato y a RRHH, y alerta por Telegram. Incluye un bot y un dashboard web ' +
        'para que el reclutador conserve la decisión final (human-in-the-loop).',
      habilidad_clave:
        'Integración de múltiples servicios en un flujo automatizado, uso de IA aplicada a un problema de negocio real y diseño con human-in-the-loop.',
      preview: {
        file: 'arquitectura del flujo',
        lang: 'txt',
        code: [
          'Portal web  →  n8n  →  Google Gemini',
          '                │           │',
          '                │           └→ % de compatibilidad (sin sesgos)',
          '                │',
          '                ├→ Google Sheets   (13 datos por candidato)',
          '                ├→ Gmail           (ticket al candidato + reporte a RRHH)',
          '                └→ Telegram        (alerta instantanea + bot de decision)',
          '',
          'Dashboard web  →  el reclutador decide  (human-in-the-loop)'
        ].join('\n')
      }
    },

    {
      nombre: 'Mym Designsx',
      repo: 'Proyecto-Automatizacion-mym',
      enlace_repo: 'https://github.com/Eidan210/Proyecto-Automatizacion-mym',
      demo_url: 'https://eidan210.github.io/Proyecto-Automatizacion-mym/',
      imagen: 'img/proyectos/mym-designsx.webp',
      imagen_alt: 'Portada de la tienda: titular, catálogo destacado y accesos a personalizar el producto.',
      privado: false,
      tecnologias: ['JavaScript', 'HTML5', 'CSS3', 'n8n'],
      descripcion_corta:
        'Tienda de productos personalizados en JavaScript puro, con backend de automatización en n8n.',
      problema_resuelto:
        'Una tienda de productos personalizados necesita que el cliente diseñe su propia prenda, ' +
        'compre en línea y reciba su recibo, sin depender de una plataforma de e-commerce de terceros.',
      solucion:
        'Tienda web completa construida como SPA en JavaScript puro, sin frameworks: catálogo con filtros, ' +
        'personalizador de prendas (texto, tipografía, color e imagen propia), carrito con cálculo de IVA del 19%, ' +
        'registro/login, panel de administración y modo claro-oscuro. El backend se resuelve con flujos de n8n que ' +
        'persisten usuarios en PostgreSQL, envían el recibo por Gmail y registran los pedidos en Google Sheets.',
      habilidad_clave:
        'Arquitectura de un frontend grande en JS vanilla: 8 módulos con responsabilidad única e integración con servicios externos.',
      preview: {
        file: 'estructura del proyecto',
        lang: 'txt',
        code: [
          'js/',
          '├── data.js         → productos, categorias y datos',
          '├── n8n.js          → funciones que conectan con n8n',
          '├── app.js          → router, tema oscuro/claro, renders',
          '├── auth.js         → registro, login y perfil',
          '├── cart.js         → carrito de compras',
          '├── customizer.js   → personalizador de productos',
          '├── orders.js       → checkout y tickets de compra',
          '└── admin.js        → panel de administracion'
        ].join('\n')
      }
    },

    {
      nombre: 'Control de APIs',
      repo: 'Control-De-Apis-JS',
      enlace_repo: 'https://github.com/Eidan210/Control-De-Apis-JS',
      demo_url: '',
      privado: false,
      tecnologias: ['JavaScript', 'HTML5', 'CSS3'],
      descripcion_corta:
        'Cliente web que consume la API de RAWG con Fetch y control de errores.',
      problema_resuelto:
        'Una interfaz necesita mostrar información que vive en un servicio externo y responder al usuario ' +
        'sin recargar la página ni romperse cuando la API devuelve un error.',
      solucion:
        'Aplicación que consume la API pública de RAWG (videojuegos) con Fetch y async/await: valida la API Key ' +
        'y el ID antes de consultar, verifica el estado de la respuesta, procesa el JSON y lo renderiza en el DOM, ' +
        'con mensajes de error claros para cada caso de fallo.',
      habilidad_clave:
        'Consumo de APIs REST, manejo de asincronía con async/await y control de errores en la respuesta.',
      preview: {
        file: 'script.js',
        lang: 'js',
        code: [
          'const API_URL = "https://api.rawg.io/api/games";',
          '',
          'async function consultarId() {',
          '    const apiKey = document.getElementById("apiKey").value;',
          '    const juegoId = document.getElementById("IdInput").value;',
          '    if (!juegoId) {',
          '        return MostrarError("Por favor ingresa el nombre o ID del juego");',
          '    }',
          '    const url = `${API_URL}/${juegoId}?key=${apiKey}`;',
          '    try {',
          '        const respuesta = await fetch(url);',
          '        const datos = await respuesta.json();',
          '        if (!respuesta.ok || !datos.name) {',
          '            return MostrarError("El ID no tiene contenido.");',
          '        }',
          '    }'
        ].join('\n')
      }
    },

    {
      nombre: 'CampusTech v2.0',
      repo: 'CampusTech-V2.0-Eidan',
      enlace_repo: 'https://github.com/Eidan210/CampusTech-V2.0-Eidan',
      demo_url: '',
      privado: false,
      tecnologias: ['Python', 'JSON'],
      descripcion_corta:
        'Sistema modular de inventario tecnológico en Python con persistencia en JSON.',
      problema_resuelto:
        'Llevar un inventario de productos tecnológicos a mano genera datos inconsistentes y sin trazabilidad: ' +
        'no hay forma rápida de registrar, consultar ni agrupar el stock por categoría.',
      solucion:
        'Sistema de gestión en Python dividido en cinco módulos con responsabilidad única (registro, visualización, ' +
        'reporte por categorías y capa de datos). Menú por consola con validación de entrada, persistencia en JSON ' +
        'y confirmación explícita de guardado antes de cerrar el programa.',
      habilidad_clave:
        'Programación modular en Python, separación de responsabilidades y persistencia de datos.',
      preview: {
        file: 'menu.py',
        lang: 'py',
        code: [
          '==========================================================',
          '        Sistema Modular de Gestion "CampusTech v2.0"',
          '==========================================================',
          'Seleccione una opcion:',
          '',
          '1. Registrar Producto Tecnologico',
          '2. Visualizar Productos',
          '3. Reporte de Categorias',
          '4. Salir',
          '==========================================================',
          'Cual Opcion desea usar hoy: _'
        ].join('\n')
      }
    },

    {
      nombre: 'Simulador de Gasto Diario',
      repo: 'Moneda',
      enlace_repo: 'https://github.com/Eidan210/Moneda',
      demo_url: '',
      privado: false,
      tecnologias: ['Python', 'JSON'],
      descripcion_corta:
        'Gestor de gastos por consola con seis módulos y totales por periodo.',
      problema_resuelto:
        'Sin un registro estructurado de gastos es imposible saber en qué se va el dinero: los apuntes sueltos ' +
        'no se pueden sumar por periodo, filtrar ni convertir en un reporte.',
      solucion:
        'Aplicación de consola en Python repartida en seis módulos con una responsabilidad cada uno ' +
        '(registro, listado, cálculo, reporte, capa de datos y menú). Calcula totales diarios, semanales y ' +
        'mensuales, presenta los resultados en tablas con tabulate, valida la entrada del usuario y persiste ' +
        'los datos en JSON entre ejecuciones.',
      habilidad_clave:
        'Separación de responsabilidades, agregación de datos por periodo y uso de guard `if __name__ == "__main__"`.',
      preview: {
        file: 'menu.py',
        lang: 'py',
        code: [
          'from gastos_calculo import total_gastos',
          'from gastos_registro import registrar_Nuevo_Gasto',
          'from gastos_reporte import reporte',
          'from gastos_listado import Listar_gastos',
          'from gastos_data import cargar_gastos',
          '',
          'def menu_principal():',
          '    cargar_gastos()',
          '    while True:',
          '        print("Simulador de Gasto Diario")',
          '        try:',
          '            opcion = int(input("Cual Opcion desea usar hoy: "))',
          '            if opcion == 1:',
          '                registrar_Nuevo_Gasto()',
          '        except ValueError:',
          '            print("Eliga una opcion Valida")'
        ].join('\n')
      }
    }
  ];

  /* ----------------------------------------------------------
     3. UTILIDADES
     ---------------------------------------------------------- */

  /** Escapa solo los caracteres que rompen el HTML. */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const KEYWORDS = {
    js: ['const', 'let', 'var', 'async', 'await', 'function', 'return', 'try',
         'catch', 'if', 'else', 'new', 'class', 'import', 'export', 'from'],
    py: ['def', 'return', 'import', 'from', 'while', 'for', 'in', 'if', 'elif',
         'else', 'try', 'except', 'break', 'print', 'input', 'True', 'False']
  };

  /**
   * Resaltado de sintaxis mínimo: recorre la línea separando primero
   * cadenas y comentarios, y solo después marca palabras clave en el
   * texto restante. Así una palabra clave dentro de un string no se pinta.
   */
  function highlightLine(line, lang) {
    const keywords = KEYWORDS[lang] || [];
    const commentToken = lang === 'py' ? '#' : '//';
    const quotes = lang === 'js' ? ['"', "'", '`'] : ['"', "'"];
    let out = '';
    let buffer = '';

    const flushBuffer = function () {
      if (!buffer) return;
      let text = esc(buffer);
      if (keywords.length) {
        const re = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
        text = text.replace(re, '<span class="c-key">$1</span>');
      }
      text = text.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="c-num">$1</span>');
      out += text;
      buffer = '';
    };

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      // Comentario: consume el resto de la línea.
      if (line.startsWith(commentToken, i)) {
        flushBuffer();
        out += '<span class="c-com">' + esc(line.slice(i)) + '</span>';
        return out;
      }

      // Cadena de texto: consume hasta la comilla de cierre.
      if (quotes.indexOf(char) !== -1) {
        flushBuffer();
        let end = i + 1;
        while (end < line.length && line[end] !== char) {
          if (line[end] === '\\') end++; // salta el carácter escapado
          end++;
        }
        out += '<span class="c-str">' + esc(line.slice(i, end + 1)) + '</span>';
        i = end;
        continue;
      }

      buffer += char;
    }

    flushBuffer();
    return out;
  }

  function highlight(code, lang) {
    if (lang !== 'js' && lang !== 'py') return esc(code);
    return code.split('\n').map(function (line) {
      return highlightLine(line, lang);
    }).join('\n');
  }

  /* ----------------------------------------------------------
     4. RENDER DE PROYECTOS
     ---------------------------------------------------------- */
  /* Identificador seguro para view-transition-name y para los id del DOM:
     los nombres de repo traen puntos y mayúsculas que no son válidos como
     custom-ident de CSS. */
  function idSeguro(texto) {
    return String(texto).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function bloqueCodigo(project) {
    return [
      '<div class="project-preview">',
      '  <div class="preview-bar">',
      '    <span class="dot dot-red"></span>',
      '    <span class="dot dot-yellow"></span>',
      '    <span class="dot dot-green"></span>',
      '    <span class="preview-file">' + esc(project.preview.file) + '</span>',
      '  </div>',
      '  <pre class="preview-code"><code>' + highlight(project.preview.code, project.preview.lang) + '</code></pre>',
      '</div>'
    ].join('\n');
  }

  function buildProjectCard(project, index) {
    const article = document.createElement('article');
    article.className = 'card project-card reveal' + (project.destacado ? ' project-card-featured' : '');
    article.dataset.tech = project.tecnologias.join(',');

    // Cada tarjeta necesita un nombre propio para que la View Transition
    // sepa qué elemento se mueve a dónde al filtrar.
    const slug = idSeguro(project.repo);
    article.style.viewTransitionName = 'proyecto-' + slug;

    const num = String(index + 1).padStart(2, '0');
    const tags = project.tecnologias.map(function (tech) {
      return '<li class="tag">' + esc(tech) + '</li>';
    }).join('');

    // Portada: la captura real si existe; si no, la vista previa de código.
    // width/height evitan el salto de maquetación mientras carga la imagen.
    const portada = project.imagen
      ? '<div class="project-cover">' +
        '<img class="project-shot" src="' + esc(project.imagen) + '" ' +
        'alt="' + esc(project.imagen_alt || ('Captura de ' + project.nombre)) + '" ' +
        'width="960" height="600" loading="lazy" decoding="async">' +
        '</div>'
      : bloqueCodigo(project);

    // Botón de código: si el repo es privado no generamos un enlace muerto.
    const codeBtn = project.privado
      ? '<span class="btn btn-outline btn-sm" aria-disabled="true" title="Repositorio privado por ahora">Código privado</span>'
      : '<a class="btn btn-outline btn-sm" href="' + esc(project.enlace_repo) + '" target="_blank" rel="noopener noreferrer" ' +
        'aria-label="Ver el código de ' + esc(project.nombre) + ' en GitHub">Ver código en GitHub</a>';

    // Botón de demo: solo si existe una URL real desplegada.
    const demoBtn = project.demo_url
      ? '<a class="btn btn-primary btn-sm" href="' + esc(project.demo_url) + '" target="_blank" rel="noopener noreferrer" ' +
        'aria-label="Ver la demo en vivo de ' + esc(project.nombre) + '">Ver demo</a>'
      : '';

    // Abre el caso de estudio. Se marca con data-caso para que initCasos lo
    // enlace con su <dialog>; sin JavaScript el botón no llega a existir.
    const casoBtn =
      '<button class="btn btn-ghost btn-sm project-caso-btn" type="button" data-caso="caso-' + slug + '" ' +
      'aria-label="Abrir el caso de estudio de ' + esc(project.nombre) + '">' +
      '<span aria-hidden="true">◆</span> Caso de estudio</button>';

    const badges = [];
    if (project.destacado) badges.push('<span class="tag-featured">★ destacado</span>');
    if (project.privado) badges.push('<span class="tag-private">repo privado</span>');
    const headAside = badges.length
      ? '<span class="project-badges">' + badges.join('') + '</span>'
      : '<span class="project-index">' + num + '</span>';

    article.innerHTML = [
      portada,

      '<header class="project-head">',
      '  <div>',
      '    <h3 class="project-title">' + esc(project.nombre) + '</h3>',
      '    <p class="project-repo">Eidan210/' + esc(project.repo) + '</p>',
      '    <p class="project-summary">' + esc(project.descripcion_corta) + '</p>',
      '  </div>',
      '  ' + headAside,
      '</header>',

      '<ul class="project-tags">' + tags + '</ul>',

      '<footer class="project-actions">' + casoBtn + codeBtn + demoBtn + '</footer>'
    ].join('\n');

    return article;
  }

  /* El detalle largo (problema, solución y habilidad clave) vive aquí en vez
     de en la tarjeta: la rejilla queda escaneable y la profundidad está a un
     clic. <dialog> aporta gratis la captura de foco y el cierre con Escape. */
  function buildProjectDialog(project) {
    const slug = idSeguro(project.repo);
    const dialog = document.createElement('dialog');
    dialog.className = 'caso';
    dialog.id = 'caso-' + slug;
    dialog.setAttribute('aria-labelledby', 'caso-titulo-' + slug);

    // El código solo se repite aquí si la tarjeta lo cedió a la captura.
    const codigo = project.imagen ? bloqueCodigo(project) : '';

    dialog.innerHTML = [
      '<div class="caso-panel">',
      '  <header class="caso-head">',
      '    <div>',
      '      <p class="caso-eyebrow">Caso de estudio</p>',
      '      <h3 class="caso-titulo" id="caso-titulo-' + slug + '">' + esc(project.nombre) + '</h3>',
      '      <p class="caso-repo">Eidan210/' + esc(project.repo) + '</p>',
      '    </div>',
      '    <button class="caso-cerrar" type="button" aria-label="Cerrar el caso de estudio">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
      '    </button>',
      '  </header>',

      '  <div class="caso-cuerpo">',
      '    <div class="caso-bloque">',
      '      <span class="project-block-label">El problema</span>',
      '      <p class="project-text">' + esc(project.problema_resuelto) + '</p>',
      '    </div>',
      '    <div class="caso-bloque">',
      '      <span class="project-block-label">La solución</span>',
      '      <p class="project-text">' + esc(project.solucion) + '</p>',
      '    </div>',
      '    <p class="project-skill">',
      '      <span class="project-skill-icon" aria-hidden="true">◆</span>',
      '      <span><strong>Habilidad clave:</strong> ' + esc(project.habilidad_clave) + '</span>',
      '    </p>',
      codigo,
      '  </div>',
      '</div>'
    ].join('\n');

    return dialog;
  }

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    const casos = document.createDocumentFragment();

    PROJECTS.forEach(function (project, i) {
      fragment.appendChild(buildProjectCard(project, i));
      casos.appendChild(buildProjectDialog(project));
    });

    grid.appendChild(fragment);
    document.body.appendChild(casos);
  }

  /* ----------------------------------------------------------
     4b. CASOS DE ESTUDIO EN <dialog>
     ---------------------------------------------------------- */
  function initCasos() {
    const botones = document.querySelectorAll('.project-caso-btn');
    if (!botones.length) return;

    botones.forEach(function (boton) {
      boton.addEventListener('click', function () {
        const dialog = document.getElementById(boton.dataset.caso);
        if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
      });
    });

    document.querySelectorAll('dialog.caso').forEach(function (dialog) {
      const cerrar = dialog.querySelector('.caso-cerrar');
      if (cerrar) cerrar.addEventListener('click', function () { dialog.close(); });

      // Clic en el fondo: el <dialog> ocupa toda la ventana y el panel va
      // dentro, así que un clic cuyo destino sea el propio dialog cae fuera.
      dialog.addEventListener('click', function (evento) {
        if (evento.target === dialog) dialog.close();
      });
    });
  }

  /* ----------------------------------------------------------
     5. FILTROS POR TECNOLOGÍA
     ---------------------------------------------------------- */
  function initFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    if (!chips.length) return;

    // El navegador anima el reflujo de la rejilla comparando el antes y el
    // después de este callback. Cada tarjeta lleva su view-transition-name
    // (lo asigna buildProjectCard), así que las que siguen visibles se
    // deslizan a su nueva posición en lugar de saltar.
    const aplicar = function (filter) {
      document.querySelectorAll('.project-card').forEach(function (card) {
        const techs = (card.dataset.tech || '').split(',');
        const visible = filter === 'todos' || techs.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !visible);
      });
    };

    // Sin soporte de View Transitions —o con movimiento reducido— se aplica
    // el filtro directamente: mismo resultado, sin animación.
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conTransicion = function (filter) {
      if (quieto || typeof document.startViewTransition !== 'function') {
        aplicar(filter);
        return;
      }
      document.startViewTransition(function () { aplicar(filter); });
    };

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (other) {
          const active = other === chip;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', String(active));
        });

        conTransicion(chip.dataset.filter);
      });
    });
  }

  /* ----------------------------------------------------------
     5b. STACK TÉCNICO: pestañas de categoría y brillo del cursor

     Sin JavaScript la rejilla se ve completa y estática: el filtrado y
     el brillo son mejoras progresivas, nunca requisitos para leerla.
     ---------------------------------------------------------- */
  function initTechLab() {
    const grid = document.getElementById('techGrid');
    if (!grid) return;

    const items = Array.prototype.slice.call(grid.querySelectorAll('.tech-item'));
    const tabs = Array.prototype.slice.call(document.querySelectorAll('.tech-tab'));
    const status = document.getElementById('techStatus');
    if (!items.length || !tabs.length) return;

    /* ---- Filtrado por categoría ---- */
    let finAnimacion = 0;

    const filtrar = function (categoria, etiqueta) {
      let visibles = 0;

      items.forEach(function (item) {
        const coincide = categoria === 'todo' || item.dataset.stack === categoria;
        item.classList.toggle('is-hidden', !coincide);

        if (coincide) {
          // Entrada escalonada: 30 ms por tarjeta, con tope de 240 ms para
          // que el último elemento no se haga esperar.
          item.style.setProperty('--d', Math.min(visibles * 30, 240) + 'ms');
          visibles += 1;
        }
      });

      // Quitar y reponer la clase reinicia la animación en cada filtrado.
      // La lectura de offsetWidth fuerza el reflujo intermedio.
      grid.classList.remove('is-filtering');
      void grid.offsetWidth;
      grid.classList.add('is-filtering');

      window.clearTimeout(finAnimacion);
      finAnimacion = window.setTimeout(function () {
        grid.classList.remove('is-filtering');
      }, 600);

      if (status) {
        status.textContent = visibles + ' tecnologías en ' + etiqueta + '.';
      }
    };

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (otro) {
          const activo = otro === tab;
          otro.classList.toggle('is-active', activo);
          otro.setAttribute('aria-pressed', String(activo));
        });

        // El primer nodo de texto es el rótulo; el <span> lleva el contador.
        const rotulo = tab.firstChild ? tab.firstChild.textContent.trim() : '';
        filtrar(tab.dataset.stack, rotulo || tab.dataset.stack);
      });
    });

    /* ---- Brillo radial que sigue al cursor ----
       Se descarta con "movimiento reducido" y en punteros gruesos
       (táctil), donde el hover no existe. En ese caso el CSS deja el
       brillo centrado y solo hace fundido. */
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (quieto || !punteroFino) return;

    let pendiente = false;
    let ultimo = null;

    grid.addEventListener('pointermove', function (evento) {
      const item = evento.target.closest && evento.target.closest('.tech-item');
      if (!item) return;

      ultimo = { item: item, x: evento.clientX, y: evento.clientY };
      if (pendiente) return;

      // Una sola escritura por fotograma: getBoundingClientRect fuerza
      // cálculo de estilo y no conviene repetirlo en cada pointermove.
      pendiente = true;
      window.requestAnimationFrame(function () {
        pendiente = false;
        if (!ultimo) return;
        const caja = ultimo.item.getBoundingClientRect();
        ultimo.item.style.setProperty('--mx', (ultimo.x - caja.left) + 'px');
        ultimo.item.style.setProperty('--my', (ultimo.y - caja.top) + 'px');
      });
    });
  }

  /* ----------------------------------------------------------
     5c. TERMINAL DEL HERO: EFECTO DE TECLEO

     El HTML ya trae la sesión completa escrita: esto solo la vacía y la
     vuelve a componer. Si no hay JavaScript, si el usuario pidió movimiento
     reducido o si algo falla, la terminal se queda tal cual, legible.
     ---------------------------------------------------------- */
  function initTerminal() {
    const code = document.querySelector('.terminal-body code');
    if (!code) return;

    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (quieto || !('IntersectionObserver' in window)) return;

    const completo = code.innerHTML;

    // Se descompone el árbol original en piezas. Los nodos de texto son lo
    // que el usuario "escribe"; los <span> son prompts y salidas, que en una
    // terminal real aparecen de golpe.
    const piezas = [];
    let cursor = null;

    Array.prototype.slice.call(code.childNodes).forEach(function (nodo) {
      if (nodo.nodeType === 3) {
        piezas.push({ texto: nodo.nodeValue });
        return;
      }
      const clase = nodo.className || '';
      // El cursor no es una pieza: vive al final durante toda la animación.
      if (/t-cursor/.test(clase)) { cursor = nodo.cloneNode(true); return; }
      piezas.push({ nodo: nodo.cloneNode(true), salida: /t-(out|ok)/.test(clase) });
    });

    if (!piezas.length) return;

    const insertar = function (nodo) {
      if (cursor && cursor.parentNode === code) code.insertBefore(nodo, cursor);
      else code.appendChild(nodo);
    };

    const cuerpo = code.parentNode;

    const teclear = function () {
      try {
        // Se reserva el alto que ocupa la sesión completa antes de vaciarla:
        // si no, la caja crece línea a línea y arrastra al resto del hero.
        // Se mide aquí y no en el arranque porque para este momento las
        // fuentes ya están aplicadas.
        if (cuerpo) cuerpo.style.minHeight = cuerpo.getBoundingClientRect().height + 'px';

        code.textContent = '';
        if (cursor) code.appendChild(cursor);

        let i = 0;
        const siguiente = function () {
          if (i >= piezas.length) return;
          const pieza = piezas[i++];

          if (pieza.nodo) {
            // La salida espera un instante, como si el comando tardara.
            window.setTimeout(function () {
              insertar(pieza.nodo);
              siguiente();
            }, pieza.salida ? 220 : 0);
            return;
          }

          const destino = document.createTextNode('');
          insertar(destino);
          let j = 0;
          const letra = function () {
            if (j >= pieza.texto.length) { siguiente(); return; }
            destino.nodeValue += pieza.texto.charAt(j++);
            window.setTimeout(letra, 26);
          };
          letra();
        };

        siguiente();
      } catch (e) {
        // Ante cualquier fallo se restituye la sesión entera: más vale
        // estática que a medio escribir.
        code.innerHTML = completo;
      }
    };

    // Solo arranca cuando la terminal está a la vista, y una única vez.
    const observer = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        teclear();
      });
    }, { threshold: 0.35 });

    observer.observe(code);
  }

  /* ----------------------------------------------------------
     6. NAVEGACIÓN MÓVIL
     ---------------------------------------------------------- */
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    const closeNav = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    };

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    // Cierra al navegar a una sección.
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Cierra con Escape.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    // Cierra al pasar a escritorio. El umbral se lee del mismo breakpoint
    // que usa el CSS para volver a la barra horizontal (1025px): con un
    // valor distinto el menú quedaba abierto sin botón que lo cerrase.
    const escritorio = window.matchMedia('(min-width: 1025px)');
    const alCambiar = function (event) {
      if (event.matches) closeNav();
    };
    if (escritorio.addEventListener) {
      escritorio.addEventListener('change', alCambiar);
    } else {
      escritorio.addListener(alCambiar); // Safari < 14
    }
  }

  /* ----------------------------------------------------------
     7. ESTADO DEL HEADER AL HACER SCROLL
     ---------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    // Si el navegador sabe animar con el scroll, la barra de lectura la
    // resuelve el CSS en el compositor (bloque @supports de styles.css) y
    // aquí nos ahorramos el cálculo en cada fotograma.
    const barraEnCss = typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'scroll()');

    let ticking = false;
    const update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);

      if (!barraEnCss) {
        // Progreso de lectura. El recorrido útil es la altura del documento
        // menos una pantalla; si no hay scroll posible la barra queda a 0 en
        // vez de dividir por cero.
        const recorrido = document.documentElement.scrollHeight - window.innerHeight;
        const avance = recorrido > 0 ? Math.min(window.scrollY / recorrido, 1) : 0;
        header.style.setProperty('--scroll-progress', avance.toFixed(4));
      }

      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ----------------------------------------------------------
     8. SCROLLSPY — marca la sección activa en el menú
     ---------------------------------------------------------- */
  function initScrollSpy() {
    const links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    const sections = links
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ----------------------------------------------------------
     9. ANIMACIONES DE ENTRADA
     ---------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sin IntersectionObserver no hay forma de detectar la entrada:
    // se muestra todo de una vez.
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    // Con movimiento reducido el CSS ya deja solo el fundido (sin
    // desplazamiento), así que la entrada se mantiene: únicamente se
    // recorta el escalonado para que no se alargue.
    const escalonado = reducedMotion ? 25 : 70;

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Escalonado suave entre elementos del mismo bloque.
        entry.target.style.transitionDelay = (i * escalonado) + 'ms';
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    items.forEach(function (item) { observer.observe(item); });
  }

  /* ----------------------------------------------------------
     10. NAVEGACIÓN SUAVE ENTRE SECCIONES

     El navegador suprime `scroll-behavior: smooth` (y también la
     opción `behavior: 'smooth'` de scrollTo) cuando el sistema tiene
     activada la reducción de movimiento, y entonces las anclas dan un
     salto seco. Aquí se anima el desplazamiento a mano con
     requestAnimationFrame, que sí funciona en ese caso.

     Mientras el JS está activo, `html.js-scroll` desactiva el scroll
     suave del CSS para que no compita con este tween. Si el JS no
     carga, la clase nunca se añade y el CSS sigue encargándose.
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    const enlaces = document.querySelectorAll('a[href^="#"]');
    if (!enlaces.length) return;

    document.documentElement.classList.add('js-scroll');

    // Con reducción de movimiento se acorta el recorrido en vez de
    // eliminarlo: un desplazamiento breve orienta mejor que un salto.
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURACION = reducido ? 320 : 640;

    let animacion = null;

    function suavizar(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function cancelar() {
      if (animacion === null) return;
      cancelAnimationFrame(animacion);
      animacion = null;
    }

    function desplazarHasta(destino, alTerminar) {
      cancelar();

      const inicio = window.pageYOffset;
      const distancia = destino - inicio;

      if (Math.abs(distancia) < 2) {
        if (alTerminar) alTerminar();
        return;
      }

      const t0 = performance.now();

      function paso(ahora) {
        const avance = Math.min((ahora - t0) / DURACION, 1);
        window.scrollTo(0, inicio + distancia * suavizar(avance));

        if (avance < 1) {
          animacion = requestAnimationFrame(paso);
          return;
        }
        animacion = null;
        if (alTerminar) alTerminar();
      }

      animacion = requestAnimationFrame(paso);
    }

    // Si la persona retoma el control, la animación se detiene.
    ['wheel', 'touchstart'].forEach(function (evento) {
      window.addEventListener(evento, cancelar, { passive: true });
    });

    enlaces.forEach(function (enlace) {
      enlace.addEventListener('click', function (evento) {
        const id = enlace.getAttribute('href');
        if (!id || id === '#') return;

        const destino = document.querySelector(id);
        if (!destino) return;

        evento.preventDefault();

        const alturaHeader = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10
        ) || 64;

        const maximo = Math.max(
          document.documentElement.scrollHeight - window.innerHeight, 0
        );
        const y = Math.min(
          Math.max(destino.getBoundingClientRect().top + window.pageYOffset - alturaHeader - 24, 0),
          maximo
        );

        desplazarHasta(y, function () {
          if (history.replaceState) history.replaceState(null, '', id);

          // El foco se mueve al final: hacerlo antes cortaba la animación.
          destino.setAttribute('tabindex', '-1');
          destino.focus({ preventScroll: true });
        });
      });
    });
  }

  /* ----------------------------------------------------------
     11. COPIAR EL CORREO AL PORTAPAPELES
     Un enlace mailto: abre el cliente de correo del sistema, que
     muchas veces no es el que la persona usa. Copiar la dirección
     es más útil; el mailto: se mantiene como alternativa si el
     portapapeles no está disponible.

     Nota: la navegación suave se resuelve por completo en CSS con
     `scroll-behavior: smooth` + `scroll-padding-top`. No se
     intercepta el clic en JS a propósito: hacerlo cancelaba la
     animación nativa del navegador.
     ---------------------------------------------------------- */
  function initCopyEmail() {
    const card = document.getElementById('emailCard');
    const button = document.getElementById('copyEmailBtn');
    if (!card || !button) return;

    const mail = card.querySelector('.contact-mail');
    const status = card.querySelector('.copy-status');
    if (!mail) return;

    const email = mail.textContent.trim();
    let resetTimer = null;

    /** Copia sin la API moderna, para contextos donde no está disponible. */
    function copiarConFallback(texto) {
      const area = document.createElement('textarea');
      area.value = texto;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();

      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (error) {
        ok = false;
      }
      document.body.removeChild(area);
      return ok;
    }

    function mostrarResultado(ok) {
      card.classList.toggle('is-copied', ok);
      if (status) status.textContent = ok ? 'Correo copiado' : 'No se pudo copiar';
      button.setAttribute('title', ok ? 'Correo copiado' : 'No se pudo copiar');

      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        card.classList.remove('is-copied');
        if (status) status.textContent = '';
        button.setAttribute('title', 'Copiar correo');
      }, 2200);
    }

    button.addEventListener('click', function () {
      if (!navigator.clipboard || !window.isSecureContext) {
        mostrarResultado(copiarConFallback(email));
        return;
      }

      // La API moderna puede quedarse pendiente indefinidamente (por
      // ejemplo si el navegador deja un permiso sin resolver), lo que
      // dejaría el botón sin respuesta. Se corre contra un tiempo
      // límite: si no contesta, se usa el método clásico.
      let resuelto = false;
      const finalizar = function (ok) {
        if (resuelto) return;
        resuelto = true;
        mostrarResultado(ok);
      };

      const limite = setTimeout(function () {
        finalizar(copiarConFallback(email));
      }, 600);

      navigator.clipboard.writeText(email).then(function () {
        clearTimeout(limite);
        finalizar(true);
      }).catch(function () {
        clearTimeout(limite);
        finalizar(copiarConFallback(email));
      });
    });
  }

  /* ----------------------------------------------------------
     12. AÑO EN EL FOOTER
     ---------------------------------------------------------- */
  function initYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------
     13. MODO LLUVIA DE PARTÍCULAS ESTILO GOOGLE ANTIGRAVITY
     - Descenso fluido y atmosférico de cápsulas/guiones en pantalla completa.
     - Paleta cromática oficial de Google distribuida horizontalmente
       (azul real a la izquierda, violeta/rojo al centro, oro a la derecha).
     - Profundidad multicapa 3D (gotas de fondo suaves y lentas;
       gotas de primer plano nítidas y esbeltas con leve destello).
     - Interacción física suave: deflexión aerodinámica al pasar el cursor
       sin provocar errores, saltos bruscos ni artefactos de borde.
     - 100% libre de residuos en bordes y perfectamente calibrado para
       no competir con la lectura del portafolio.
     ---------------------------------------------------------- */
  const LLUVIA_CONFIG = {
    gotas: 140,          // Cantidad espaciada, elegante y visible en toda la página
    velocidadMin: 1.1,   // Velocidad vertical base mínima (px/frame)
    velocidadMax: 2.3,   // Velocidad vertical base máxima (px/frame)
    anguloViento: 0.14,  // Inclinación aerodinámica natural (~8°)
    longitudMin: 4.5,    // Longitud mínima de la cápsula (px)
    longitudMax: 11.5,   // Longitud máxima de la cápsula (px)
    grosorMin: 1.2,      // Grosor mínimo del trazo (px)
    grosorMax: 2.3,      // Grosor máximo del trazo (px)
    radioRepulsion: 95,  // Radio de brisa suave alrededor del cursor
    fuerzaRepulsion: 1.6 // Fuerza de deflexión sutil
  };

  // Paleta cromática oficial de Google Antigravity
  const GOOGLE_PALETTE = [
    { stop: 0.00, r: 52,  g: 118, b: 246 }, // Izquierda: Azul Google (#3476F6)
    { stop: 0.18, r: 105, g: 95,  b: 248 }, // Índigo (#695FF8)
    { stop: 0.36, r: 165, g: 75,  b: 240 }, // Violeta / Púrpura (#A54BF0)
    { stop: 0.52, r: 238, g: 68,  b: 60  }, // Centro: Rojo Coral Google (#EE443C)
    { stop: 0.70, r: 252, g: 135, b: 25  }, // Naranja cálido (#FC8719)
    { stop: 0.86, r: 252, g: 205, b: 25  }, // Derecha: Amarillo Oro Google (#FCCD19)
    { stop: 1.00, r: 255, g: 220, b: 50  }  // Destello dorado suave
  ];

  function interpolarColorGoogle(u, desaturacion) {
    u = Math.max(0, Math.min(1, u));
    desaturacion = desaturacion || 0;
    let c1 = GOOGLE_PALETTE[0];
    let c2 = GOOGLE_PALETTE[GOOGLE_PALETTE.length - 1];
    for (let i = 0; i < GOOGLE_PALETTE.length - 1; i++) {
      if (u >= GOOGLE_PALETTE[i].stop && u <= GOOGLE_PALETTE[i + 1].stop) {
        c1 = GOOGLE_PALETTE[i];
        c2 = GOOGLE_PALETTE[i + 1];
        break;
      }
    }
    const factor = (u - c1.stop) / (c2.stop - c1.stop || 1);
    let r = Math.round(c1.r + (c2.r - c1.r) * factor);
    let g = Math.round(c1.g + (c2.g - c1.g) * factor);
    let b = Math.round(c1.b + (c2.b - c1.b) * factor);

    // Reducción del 40% de colorido a partir de 'Sobre mí' (desaturación elegante)
    if (desaturacion > 0.001) {
      const redColor = 0.40 * desaturacion;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      r = Math.round(r * (1 - redColor) + lum * redColor);
      g = Math.round(g * (1 - redColor) + lum * redColor);
      b = Math.round(b * (1 - redColor) + lum * redColor);
    }

    return r + ', ' + g + ', ' + b;
  }

  function initParticles() {
    const canvas = document.getElementById('antigravity-canvas');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const calmado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ancho = 0;
    let alto = 0;
    let cursorX = -1000;
    let cursorY = -1000;
    let targetCursorX = -1000;
    let targetCursorY = -1000;
    let cursorVelocidad = 0;
    let ultimoCursorX = -1000;
    let ultimoCursorY = -1000;
    let hayCursor = false;
    let opacidad = 0.58;
    let factorDesaturacion = 0;
    let tiempo = 0;
    let animando = false;
    let redimensionPendiente = false;

    // Inicialización de las gotas de lluvia con profundidad 3D
    const gotas = new Array(LLUVIA_CONFIG.gotas);

    function crearGota(p, aleatorioCompleto) {
      const profundidad = 0.35 + Math.random() * 0.75; // 0.35 = fondo sutil, 1.1 = primer plano
      const grosor = (LLUVIA_CONFIG.grosorMin +
        Math.random() * (LLUVIA_CONFIG.grosorMax - LLUVIA_CONFIG.grosorMin)) * profundidad;
      const longitud = (LLUVIA_CONFIG.longitudMin +
        Math.random() * (LLUVIA_CONFIG.longitudMax - LLUVIA_CONFIG.longitudMin)) * profundidad;
      const velocidad = (LLUVIA_CONFIG.velocidadMin +
        Math.random() * (LLUVIA_CONFIG.velocidadMax - LLUVIA_CONFIG.velocidadMin)) * (0.55 + profundidad * 0.55);

      p.x = Math.random() * (ancho || window.innerWidth);
      p.y = aleatorioCompleto ? Math.random() * (alto || window.innerHeight) : -25 - Math.random() * 40;
      p.profundidad = profundidad;
      p.grosor = Math.max(grosor, 1.1);
      p.longitud = Math.max(longitud, grosor * 2);
      p.velocidad = velocidad;
      p.derivaX = (Math.random() * 0.3 - 0.15);
      p.fase = Math.random() * Math.PI * 2;
      p.deflexionX = 0;
      p.deflexionY = 0;
      p.colorOffset = (Math.random() * 0.06 - 0.03);
    }

    for (let i = 0; i < LLUVIA_CONFIG.gotas; i++) {
      gotas[i] = {};
      crearGota(gotas[i], true);
    }

    function medir() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // clientWidth excluye la barra de desplazamiento: con innerWidth el
      // lienzo quedaba unos píxeles más ancho que su caja CSS y la lluvia
      // se veía estirada en horizontal.
      ancho = document.documentElement.clientWidth || window.innerWidth || canvas.clientWidth || 1200;
      alto = document.documentElement.clientHeight || window.innerHeight || canvas.clientHeight || 800;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Reubicar gotas que queden fuera de la pantalla tras redimensionar
      for (let i = 0; i < LLUVIA_CONFIG.gotas; i++) {
        if (gotas[i].x > ancho) {
          gotas[i].x = Math.random() * ancho;
        }
      }
    }

    function arrancar() {
      if (animando) return;
      animando = true;
      window.requestAnimationFrame(paso);
    }

    function paso() {
      tiempo += 1;

      // Seguimiento amortiguado de la posición del cursor para calcular la brisa
      const dxCursor = targetCursorX - cursorX;
      const dyCursor = targetCursorY - cursorY;
      cursorX += dxCursor * 0.2;
      cursorY += dyCursor * 0.2;

      // Estimación de velocidad del cursor para generar estela aerodinámica
      const distMov = Math.sqrt((cursorX - ultimoCursorX) ** 2 + (cursorY - ultimoCursorY) ** 2);
      cursorVelocidad += (Math.min(distMov, 35) - cursorVelocidad) * 0.12;
      ultimoCursorX = cursorX;
      ultimoCursorY = cursorY;

      // Detección de scroll: a partir de 'Sobre mí', baja el color un 40% para no ser invasivo
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const elSobreMi = document.getElementById('sobre-mi');
      const inicioSobreMi = elSobreMi ? Math.max(elSobreMi.offsetTop - 220, 200) : (alto * 0.65);

      let targetDesaturacion = 0;
      if (scrollY >= inicioSobreMi) {
        targetDesaturacion = 1;
      } else if (scrollY > inicioSobreMi * 0.35) {
        targetDesaturacion = (scrollY - inicioSobreMi * 0.35) / (inicioSobreMi * 0.65);
      }
      factorDesaturacion += (targetDesaturacion - factorDesaturacion) * 0.08;

      // Opacidad armónica: sutilmente templada en contenido denso, pero siempre activa
      const targetOpacidad = (hayCursor ? 0.64 : 0.54) * (1 - factorDesaturacion * 0.12);
      opacidad += (targetOpacidad - opacidad) * 0.06;

      // 1. Limpieza física total del lienzo en coordenadas nativas del buffer
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      if (opacidad > 0.015) {
        ctx.globalCompositeOperation = 'lighter';

        const anguloBase = (Math.PI * 0.5) + LLUVIA_CONFIG.anguloViento;
        const cosAngulo = Math.cos(anguloBase);
        const sinAngulo = Math.sin(anguloBase);

        // Movimiento continuo garantizado (incluso si el sistema tiene prefers-reduced-motion)
        const factorVel = calmado ? 0.65 : 1.0;

        for (let i = 0; i < LLUVIA_CONFIG.gotas; i++) {
          const g = gotas[i];

          // Descenso y ligera deriva
          g.y += g.velocidad * factorVel;
          g.x += cosAngulo * g.velocidad * factorVel + g.derivaX;

          // Reacción física con el cursor (deflexión suave)
          if (hayCursor) {
            const dx = g.x - cursorX;
            const dy = g.y - cursorY;
            const distSq = dx * dx + dy * dy;
            const radioRepulsion = LLUVIA_CONFIG.radioRepulsion;

            if (distSq < radioRepulsion * radioRepulsion && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const fuerza = (1 - dist / radioRepulsion) * LLUVIA_CONFIG.fuerzaRepulsion;
              g.deflexionX += (dx / dist) * fuerza;
              g.deflexionY += (dy / dist) * fuerza * 0.5;
            }
          }

          // Aplicar y disipar la deflexión
          g.x += g.deflexionX;
          g.y += g.deflexionY;
          g.deflexionX *= 0.88;
          g.deflexionY *= 0.88;

          // Reciclaje al salir de la pantalla por abajo
          if (g.y > alto + 25) {
            crearGota(g, false);
          }
          if (g.x < -30) {
            g.x = ancho + 15;
          } else if (g.x > ancho + 30) {
            g.x = -15;
          }

          // Desvanecimiento suave en los bordes laterales para evitar cortes o líneas
          const margenFadeX = 50;
          if (g.x < -15 || g.x > ancho + 15) continue;
          const fadeBorde = Math.min(
            Math.max(g.x / margenFadeX, 0),
            Math.max((ancho - g.x) / margenFadeX, 0),
            1
          );
          if (fadeBorde <= 0.01) continue;

          // Cálculo del color de la gota: modula 40% menos colorido en 'Sobre mí' hacia abajo
          const uColor = Math.min(Math.max((g.x / (ancho || 1)) + g.colorOffset, 0), 1);
          const colorRGB = interpolarColorGoogle(uColor, factorDesaturacion);

          // Opacidad según profundidad (presencia visible y clara en todo el recorrido)
          const alfaGota = opacidad * (0.45 + g.profundidad * 0.55) * fadeBorde;
          if (alfaGota < 0.015) continue;

          // Orientación de la cápsula (dirección de caída + leve empuje)
          const inclinacionX = cosAngulo + g.deflexionX * 0.15;
          const inclinacionY = sinAngulo + g.deflexionY * 0.15;
          const largo = g.longitud * (1 + cursorVelocidad * 0.015);
          const medioDx = inclinacionX * (largo * 0.5);
          const medioDy = inclinacionY * (largo * 0.5);

          // Halo sutil en gotas de primer plano (suavizado al bajar por la página)
          if (g.profundidad > 0.85) {
            const bloomFactor = 0.12 * (1 - factorDesaturacion * 0.45);
            ctx.beginPath();
            ctx.moveTo(g.x - medioDx * 1.15, g.y - medioDy * 1.15);
            ctx.lineTo(g.x + medioDx * 1.15, g.y + medioDy * 1.15);
            ctx.lineWidth = g.grosor * 1.8;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgba(' + colorRGB + ', ' + (alfaGota * bloomFactor).toFixed(3) + ')';
            ctx.stroke();
          }

          // Núcleo limpio y nítido de la cápsula
          ctx.beginPath();
          ctx.moveTo(g.x - medioDx, g.y - medioDy);
          ctx.lineTo(g.x + medioDx, g.y + medioDy);
          ctx.lineWidth = g.grosor;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(' + colorRGB + ', ' + Math.min(alfaGota * 0.88, 1).toFixed(3) + ')';
          ctx.stroke();
        }

        ctx.globalCompositeOperation = 'source-over';
      }

      window.requestAnimationFrame(paso);
    }

    window.addEventListener('mousemove', function (evento) {
      targetCursorX = evento.clientX;
      targetCursorY = evento.clientY;
      if (!hayCursor) {
        cursorX = targetCursorX;
        cursorY = targetCursorY;
        hayCursor = true;
      }
      arrancar();
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      hayCursor = false;
      targetCursorX = -1000;
      targetCursorY = -1000;
    });

    window.addEventListener('resize', function () {
      if (redimensionPendiente) return;
      redimensionPendiente = true;
      window.requestAnimationFrame(function () {
        redimensionPendiente = false;
        medir();
      });
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        animando = false;
      } else {
        arrancar();
      }
    });

    medir();
    arrancar();
  }

  /* ----------------------------------------------------------
     14. ARRANQUE ROBUSTO (COMPATIBLE CON LIVE SERVER)
     ---------------------------------------------------------- */
  let inicializado = false;

  function init() {
    if (inicializado) return;
    inicializado = true;

    try { renderProjects(); } catch (e) { console.error('Error renderProjects:', e); }
    try { initCasos(); } catch (e) { console.error('Error initCasos:', e); }
    try { initFilters(); } catch (e) { console.error('Error initFilters:', e); }
    try { initTechLab(); } catch (e) { console.error('Error initTechLab:', e); }
    try { initTerminal(); } catch (e) { console.error('Error initTerminal:', e); }
    try { initNav(); } catch (e) { console.error('Error initNav:', e); }
    try { initHeaderScroll(); } catch (e) { console.error('Error initHeaderScroll:', e); }
    try { initScrollSpy(); } catch (e) { console.error('Error initScrollSpy:', e); }
    try { initReveal(); } catch (e) { console.error('Error initReveal:', e); }
    try { initSmoothScroll(); } catch (e) { console.error('Error initSmoothScroll:', e); }
    try { initCopyEmail(); } catch (e) { console.error('Error initCopyEmail:', e); }
    try { initParticles(); } catch (e) { console.error('Error initParticles:', e); }
    try { initYear(); } catch (e) { console.error('Error initYear:', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Salvaguardas adicionales para Live Server y recarga dinámica
  window.addEventListener('load', init);
  setTimeout(init, 50);
})();
