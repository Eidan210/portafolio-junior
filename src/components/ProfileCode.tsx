/**
 * Ocupa el sitio de Buddy en el hero cuando ya saltó a su ruta: el perfil como
 * un archivo `eidan.ts` abierto en un editor, con resaltado de sintaxis,
 * números de línea y barra de estado. Las líneas se "teclean" una a una con un
 * barrido por pasos. El código es decorativo (`aria-hidden`); el mismo
 * contenido va como lista de definiciones para lectores de pantalla.
 *
 * Colores de token sobre el vidrio oscuro (AA): palabras clave claude-light,
 * claves sky-light, cadenas olive-light, números amber, puntuación stone.
 */
import { motion, useReducedMotionConfig } from "motion/react";
import { Check, GitBranch } from "lucide-react";
import type { ReactNode } from "react";
import { profileCode } from "@/data/profile";
import type { CodeEntry } from "@/lib/types";
import { TiltCard } from "@/components/interactive";

const ease = [0.16, 1, 0.3, 1] as const;
/** Barrido por pasos: la línea aparece tecleada, no con un fundido. */
const typed = (t: number) => Math.floor(t * 14) / 14;

const P = ({ children }: { children: ReactNode }) => <span className="text-stone">{children}</span>;

function Value({ value }: { value: CodeEntry["value"] }) {
  if (typeof value === "string") return <span className="text-olive-light">"{value}"</span>;
  if (typeof value === "number") return <span className="text-amber">{value}</span>;
  return <span className="text-sky-light">{String(value)}</span>;
}

const LINES: readonly ReactNode[] = [
  <>
    <span className="text-claude-light">const</span> <span className="text-fg">eidan</span> <P>= {"{"}</P>
  </>,
  ...profileCode.map((e) => (
    <>
      {"  "}
      <span className="text-sky-light">{e.key}</span>
      <P>:</P> <Value value={e.value} />
      <P>,</P>
      {e.live && <span className="ml-2 inline-block size-1.5 animate-pulse rounded-full bg-olive-light align-middle" />}
      {/* En pantallas de 320 px el comentario no cabe: se omite. */}
      {e.comment && <span className="text-stone italic max-[359px]:hidden">{`  // ${e.comment}`}</span>}
    </>
  )),
  <>
    <P>{"}"}</P> <span className="text-claude-light">satisfies</span> <span className="text-sky-light">Dev</span>
    <P>;</P>
  </>,
];

export function ProfileCode() {
  const reduce = useReducedMotionConfig();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.5, ease }} className="w-full max-w-sm">
      <TiltCard className="overflow-hidden rounded-3xl">
        <figure aria-label="Ficha de Eidan">
          {/* Barra de ventana: semáforo y pestaña del archivo. */}
          <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-2.5" aria-hidden="true">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-danger/80" />
              <span className="size-2.5 rounded-full bg-amber/80" />
              <span className="size-2.5 rounded-full bg-olive-light/80" />
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.05] px-2 py-0.5 font-mono text-xs text-muted">
              <span className="font-bold text-sky-light">TS</span> eidan.ts
            </span>
          </div>

          <pre className="overflow-x-auto py-3 font-mono text-[0.8125rem] leading-6 max-[359px]:text-xs" aria-hidden="true">
            <code className="grid">
              {LINES.map((line, i) => (
                <span key={i} className="flex px-4 transition-colors hover:bg-white/[0.04]">
                  <span className="w-5 shrink-0 text-right text-stone/50 select-none">{i + 1}</span>
                  <motion.span
                    className="pl-4 whitespace-pre"
                    initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.22, ease: typed }}
                  >
                    {line}
                    {i === LINES.length - 1 && <span className="typing-caret" />}
                  </motion.span>
                </span>
              ))}
            </code>
          </pre>

          {/* Barra de estado del editor. */}
          <div className="flex items-center gap-4 border-t border-white/8 bg-white/[0.03] px-4 py-2 font-mono text-[0.7rem] text-subtle" aria-hidden="true">
            <span className="flex items-center gap-1">
              <GitBranch className="size-3.5" /> main
            </span>
            <span className="flex items-center gap-1 text-olive-light">
              <Check className="size-3.5" /> 0 problemas
            </span>
            <span className="ml-auto">TypeScript</span>
          </div>

          <dl className="sr-only">
            {profileCode.map((e) => (
              <div key={e.key}>
                <dt>{e.label}</dt>
                <dd>{e.value === true ? "Sí" : e.value === false ? "No" : String(e.value)}</dd>
              </div>
            ))}
          </dl>
        </figure>
      </TiltCard>
    </motion.div>
  );
}
