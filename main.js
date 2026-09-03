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
      privado: true,
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
      demo_url: '', // Sin GitHub Pages activo todavía.
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
  function buildProjectCard(project, index) {
    const article = document.createElement('article');
    article.className = 'card project-card reveal' + (project.destacado ? ' project-card-featured' : '');
    article.dataset.tech = project.tecnologias.join(',');

    const num = String(index + 1).padStart(2, '0');
    const tags = project.tecnologias.map(function (tech) {
      return '<li class="tag">' + esc(tech) + '</li>';
    }).join('');

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

    // Badges de cabecera: destacado y/o repositorio privado; si no hay
    // ninguno, se muestra el número de orden.
    const badges = [];
    if (project.destacado) badges.push('<span class="tag-featured">★ destacado</span>');
    if (project.privado) badges.push('<span class="tag-private">repo privado</span>');
    const headAside = badges.length
      ? '<span class="project-badges">' + badges.join('') + '</span>'
      : '<span class="project-index">' + num + '</span>';

    article.innerHTML = [
      '<header class="project-head">',
      '  <div>',
      '    <h3 class="project-title">' + esc(project.nombre) + '</h3>',
      '    <p class="project-repo">Eidan210/' + esc(project.repo) + '</p>',
      '    <p class="project-summary">' + esc(project.descripcion_corta) + '</p>',
      '  </div>',
      '  ' + headAside,
      '</header>',

      '<ul class="project-tags">' + tags + '</ul>',

      '<div class="project-preview">',
      '  <div class="preview-bar">',
      '    <span class="dot dot-red"></span>',
      '    <span class="dot dot-yellow"></span>',
      '    <span class="dot dot-green"></span>',
      '    <span class="preview-file">' + esc(project.preview.file) + '</span>',
      '  </div>',
      '  <pre class="preview-code"><code>' + highlight(project.preview.code, project.preview.lang) + '</code></pre>',
      '</div>',

      '<div class="project-body">',
      '  <div class="project-problem">',
      '    <span class="project-block-label">El problema</span>',
      '    <p class="project-text">' + esc(project.problema_resuelto) + '</p>',
      '  </div>',
      '  <div class="project-solution">',
      '    <span class="project-block-label">La solución</span>',
      '    <p class="project-text">' + esc(project.solucion) + '</p>',
      '  </div>',
      '  <p class="project-skill">',
      '    <span class="project-skill-icon" aria-hidden="true">◆</span>',
      '    <span><strong>Habilidad clave:</strong> ' + esc(project.habilidad_clave) + '</span>',
      '  </p>',
      '</div>',

      '<footer class="project-actions">' + codeBtn + demoBtn + '</footer>'
    ].join('\n');

    return article;
  }

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    PROJECTS.forEach(function (project, i) {
      fragment.appendChild(buildProjectCard(project, i));
    });
    grid.appendChild(fragment);
  }

  /* ----------------------------------------------------------
     5. FILTROS POR TECNOLOGÍA
     ---------------------------------------------------------- */
  function initFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    if (!chips.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const filter = chip.dataset.filter;

        chips.forEach(function (other) {
          const active = other === chip;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', String(active));
        });

        document.querySelectorAll('.project-card').forEach(function (card) {
          const techs = (card.dataset.tech || '').split(',');
          const visible = filter === 'todos' || techs.indexOf(filter) !== -1;
          card.classList.toggle('is-hidden', !visible);
        });
      });
    });
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

    // Cierra al pasar a escritorio.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) closeNav();
    });
  }

  /* ----------------------------------------------------------
     7. ESTADO DEL HEADER AL HACER SCROLL
     ---------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let ticking = false;
    const update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
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
     13. PARTÍCULAS "ANTIGRAVEDAD" DEL CURSOR
     Rastro decorativo dibujado con la API nativa de canvas 2D: cada
     movimiento del ratón emite una ráfaga corta de puntos que suben
     flotando, se frenan por fricción y se apagan. Sin dependencias.
     ---------------------------------------------------------- */
  const PARTICULAS = {
    max: 80,               // techo duro de partículas vivas a la vez
    porRafaga: 2,          // puntos emitidos por movimiento aceptado
    intervaloEmision: 32,  // ms mínimos entre ráfagas (~63 puntos/s)
    dispersion: 10,        // px de desvío aleatorio respecto al cursor
    radioMin: 1.5,
    radioMax: 4,
    empuje: 0.05,          // aceleración hacia arriba: la "antigravedad"
    friccion: 0.94,        // decay de la velocidad
    merma: 0.99,           // decay del radio
    apagado: 0.014,        // decay de la vida (~1.2 s de vuelo)
    accent: '122, 162, 247', // --accent  #7AA2F7
    purple: '187, 154, 247'  // --purple  #BB9AF7
  };

  function initParticles() {
    const canvas = document.getElementById('antigravity-canvas');
    if (!canvas || !canvas.getContext) return;

    // Sin puntero fino (móvil, tablet) no hay cursor al que seguir: el
    // efecto solo añadiría latencia al gesto táctil y gasto de batería.
    // El movimiento reducido se comprueba aquí además de en el CSS para
    // no registrar siquiera los listeners ni el bucle de dibujo.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TAU = Math.PI * 2;
    const particulas = [];
    let ancho = 0;
    let alto = 0;
    let animando = false;
    let ultimaEmision = 0;
    let redimensionPendiente = false;

    // Reloj monótono: mezclar performance.now() con Date.now() rompería
    // la comparación del estrangulador porque tienen orígenes distintos.
    const ahora = (window.performance && window.performance.now)
      ? function () { return window.performance.now(); }
      : function () { return Date.now(); };

    /* El buffer se dibuja a la resolución real del dispositivo y se
       escala por CSS: sin esto un punto de 1px se ve borroso en pantallas
       HiDPI. Se limita a 2x porque por encima no se aprecia y cada paso
       multiplica los píxeles que hay que rellenar. */
    function medir() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = canvas.clientWidth || window.innerWidth;
      alto = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      // Redimensionar el buffer resetea la matriz: hay que reaplicarla.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function arrancar() {
      if (animando) return;
      animando = true;
      window.requestAnimationFrame(paso);
    }

    function emitir(x, y) {
      const hueco = PARTICULAS.max - particulas.length;
      if (hueco <= 0) return;   // techo duro: se descarta, no se acumula
      const cantidad = Math.min(PARTICULAS.porRafaga, hueco);

      for (let i = 0; i < cantidad; i++) {
        particulas.push({
          x: x + (Math.random() - 0.5) * PARTICULAS.dispersion,
          y: y + (Math.random() - 0.5) * PARTICULAS.dispersion,
          vx: (Math.random() - 0.5) * 0.7,
          vy: -(0.15 + Math.random() * 0.45),
          radio: PARTICULAS.radioMin +
                 Math.random() * (PARTICULAS.radioMax - PARTICULAS.radioMin),
          vida: 1,
          // Algún punto suelto en violeta rompe la monotonía sin salirse
          // de la paleta del sitio.
          color: Math.random() < 0.18 ? PARTICULAS.purple : PARTICULAS.accent
        });
      }

      arrancar();
    }

    function paso() {
      ctx.clearRect(0, 0, ancho, alto);
      // Los puntos que se solapan suman luz en lugar de taparse: es el
      // brillo sutil sin recurrir a shadowBlur ni a degradados, que
      // cuestan un orden de magnitud más por partícula.
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];

        p.vy -= PARTICULAS.empuje;    // antigravedad: tira hacia arriba
        p.vx *= PARTICULAS.friccion;
        p.vy *= PARTICULAS.friccion;
        p.x += p.vx;
        p.y += p.vy;
        p.radio *= PARTICULAS.merma;
        p.vida -= PARTICULAS.apagado;

        if (p.vida <= 0 || p.radio < 0.3) {
          particulas.splice(i, 1);
          continue;
        }

        // Halo tenue + núcleo: dos arcos por partícula.
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio * 3, 0, TAU);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + (p.vida * 0.18).toFixed(3) + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio, 0, TAU);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + (p.vida * 0.9).toFixed(3) + ')';
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      if (particulas.length) {
        window.requestAnimationFrame(paso);
        return;
      }

      // Sin partículas vivas el bucle se detiene: en reposo el efecto no
      // consume ni un frame.
      animando = false;
      ctx.clearRect(0, 0, ancho, alto);
    }

    window.addEventListener('mousemove', function (evento) {
      // Se estrangula por tiempo, no por evento: un ratón con alta tasa
      // de sondeo dispara cientos de mousemove por segundo.
      const t = ahora();
      if (t - ultimaEmision < PARTICULAS.intervaloEmision) return;
      ultimaEmision = t;
      // El lienzo es fixed y cubre el viewport, así que las coordenadas
      // de cliente sirven tal cual, sin corregir el scroll.
      emitir(evento.clientX, evento.clientY);
    }, { passive: true });

    window.addEventListener('resize', function () {
      // Redimensionar el buffer es caro y el evento llega en ráfaga:
      // se resuelve una sola vez por frame.
      if (redimensionPendiente) return;
      redimensionPendiente = true;
      window.requestAnimationFrame(function () {
        redimensionPendiente = false;
        medir();
      });
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      // El navegador congela requestAnimationFrame en pestañas ocultas;
      // al volver, el rastro reaparecería detenido a medio camino.
      if (document.hidden) particulas.length = 0;
    });

    medir();
  }

  /* ----------------------------------------------------------
     14. ARRANQUE
     ---------------------------------------------------------- */
  function init() {
    renderProjects();
    initFilters();
    initNav();
    initHeaderScroll();
    initScrollSpy();
    initReveal();
    initSmoothScroll();
    initCopyEmail();
    initParticles();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
