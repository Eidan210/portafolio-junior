# Portafolio — Eidan Cuadros

Portafolio personal de **Eidan Cuadros**, Junior Software Developer y Apprentice de Desarrollo de
Software en **Campuslands**. Sitio *one-page* construido con HTML5, CSS3 y JavaScript puro, sin
frameworks, librerías ni dependencias externas.

> Link Portafolio: https://eidan210.github.io/portafolio-junior/

---

## Stack

| Capa | Tecnología | Detalle |
|------|-----------|---------|
| Estructura | **HTML5 semántico** | `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` |
| Estilos | **CSS3 puro** | Variables custom, Grid, Flexbox, `clamp()`, media queries |
| Comportamiento | **JavaScript ES6+** | Sin dependencias; render dinámico, IntersectionObserver |
| Iconografía | **SVG inline** | Cero archivos de imagen, cero peticiones extra |

**Dependencias externas: ninguna.** Ni CDN, ni fuentes remotas, ni frameworks. El sitio completo son
tres archivos que funcionan abriendo `index.html`.

---

## Estructura del proyecto

```
.
├── index.html              -> Estructura semántica y contenido
├── styles.css              -> Sistema de diseño completo (variables + layout)
├── main.js                 -> Datos de proyectos, render e interacciones
└── README.md               -> Este archivo
```

Los tres archivos viven en la **raíz del repositorio** justamente para que GitHub Pages funcione
sin configuración adicional ni paso de build.

---

## Criterios de evaluación cubiertos

### 1. Diagramación semántica

- Un único `<h1>` (nombre en el hero), `<h2>` por sección y `<h3>` en tarjetas de proyecto y stack.
- Cada `<section>` tiene `id` y `aria-labelledby` apuntando a su propio título.
- Las tarjetas de proyecto son `<article>`; la nota de conocimientos complementarios es un `<aside>`.
- Enlaces externos con `rel="noopener noreferrer"` y `aria-label` descriptivo.
- Enlace *skip to content* para navegación por teclado.

### 2. Contraste y paleta (WCAG AA)

Paleta oscura sobria con acento azul controlado. Todos los pares texto/fondo fueron medidos
y superan el mínimo AA de **4.5:1**:

| Token | Color | Sobre `--bg` | Estado |
|-------|-------|--------------|--------|
| `--text` | `#E4E7EE` | 15.48:1 | AAA |
| `--text-dim` | `#99A1B3` | 7.40:1 | AAA |
| `--text-faint` | `#8791A5` | 5.26:1 (peor fondo) | AA |
| `--accent` | `#7AA2F7` | 7.61:1 | AAA |
| Botón primario | `#0B1020` sobre acento | 7.52:1 | AAA |

> `--text-faint` era `#6B7387` y fallaba AA (3.51:1 sobre `--bg-elev-2`). Se corrigió en la auditoría.

Estados `:hover` y `:focus-visible` explícitos en todos los elementos interactivos.

### 3. Responsive (mobile-first real)

Los estilos base son los de móvil; los breakpoints solo **añaden** complejidad hacia arriba:

| Rango | Breakpoint | Layout |
|-------|-----------|--------|
| Móvil | `< 641px` | Una columna, nav hamburguesa |
| Tablet | `641px – 1024px` | Dos columnas en stack, contacto y módulos |
| Desktop | `≥ 1025px` | Hero a dos columnas, nav horizontal, grids de 2–3 |

- Tipografía fluida con `clamp()` y unidades relativas (`rem`, `ch`).
- **Sin desbordamiento horizontal:** `overflow-x: clip` en `body` (para no anular `scroll-behavior: smooth`) y los bloques de código
  llevan su propio `overflow-x: auto`.

### 4. Rendimiento

- **Cero imágenes.** Todos los iconos son SVG inline, así que no hay peticiones de red adicionales
  ni necesidad de `loading="lazy"` / `width` / `height` (no existe ningún `<img>` ni `<video>`).
- Cero JavaScript de terceros; el script propio pesa unos pocos KB.
- Favicon embebido como data URI SVG.
- Animaciones vía `transform`/`opacity` y desactivadas con `prefers-reduced-motion`.

### 5. Navegabilidad

- Header **fijo** con `backdrop-filter`, que marca su borde al hacer scroll.
- Anclas suaves a `#inicio`, `#sobre-mi`, `#habilidades`, `#proyectos` y `#contacto`, con
  `scroll-behavior: smooth` en CSS **y** refuerzo en JS que descuenta la altura del header
  y devuelve el foco de teclado a la sección destino.
- Scrollspy con `IntersectionObserver` que resalta la sección activa.
- Menú móvil accesible: `aria-expanded`, cierre con `Escape` y al navegar.

### 6. Contenido generado con Antigravity (agy)

La selección de proyectos se hizo con **Antigravity CLI**, analizando el resumen de repositorios:

```bash
agy -p "Lee el resumen de repositorios. Extrae los 3 o 4 proyectos más sólidos
que demuestren Python, JavaScript y HTML/CSS. Devuelve un JSON limpio con:
nombre, tecnologias, descripcion_corta, enlace_repo, demo_url."
```

El JSON resultante alimenta el array `PROJECTS` de `main.js`, que renderiza las tarjetas de
`#proyectos` de forma dinámica.

**Nota de verificación:** la salida de agy se contrastó contra el código real de cada repositorio
vía la API de GitHub antes de publicarla. En una de las pasadas, agy describió `CampusTech-V2.0`
como un sistema de seguimiento académico cuando en realidad gestiona inventario de productos
tecnológicos. El copy del sitio refleja el código real, no la inferencia del modelo.

---

## Metodología de trabajo

- **Entrega iterativa:** cada módulo de la formación se cierra con una aplicación funcional, no con
  teoría. Los proyectos del portafolio salieron de esas entregas.
- **Refactorización sobre versiones previas:** `CampusTech v2.0` y el gestor de gastos modular
  (`Moneda`, seis módulos) son reescrituras de una primera versión más simple.
- **Control de versiones disciplinado:** commits atómicos siguiendo
  [Conventional Commits](https://www.conventionalcommits.org/), un repositorio por entregable.
- **Fundamentos de Scrum y metodologías ágiles** vistos en formación (roles, ceremonias y trabajo
  por iteraciones), actualmente en profundización.

---

## Ejecutar en local

No requiere instalación ni build. Basta con abrir `index.html` en el navegador.

Para servirlo por HTTP (recomendado, evita restricciones de `file://`):

```bash
python -m http.server 8000
# luego abre http://localhost:8000
```

O con la extensión **Live Server** de VS Code: clic derecho en `index.html` → *Open with Live Server*.

---

## Activar GitHub Pages

El repositorio ya está listo para desplegarse sin pasos intermedios: los archivos están en la raíz
y no hay proceso de build.

1. El repositorio debe ser **público** (GitHub Pages requiere plan de pago para repos privados).
   ```bash
   gh repo edit --visibility public
   ```
2. En GitHub: **Settings → Pages**.
3. En *Source*, elige **Deploy from a branch**.
4. Selecciona la rama **`main`** y la carpeta **`/ (root)`**. Guarda.
5. En un par de minutos el sitio queda publicado en:
   `https://eidan210.github.io/<nombre-del-repositorio>/`

También desde la terminal:

```bash
gh api -X POST repos/Eidan210/<repo>/pages -f source[branch]=main -f source[path]=/
```

---

## Pendientes

- [ ] Activar GitHub Pages en los repositorios de los proyectos y rellenar `demo_url` en `main.js`
      (el botón "Ver demo" aparece automáticamente cuando el campo tiene una URL).
- [ ] Añadir descripciones y topics a los repositorios enlazados desde el portafolio.

---

Construido con HTML, CSS y JavaScript puro.
