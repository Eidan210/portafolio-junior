# Portafolio Buddy — Eidan Alexander Carreño

Mi portafolio personal: una web *one-page* con la paleta de Anthropic, estética *glass* + pixel art y una mascota guía, **Buddy** (Clawd). Buddy entra en escena, salta a una ruta que recorre toda la página siguiendo el scroll, recoge una chispa por sección y explica cada proyecto y tecnología con evidencia.

[![Demo en vivo](https://img.shields.io/badge/demo-GitHub_Pages-d97757?style=flat-square&logo=githubpages&logoColor=white)](https://eidan210.github.io/portafolio-junior/)
[![Despliegue](https://github.com/Eidan210/portafolio-junior/actions/workflows/deploy.yml/badge.svg)](https://github.com/Eidan210/portafolio-junior/actions/workflows/deploy.yml)
[![Lighthouse CI](https://github.com/Eidan210/portafolio-junior/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/Eidan210/portafolio-junior/actions/workflows/lighthouse.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-14-FFF312?style=flat-square&logo=framer&logoColor=black)
![Último commit](https://img.shields.io/github/last-commit/Eidan210/portafolio-junior?style=flat-square&label=último%20commit)

![Intro a pantalla completa: Clawd llega desde el hiperespacio, saluda y vuela al hero](docs/intro.webp)

<sub>Intro de escritorio con la entrada <code>hiperespacio</code>, grabada sobre el build de producción.</sub>

## El problema

Un portafolio junior suele ser una lista de tarjetas que se recorre en segundos: quien lo revisa no ve el contexto de cada proyecto ni el porqué de las decisiones. Quería un portafolio que **guíe la visita**, cuente cada proyecto y tecnología con evidencia, y que sea en sí mismo una muestra de ingeniería frontend: animación fluida sin re-renders, accesibilidad y despliegue automatizado. Todo sin backend: el sitio no envía ni guarda datos del visitante. El formulario abre Gmail con el mensaje listo y solo anuncia lo que puede comprobar.

## Tecnologías

| Tecnología | Para qué se usa |
| :--- | :--- |
| **Vite 8** | Servidor de desarrollo y build estático (minificado con Lightning CSS). |
| **React 19 + TypeScript estricto** | Componentes y contratos tipados para todo el contenido (`lib/types.ts`). |
| **Tailwind CSS v4** | Tokens semánticos de la paleta de Anthropic, vidrio y *pixel corners*. |
| **Motion 14** | Transiciones de componentes y `MotionConfig` para el modo de movimiento. |
| **Canvas 2D y Web Animations API** | Fondo animado, huellas, estela y confeti sin re-renders de React. |
| **Lucide** | Iconografía. |
| **Gmail + Google Apps Script** | Contacto sin backend propio ni terceros: el script de Eidan envía el mensaje a su Gmail y, como plan B, el formulario abre Gmail con el mensaje escrito. |
| **node:test** | Tests del contacto con el runner nativo de Node 24 (TypeScript sin compilar, sin dependencias). |
| **GitHub Actions + GitHub Pages** | Compilación como check en cada pull request y despliegue al fusionar en `main`. |

## Funciones clave

- **En español e inglés:** se elige por el idioma del navegador; el botón ES/EN del menú cambia de idioma sin perder la sección y `?lang=en` deja un enlace compartible.
- **Resumen en 30 segundos:** para quien evalúa con prisa, un botón del inicio abre rol, stack con evidencia, tres proyectos destacados, cifras y contacto, sin animaciones.
- **Entrada de Buddy rotativa:** ocho coreografías en escritorio (a pantalla completa) y siete en móvil; cada visita estrena una, y en escritorio el saludo final también rota entre seis poses y frases.
- **Ruta que sigue el scroll:** en escritorio, Clawd camina por carriles entre secciones, recoge chispas y celebra en la meta con confeti; en móvil, una barra de paradas inferior.
- **Tour guiado:** Clawd camina a su ritmo y la cámara le sigue con un muelle amortiguado.
- **Menú de Buddy** (clic en Clawd): progreso de la ruta, tour, FAQ, skills, proyectos, contacto, "Sorpréndeme" y preferencias.
- **Proyectos con evidencia real:** capturas sacadas de los `docs/` de cada repositorio, una consola que reproduce una sesión real del taller de Java y métricas que cuentan al aparecer. Cada tarjeta tiene *"¿Qué dice Buddy?"* con el reto técnico, la arquitectura y su opinión.
- **Casos de estudio:** cada proyecto abre su problema, solución, decisiones técnicas, resultados y aprendizajes, redactados desde el README del repo y con cada afirmación contrastada con una cita literal.
- **Ficha `eidan.ts`:** el perfil como un archivo TypeScript en un editor, con resaltado y tecleo animado.
- **Stack con evidencia:** 14 tecnologías filtrables, cada una con su papel y los proyectos donde se ve.
- **Nav con tirolesa:** el progreso de lectura es el borde del menú y un mini Clawd cuelga de él; al llegar al final se suelta, baja en paracaídas, aterriza sobre el footer, saluda y se va caminando.
- **Contacto que no miente:** con el Apps Script desplegado, el mensaje se envía solo y el éxito llega con la confirmación del servidor. Sin él (o si falla), abre Gmail con el mensaje escrito (en el teléfono, la app de correo). Solo anuncia lo comprobable y el texto nunca se pierde.
- **Guiños:** el código Konami (↑↑↓↓←→←→BA) le pone gafas de sol a Clawd y suelta confeti; los enlaces rotos llevan a una 404 con Clawd perdido.
- **Accesible por defecto:** respeta `prefers-reduced-motion`, una sola región `aria-live` y áreas táctiles de 44 px.

### Buddy en detalle

1. **Entrada:** cada visita estrena otra, rotando con `localStorage` (por plataforma). Con `?entrada=` se fuerza una: `ensamblado`, `caida`, `teletransporte`, `lluvia`, `paracaidas`, `hiperespacio`, `meteorito` u `ovni`.
   - **Ensamblado:** los pixeles reales del PNG vuelan hasta formarlo.
   - **Caída:** estirado al caer, aplastado al aterrizar, con polvo y temblor (de pantalla, en escritorio).
   - **Teletransporte:** un haz con scanlines lo materializa de arriba abajo.
   - **Lluvia:** bloques estilo Tetris que caen en columna y rebotan, fila a fila de los pies a la cabeza.
   - **Paracaídas:** baja balanceándose bajo una cúpula pixel y la suelta al aterrizar.
   - **Meteorito:** cruza el cielo en diagonal girando, envuelto en un resplandor con estela de fuego, y se estrella con destello, polvo y temblor.
   - **Ovni:** un platillo volante pixel entra tambaleándose, enciende un rayo tractor y baja a Clawd hasta el suelo antes de marcharse.
   - **Hiperespacio** (solo escritorio): estrellas que salen disparadas del centro mientras Clawd llega en espiral desde el fondo.
   - **Escritorio (≥ 1024 px con ratón):** todo ocurre a pantalla completa con un Clawd gigante. Al aterrizar saluda con una de seis variantes que rotan por visita (pose, globo y frase: "¡HOLA!", "¡EPA!", "¡HOLI!", "¡HEY!", "<HOLA/>", "¡OH!") y vuela en arco con voltereta hasta su sitio del hero mientras aparece el contenido. Cualquier tecla, clic o rueda la salta.
2. **Salto a la ruta:** al elegir tour o explorar, se mide el Clawd del hero y la ruta lo hace saltar en arco con voltereta desde ahí.
3. **Ruta de escritorio:** un tramo por sección, alternando carril, con estilos distintos (onda, zigzag, saltos rebotando) y cruces en arco por el hueco entre secciones, donde da una voltereta.
   - **Caminata:** el scroll fija un objetivo al 72 % del viewport y Clawd avanza *por el camino*: corre lejos, camina cerca y nunca queda parado en mitad de un cruce. Al final de la página el ancla se estira en los últimos 400 px de scroll: en viewports altos se quedaba corta y Clawd no llegaba a la meta (ni bandera ni confeti).
   - **Efectos:** deja huellas y estela, recoge una chispa por parada, se marea tras viajes largos, hace travesuras en reposo, mira hacia el cursor y celebra en la meta con confeti.
   - **Guiado (tour y botones de Buddy):** se invierte la relación. Clawd camina a su ritmo hasta la sección y la cámara le sigue con un muelle amortiguado. El tiempo se reparte por "esfuerzo": los cruces pesan poco, así que los salta de una voltereta y la página no se queda parada. Rueda, toque, tecla o clic devuelven el control al visitante.
4. **Ruta móvil:** barra inferior con las 5 paradas. Clawd camina según el avance de lectura; tocar una parada lleva a su sección con un scroll con easing. Se oculta mientras escribes en el formulario.
5. **Menú (clic en Clawd):** hub con el progreso de la ruta, tour, FAQ, skills, proyectos, contacto, "Sorpréndeme" y preferencias.
6. **Nav:** cada enlace es una parada numerada que se marca al visitarla, con pill de hover y modo compacto. El progreso de lectura es el borde inferior del pill, que se llena; un mini Clawd cuelga de él como en una tirolesa y se balancea con la velocidad del scroll. Al llegar al final de la página se suelta, abre un paracaídas pixel con rebote y baja balanceándose hasta posarse sobre el borde del footer (en móvil, por encima de la barra de ruta): la cúpula se desinfla, saluda con un "¡Hola!" y se va caminando por el borde más cercano. Al volver a subir reaparece en la vía. Con movimiento reducido solo se desvanece.
7. **Mensajes:** lo que Buddy dice por iniciativa propia se retira solo tras un tiempo de lectura proporcional al texto, para no tapar el contenido (por ejemplo, el formulario en móvil). Lo que pide el visitante queda abierto hasta que lo cierre.

## Evidencias

Capturas reales del build de producción (`vite build` + `vite preview`).

| Ficha `eidan.ts` | Ruta en escritorio | Meta: ruta completada |
| :---: | :---: | :---: |
| ![Ficha eidan.ts](docs/ficha.webp) | ![Clawd en la ruta junto al Stack](docs/stack.webp) | ![Meta con confeti y ruta completada](docs/meta.webp) |

| Móvil: bienvenida | Móvil: barra de ruta |
| :---: | :---: |
| <img src="docs/movil-hero.webp" alt="Bienvenida de Buddy en móvil" width="280"> | <img src="docs/movil-ruta.webp" alt="Barra de ruta inferior en móvil" width="280"> |

Animaciones grabadas con Chrome headless sobre el build de producción.

| Entrada «meteorito» | Entrada «ovni» |
| :---: | :---: |
| ![Clawd cae como un meteorito, se estrella mareado y saluda](docs/meteorito.webp) | ![Un ovni baja a Clawd con su rayo tractor y Clawd saluda](docs/ovni.webp) |

| Paracaídas del nav | Contacto por Gmail |
| :---: | :---: |
| <img src="docs/paracaidas.webp" alt="El mini Clawd del nav baja en paracaídas, aterriza sobre el footer y saluda" width="240"> | <img src="docs/contacto.webp" alt="Se rellena el formulario y Gmail queda listo con el mensaje escrito" width="420"> |

### Arquitectura

```mermaid
flowchart LR
    D["src/data<br/>perfil · proyectos · skills · guion"] --> P["BuddyProvider<br/>hero→ruta · tour · mood · paradas"]
    P --> H["HeroBuddy · IntroStage<br/>ClawdEntrance"]
    P --> R["RouteBuddy (escritorio)<br/>RouteTrack (móvil)"]
    P --> B["BuddyBubble · BuddyPanel<br/>BuddyHUD (aria-live)"]
    R --> G["route-geometry.ts<br/>geometría pura"]
    R --> F["fx.ts<br/>pools DOM + Web Animations"]
    D --> C["Hero · Skills · Projects<br/>Contact · ProfileCode"]
```

```
src/
  data/                   ← único sitio donde se edita contenido
    profile.ts            Perfil, filosofía, trayectoria y `contactEndpoint` (fuente: CV + Portafolio v3)
    projects.ts           Proyectos + bloque `buddy` (reto / arquitectura / opinión) y sesión real del taller de Java
    skills.ts             14 tecnologías (del portafolio original) con papel, evidencia y capacidades
    buddy-script.ts       Todo lo que dice Buddy: bienvenida, saludos de la intro, tour, FAQ, secciones, "Sorpréndeme", meta
    contact-copy.ts       Textos del formulario de contacto (validación, envío automático, plan B)
    ui.ts                 Textos de interfaz: menú, botones, diálogos y metadatos
    en/                   Versión inglesa de cada módulo, con exactamente las mismas claves
    github-stats.json     Repos y contribuciones de GitHub (el CI los actualiza en cada build)
  i18n/lang.ts            Idioma (es/en) elegido al cargar: `?lang=`, preferencia guardada o navegador; `pick` elige cada texto
  buddy/
    BuddyProvider.tsx     Estado: hero→ruta, vista, mood, tour, narración, paradas visitadas, movimiento; contextos separados para que cada componente escuche solo lo que usa
    BuddyAvatar.tsx       Clawd: secuencias de fotogramas PNG por ánimo + fotograma por dirección
    HeroBuddy.tsx         Bienvenida: burbuja, tour/explorar y salto a la ruta
    ClawdEntrance.tsx     Entradas: ensamblado, caída, teletransporte, lluvia, paracaídas, hiperespacio, meteorito y ovni (a pantalla o en el hueco)
    IntroStage.tsx        Intro a pantalla completa: entrada gigante, saludo rotativo y vuelo al hero
    PixelAssemble.tsx     Partículas que forman a Clawd desde los pixeles reales del PNG (dispersos o en lluvia, local o a pantalla completa)
    route-geometry.ts     Geometría pura de la ruta (onda, zigzag, saltos, cruces con voltereta)
    RouteBuddy.tsx        Ruta de carriles (escritorio ≥ 1280 px, chunk aparte): caminata, huellas, estela, chispas, meta
    RouteBuddyLazy.tsx    Punto de entrada de la ruta: solo se descarga en modo carriles
    RouteTrack.tsx        Ruta en barra inferior (móvil, tablet o movimiento reducido)
    fx.ts                 Pools DOM + Web Animations: huellas, estela, ráfagas, confeti
    BuddyBubble.tsx       Burbuja con controles (silenciar, minimizar, cerrar)
    BuddyPanel.tsx        Vistas de la burbuja: hub del menú, FAQ, proyectos, tour, contacto
    BuddyHUD.tsx          Región aria-live + píldora minimizada + barra de ruta
    stations.ts · pixel-props.tsx (cúpula, ovni, estela, bandera) · Typewriter.tsx · buddy.css
  components/
    PixelField.tsx        Fondo animado en canvas: brasas, estrellas, cometas, cuadrícula reactiva al cursor
    Skills.tsx            Stack como inventario con filtros y evidencia
    ProfileCode.tsx       Ficha `eidan.ts`: el perfil como archivo TypeScript en un editor
    Projects.tsx          Bento de 7 proyectos sin huecos (lg y md)
    TerminalPreview.tsx   Sesión real de consola tecleándose (taller de Java)
    CountUp.tsx           Métricas que cuentan al aparecer (valor final si el observador no se dispara)
    NavParachute.tsx      Paracaídas del mini Clawd: caída, aterrizaje en el footer, saludo y salida caminando
    Contact.tsx           Contacto honesto: envío automático confirmado o Gmail con el mensaje escrito
    KonamiEgg.tsx         Guiño del código Konami: gafas de sol y confeti pixel
    QuickView.tsx         "Resumen en 30 s": lo esencial para quien evalúa con prisa
    CaseStudyDialog.tsx   Caso de estudio de cada proyecto (problema → solución → decisiones → resultados → aprendizajes)
    Dialog · Nav · Hero · About · Background · TechIcon · interactive · icons
  lib/                    types.ts (contratos), hooks.ts, storage.ts, scroll.ts (scroll con easing cancelable), useHashLanding.ts (enlaces con `#sección`)
    contact.ts            Validación, redactor de Gmail o `mailto:`, detección de pestaña o app abierta y envío al Apps Script
    rotation.ts           Rotación por visita con memoria por carga (entradas y saludos)
    count.ts · konami.ts  Análisis de métricas y máquina de estados del código Konami
  styles/globals.css      Tokens (paleta Anthropic), vidrio, pixel-corners, reduced-motion
tests/                    51 tests de la lógica pura con node:test (sin red; dobles para fetch, window.open y el documento)
e2e/                      Pruebas E2E con Playwright: flujos clave en escritorio y móvil, sobre el build
scripts/github-stats.mjs  Cifras de GitHub con la API GraphQL (si falla, conserva las últimas)
apps-script/              contacto.gs (envío automático a tu Gmail) y su guía de despliegue
public/
  clawd/                  20 fotogramas de Clawd (Icons8)
  proyectos/              Capturas de los proyectos (salen de los `docs/` de cada repo)
  404.html                Página 404 con Clawd perdido (GitHub Pages la sirve en cualquier ruta rota)
```

### Decisiones técnicas

| Decisión | Por qué |
|---|---|
| Ruta como polilínea calculada en JS, no `getPointAtLength` | Permite formas arbitrarias (saltos, arcos) y colocar a Clawd antes del primer paint, que el salto desde el hero necesita. |
| Búsqueda por `ymax` (máximo acumulado de y) | Los saltos y arcos hacen la ruta no monótona en y; el máximo acumulado sí lo es y admite búsqueda binaria. |
| rAF que escribe `transform`; React solo recibe cambios de dirección | 60 fps sin re-render por frame. |
| Efectos con pools DOM + Web Animations API | Cero nodos nuevos y cero renders por huella, chispa o confeti. |
| Clawd self-hosted, no hotlink | Sin dependencia del CDN de Icons8; los fotogramas se precargan. |
| Contacto: Apps Script propio y, como plan B, Gmail | El `mailto:` en escritorio dependía de un cliente de correo instalado y la web daba el envío por hecho aunque fallara. El Apps Script envía desde la propia cuenta de Eidan, sin terceros, y responde `{ ok: true }`. Le llega como `text/plain`, que es una petición simple, porque Apps Script no contesta el preflight `OPTIONS`. Sin él, el redactor web de Gmail prellena en escritorio, pero en móvil solo abre la bandeja; allí `mailto:` abre la app (Gmail en Android). Solo se anuncia lo comprobable: confirmación del servidor, `window.open` distinto de `null` o la página oculta al cambiar de app poco después de lanzarla. |
| Rotación por visita con memoria por carga (`lib/rotation.ts`) | En desarrollo, StrictMode invoca dos veces los inicializadores de estado: sin la memoria, la rotación saltaba de dos en dos y en escritorio solo se veían 3 de las 6 entradas. |
| Ruta de escritorio en un chunk aparte (`React.lazy`) | Medido con el mapa de fuentes: el 80 % del JS es react-dom + motion. El móvil ya no descarga la ruta (13,5 kB) y, si el chunk falla, un ErrorBoundary deja la página en pie. La intro (4,2 kB) se queda en el bundle: cargarla aparte dejaba un instante sin telón. Bajar del aviso de 500 kB exigiría migrar a `LazyMotion`. |
| Métricas: valor final hasta armarse | Bajan a 0 justo antes de entrar en pantalla y cuentan al aparecer. Si el observador nunca se dispara (pestaña en segundo plano, robots), se ve el valor real y nunca un 0. |
| Contexto de Buddy dividido y contadores fuera de React | Medido con trazas de Chrome: durante el scroll, React re-renderizaba unas 20 veces por segundo secciones estáticas porque todo escuchaba el contexto completo de Buddy, que cambia con su ánimo y sus mensajes. Acciones, navegación, fase y movimiento van en contextos separados, tarjetas e iconos con `memo` y `CountUp` escribe el número en el DOM. En producción el scroll pasó de 10 a 23 fps en escritorio y de 13 a 30 en móvil con CPU 4× (Chrome headless). |
| `-webkit-backdrop-filter` siempre **antes** de `backdrop-filter` | Lightning CSS (minificador del build) trata ambos como la misma propiedad y conserva solo el último. En el orden inverso, producción perdía el estándar y Chrome/Edge pintaban el vidrio sin blur. |
| Scroll de Buddy propio (`lib/scroll.ts`), no `scrollIntoView` smooth | El smooth nativo es rápido y no se puede sincronizar con Clawd; el propio tiene duración y easing controlados y se cancela si el visitante toma el control. |
| Idioma elegido al cargar (`pick`) y recarga al cambiar | Los datos siguen siendo constantes importadas: ningún componente necesita estado de idioma. Comparando todos los textos del sitio antes y después, el español quedó idéntico; `?lang=en` deja un enlace compartible y la intro no se repite al cambiar. |
| Salto a `#sección` tras el primer render | El navegador intentaba el salto antes de que React pintara las secciones y los enlaces a una sección se quedaban arriba (también en la versión anterior). Ahora aterrizan, salvo que el visitante ya haya movido la página. |
| Cifras de GitHub con respaldo | `scripts/github-stats.mjs` consulta la API GraphQL en el CI; sin token o si falla, se conservan las últimas cifras guardadas y el build sigue. |
| E2E con el Chrome instalado (`channel: "chrome"`) | Ni en local ni en CI hay que descargar navegadores. Los tests leen los textos de `src/data` en vez de copiarlos: un cambio de redacción no los rompe. |
| Lighthouse CI con umbrales calibrados | Medido sobre el build real (móvil): rendimiento 87–90, accesibilidad 100, buenas prácticas 100 y SEO 100. Accesibilidad, buenas prácticas, SEO (≥ 95) y CLS (≤ 0,1) bloquean; el rendimiento solo avisa, porque en los runners compartidos de GitHub varió de 62 a 78 en una misma corrida. |
| Casos de estudio con cita | Cada afirmación lleva una cita literal del README, y un script verificó las 63 citas carácter a carácter. Al contrastarlas aparecieron dos cifras sin respaldo en el repo (5 competencias y umbral del 65 % en Preselección, 111 KB en Exámenes), que se corrigieron. |

### Diseño

- **Paleta de Anthropic:** Dark `#141413`, Light `#faf9f5`, Orange `#d97757`, Blue `#6a9bcc`, Green `#788c5d`, grises `#b0aea5` / `#e8e6dc`. Los tokens son semánticos (`claude`, `sky`, `olive`, `sand`, `stone`). El texto naranja pequeño usa `claude-light` por contraste (ver la nota medida en `globals.css`).
- **Tipografía:** Plus Jakarta Sans para títulos, Inter para el texto y Silkscreen solo para micro-etiquetas pixel (paradas, badges, contadores; mínimo 12 px). Se descartó Pixelify Sans: a ese tamaño convertía "02" en "08".
- **Fondo:** orbes CSS de la paleta + un canvas con brasas pixel que suben con parallax, estrellas de 4 puntas que titilan, cometas ocasionales y una cuadrícula que se enciende bajo el cursor. Se pausa con la pestaña oculta.

### Accesibilidad y movimiento

- Por defecto se respeta `prefers-reduced-motion`: sin animaciones, con la ruta en barra y Clawd saltando sin caminar. El interruptor **"Animaciones completas"** (bienvenida y menú) lo anula a elección del visitante y lo aplica en tres capas: `MotionConfig`, la clase `html.motion-ok` y el modo de ruta.
- Silenciar comentarios automáticos y minimizar a Buddy, ambos persistidos.
- Una sola región `aria-live`. `Escape` cierra la burbuja.
- Filtros con `aria-pressed` y resultado anunciado. Paradas con etiquetas descriptivas y áreas táctiles de 44 px.

## Instalación y uso

Requiere Node.js (el CI usa la versión 24):

```bash
git clone https://github.com/Eidan210/portafolio-junior.git
cd portafolio-junior
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build estático en dist/
npm test           # 51 tests de la lógica pura (node --test, sin red)
npm run test:e2e   # pruebas E2E con Playwright sobre el build (usa tu Chrome)
npm run preview    # sirve dist/
```

Para que el formulario envíe solo, despliega el Apps Script ([`apps-script/README.md`](apps-script/README.md)) y pega su URL en `contactEndpoint` (`src/data/profile.ts`). Sin ella, el formulario abre Gmail con el mensaje escrito.

El idioma se elige solo; para forzarlo, añade `?lang=en` o `?lang=es` a la URL.

Para ver una entrada concreta sin esperar a la rotación, añade `?entrada=` a la URL: `ensamblado`, `caida`, `teletransporte`, `lluvia`, `paracaidas`, `hiperespacio`, `meteorito` u `ovni` (por ejemplo, `http://localhost:5173/?entrada=ovni`).

### Despliegue

`.github/workflows/deploy.yml` pasa los tests, actualiza las cifras de GitHub, compila y corre las pruebas E2E en cada pull request (check de CI); al fusionar en `main` (y cada lunes, para refrescar las cifras) publica `dist/` en GitHub Pages (origen de Pages: **GitHub Actions**). Si una prueba E2E falla, no se publica. `.github/workflows/lighthouse.yml` mide el build con Lighthouse y falla si rendimiento, accesibilidad, buenas prácticas o SEO bajan de su umbral. `base: "./"` deja las rutas relativas, así que el mismo build sirve en el subpath `/portafolio-junior/` o en un dominio propio.

Se conservan las URL públicas del sitio anterior: `cv/CV-Eidan-Carreno.pdf` y `img/og-image.png`. La versión estática anterior (HTML, CSS y JS) queda en el tag [`v1-estatico`](https://github.com/Eidan210/portafolio-junior/tree/v1-estatico).

## Aprendizajes

- **Animar a 60 fps sin pelear con React:** un bucle `requestAnimationFrame` escribe `transform` directamente y React solo recibe cambios discretos (dirección, ánimo). Los efectos reutilizan nodos de un *pool* con la Web Animations API.
- **Geometría aplicada:** modelar la ruta como polilínea y usar el máximo acumulado de *y* (monótono) para buscar con búsqueda binaria en una curva que no lo es.
- **Movimiento que se siente natural:** una cámara con muelle críticamente amortiguado y un reparto del tiempo por "esfuerzo" para que el guiado no se frene en los cruces.
- **Depurar lo que solo falla en producción:** el minificador descartaba `backdrop-filter` según el orden de las declaraciones, y en viewports altos Clawd no llegaba a la meta. Ambos se midieron antes de corregirlos.
- **Accesibilidad como requisito:** `prefers-reduced-motion` respetado por defecto, con un interruptor que lo anula en tres capas, y una sola región `aria-live`.
- **Contenido separado de la presentación:** todo el texto vive en `src/data`, tipado, para editarlo sin tocar componentes.
- **No anunciar lo que no ocurrió:** el formulario daba el mensaje por enviado aunque el cliente de correo no se abriera. Ahora solo dice lo que puede comprobar, y una suite con `node:test`, validada con pruebas de mutación, impide que el fallo vuelva.
- **Medir antes de optimizar:** el aviso de 500 kB parecía culpa de la app, pero el mapa de fuentes mostró que el 80 % es react-dom y motion. Partir la app solo daba 15 kB, y así se decidió con datos y no a ciegas.
- **StrictMode también tiene efectos visibles:** en desarrollo invoca dos veces los inicializadores de estado, y la rotación de entradas avanzaba de dos en dos (en escritorio solo se veían 3 de 6). Una memoria por carga de página lo resolvió.
- **CI/CD:** tests y compilación como check en cada pull request, y publicación automática en GitHub Pages.

## Créditos

Ilustraciones de Clawd: [Icons by Icons8](https://icons8.com/icons/set/anthropic-claude-icon); la licencia gratuita exige este enlace, que está en el footer. Clawd es la mascota de Claude (Anthropic). Logos de tecnologías: Simple Icons y Devicon.
