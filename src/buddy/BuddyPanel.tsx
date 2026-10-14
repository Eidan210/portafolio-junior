/**
 * Contenido de la burbuja de Buddy, una vista por tipo. Solo presentación:
 * toda transición de estado pasa por las acciones de `useBuddy`.
 */
import { motion, useReducedMotionConfig } from "motion/react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleQuestionMark,
  Copy,
  Dices,
  FolderGit2,
  Mail,
  Route,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { copiedEmail, faq, skillsSummary, surprises, tour } from "@/data/buddy-script";
import { profile } from "@/data/profile";
import { projectById, projects } from "@/data/projects";
import { buddyUiCopy } from "@/data/ui";
import { GitHubIcon } from "@/components/icons";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import { Typewriter } from "@/buddy/Typewriter";
import { SECTION_IDS, useBuddy, useBuddyActions, useBuddyMotion } from "@/buddy/BuddyProvider";
import { STATION_LABELS, stationNumber } from "@/buddy/stations";
import type { BuddyView } from "@/buddy/BuddyProvider";

const itemBtn =
  "flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5 text-left text-sm text-fg transition-colors hover:border-white/20 hover:bg-white/[0.09]";
const smallBtn =
  "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-fg transition-colors hover:bg-white/[0.12]";

function Heading({ children }: { children: ReactNode }) {
  return <p className="mb-2 font-display text-sm font-bold text-fg">{children}</p>;
}

/** Escalona la entrada de los bloques del explicador de proyecto. */
function Stagger({ i, children }: { i: number; children: ReactNode }) {
  const reduce = useReducedMotionConfig();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : 0.15 + i * 0.18, duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(profile.email);
    return true;
  } catch {
    return false; // contexto inseguro o permiso denegado: el email sigue visible para copiarlo a mano
  }
}

/** Interruptor de movimiento completo: solo tiene sentido si el sistema pide movimiento reducido. */
export function MotionToggle({ className = "" }: { className?: string }) {
  const { systemReduced, reducedMotion, setFullMotion } = useBuddyMotion();
  if (!systemReduced) return null;
  return (
    <div className={className}>
      <Switch
        on={!reducedMotion}
        label={buddyUiCopy.motionLabel}
        hint={buddyUiCopy.motionHint}
        onToggle={() => setFullMotion(reducedMotion)}
      />
    </div>
  );
}

type Tone = "claude" | "sky" | "olive";
const TONE: Record<Tone, string> = {
  claude: "bg-claude/15 text-claude-light",
  sky: "bg-sky/15 text-sky-light",
  olive: "bg-olive/20 text-olive-light",
};

/** Interruptor accesible (role="switch") con el estilo de la paleta. */
function Switch({ on, label, hint, onToggle }: { on: boolean; label: string; hint?: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-1.5 text-left text-xs text-muted hover:bg-white/[0.06]"
    >
      <span>
        <span className="block font-semibold text-fg">{label}</span>
        {hint && <span className="block leading-snug">{hint}</span>}
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-claude" : "bg-white/15"}`} aria-hidden="true">
        <span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}

/** Hub del menú: cabecera con Clawd, progreso de la ruta, acciones y preferencias. */
function MenuView() {
  const { say, startTour, scrollTo, close, visited, muted, setMuted, mood } = useBuddy();
  const reduce = useReducedMotionConfig();

  const surprise = () => {
    if (Math.random() < 0.35) {
      const p = projects[Math.floor(Math.random() * projects.length)];
      if (p) {
        scrollTo(`proyecto-${p.id}`);
        say({ type: "project", projectId: p.id });
        return;
      }
    }
    const fact = surprises[Math.floor(Math.random() * surprises.length)] ?? surprises[0] ?? "";
    say({ type: "text", title: buddyUiCopy.surpriseTitle, text: fact, mood: "happy", actions: [{ label: buddyUiCopy.surpriseAnother, run: surprise }] });
  };

  const tiles: { icon: typeof Route; label: string; hint: string; tone: Tone; run: () => void }[] = [
    { icon: Route, label: buddyUiCopy.tourTileLabel, hint: buddyUiCopy.tourTileHint, tone: "claude", run: startTour },
    { icon: CircleQuestionMark, label: buddyUiCopy.faqTileLabel, hint: buddyUiCopy.faqTileHint, tone: "sky", run: () => say({ type: "faq" }) },
    {
      icon: Sparkles,
      label: buddyUiCopy.skillsTileLabel,
      hint: buddyUiCopy.skillsTileHint,
      tone: "olive",
      run: () =>
        say({ type: "text", title: buddyUiCopy.skillsSummaryTitle, text: skillsSummary, mood: "coding", actions: [{ label: buddyUiCopy.viewStackAction, run: () => scrollTo("stack") }] }),
    },
    { icon: FolderGit2, label: buddyUiCopy.projectsTileLabel, hint: buddyUiCopy.projectsTileHint, tone: "claude", run: () => say({ type: "projects" }) },
    { icon: Mail, label: buddyUiCopy.contactTileLabel, hint: buddyUiCopy.contactTileHint, tone: "sky", run: () => say({ type: "contact" }) },
    { icon: Dices, label: buddyUiCopy.surpriseTileLabel, hint: buddyUiCopy.surpriseTileHint, tone: "olive", run: surprise },
  ];

  return (
    <div className="grid gap-2.5">
      <div className="flex items-center gap-3">
        <BuddyAvatar mood={mood} bare className="size-10 shrink-0" />
        <div className="min-w-0">
          <p className="font-display text-base font-bold text-fg">{buddyUiCopy.helpTitle}</p>
          <p className="text-xs text-subtle">
            {buddyUiCopy.guideSubtitle(visited.length, SECTION_IDS.length)}
          </p>
        </div>
      </div>

      {/* Progreso: una casilla por parada; pulsarla lleva a la sección y Clawd camina hasta allí. */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-2">
        <div className="mb-2 flex items-center justify-between font-pixel text-xs tracking-wider text-stone uppercase">
          <span>{buddyUiCopy.routeProgressTitle}</span>
          <span className="text-claude-light">
            {visited.length}/{SECTION_IDS.length}
          </span>
        </div>
        <ol className="grid grid-cols-5 gap-1.5" aria-label={buddyUiCopy.stopsAria}>
          {SECTION_IDS.map((id) => {
            const done = visited.includes(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    scrollTo(id);
                    close();
                  }}
                  aria-label={buddyUiCopy.goToStationAria(STATION_LABELS[id], done)}
                  title={STATION_LABELS[id]}
                  className={`pixel-corners grid h-8 w-full place-items-center font-pixel text-xs transition-colors ${
                    done ? "bg-claude text-ink" : "bg-ink-3 text-sand hover:bg-white/10"
                  }`}
                >
                  {done ? <Check className="size-3.5" aria-hidden="true" /> : stationNumber(id)}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {tiles.map(({ icon: Icon, label, hint, tone, run }, i) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.04 * i, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={run}
              className="group flex h-full w-full items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.035] p-2 text-left transition duration-200 hover:-translate-y-0.5 hover:border-claude/45 hover:bg-white/[0.07]"
            >
              <span className={`pixel-corners grid size-9 shrink-0 place-items-center transition-transform duration-300 group-hover:-rotate-6 ${TONE[tone]}`}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-tight font-semibold text-fg">{label}</span>
                <span className="block truncate text-xs text-subtle">{hint}</span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <div className="grid gap-0.5 border-t border-white/8 pt-1.5">
        <Switch on={!muted} label={buddyUiCopy.autoCommentsLabel} onToggle={() => setMuted(!muted)} />
        <MotionToggle />
        <p className="px-3 pt-1 text-[0.7rem] text-stone">{buddyUiCopy.menuShortcutHint}</p>
      </div>
    </div>
  );
}

function FaqView() {
  const { say } = useBuddy();
  const back: BuddyView = { type: "faq" };
  return (
    <div>
      <Heading>{buddyUiCopy.faqHeading}</Heading>
      <ul className="grid gap-1.5">
        {faq.map((entry) => (
          <li key={entry.q}>
            <button
              type="button"
              className={itemBtn}
              onClick={() =>
                say({
                  type: "text",
                  title: entry.q,
                  text: entry.a,
                  mood: "talk",
                  actions: [{ label: buddyUiCopy.anotherQuestionAction, run: () => say(back) }],
                })
              }
            >
              <CircleQuestionMark className="size-4 shrink-0 text-sky-light" aria-hidden="true" />
              {entry.q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectsView() {
  const { say, scrollTo } = useBuddyActions();
  return (
    <div>
      <Heading>{buddyUiCopy.whichProjectHeading}</Heading>
      <ul className="grid gap-1.5">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={itemBtn}
              onClick={() => {
                scrollTo(`proyecto-${p.id}`);
                say({ type: "project", projectId: p.id });
              }}
            >
              <span className="min-w-0">
                <span className="block font-semibold">{p.title}</span>
                <span className="block truncate text-xs text-subtle">{p.category}</span>
              </span>
              <ChevronRight className="ml-auto size-4 shrink-0 text-subtle" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectView({ projectId }: { projectId: string }) {
  const { say } = useBuddyActions();
  const project = projectById(projectId);
  if (!project) return null;
  const blocks = [
    { label: buddyUiCopy.challengeLabel, text: project.buddy.challenge, color: "text-claude-light" },
    { label: buddyUiCopy.architectureLabel, text: project.buddy.architecture, color: "text-sky-light" },
    { label: buddyUiCopy.opinionLabel, text: project.buddy.takeaway, color: "text-olive-light" },
  ];
  return (
    <div>
      <p className="eyebrow mb-1 !text-[0.65rem]">{buddyUiCopy.buddyExplainsEyebrow}</p>
      <Heading>{project.title}</Heading>
      <div className="grid gap-3 text-sm leading-relaxed text-muted">
        {blocks.map((b, i) => (
          <Stagger key={b.label} i={i}>
            <p className={`mb-0.5 text-xs font-bold uppercase tracking-wider ${b.color}`}>{b.label}</p>
            <p>{b.text}</p>
          </Stagger>
        ))}
        <Stagger i={3}>
          <ul className="flex flex-wrap gap-1.5" aria-label={buddyUiCopy.techsAria}>
            {project.stack.map((t) => (
              <li key={t} className="chip !px-2 !py-0.5 !text-[0.7rem]">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className={smallBtn} href={project.repoUrl} target="_blank" rel="noreferrer">
              <GitHubIcon className="size-3.5" /> {buddyUiCopy.repoBtn}
            </a>
            {project.demoUrl && (
              <a className={smallBtn} href={project.demoUrl} target="_blank" rel="noreferrer">
                <ArrowUpRight className="size-3.5" aria-hidden="true" /> {buddyUiCopy.demoBtn}
              </a>
            )}
            <button type="button" className={smallBtn} onClick={() => say({ type: "projects" })}>
              {buddyUiCopy.anotherProjectBtn}
            </button>
          </div>
        </Stagger>
      </div>
    </div>
  );
}

function ContactView() {
  const { scrollTo, close } = useBuddy();
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <Heading>{buddyUiCopy.talkWithEidanHeading}</Heading>
      <p className="mb-3 text-sm text-muted">{profile.availability}.</p>
      <div className="grid gap-1.5">
        <button
          type="button"
          className={itemBtn}
          onClick={async () => {
            if (await copyEmail()) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2200);
            }
          }}
        >
          {copied ? <Check className="size-4 text-olive-light" aria-hidden="true" /> : <Copy className="size-4 text-claude-light" aria-hidden="true" />}
          <span className="min-w-0 truncate">{copied ? copiedEmail : profile.email}</span>
        </button>
        <a className={itemBtn} href={profile.github} target="_blank" rel="noreferrer">
          <GitHubIcon className="size-4" /> github.com/{profile.githubUser}
        </a>
        <button
          type="button"
          className={itemBtn}
          onClick={() => {
            scrollTo("contacto");
            close();
          }}
        >
          <Mail className="size-4 text-sky-light" aria-hidden="true" /> {buddyUiCopy.goToFormBtn}
        </button>
      </div>
    </div>
  );
}

function TourView({ index }: { index: number }) {
  const { goTour, endTour } = useBuddy();
  const step = tour[index];
  if (!step) return null;
  const last = index === tour.length - 1;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="eyebrow !text-[0.65rem]">
          {buddyUiCopy.tourStepEyebrow(index + 1, tour.length)}
        </p>
        <ol className="flex gap-1" aria-hidden="true">
          {tour.map((s, i) => (
            <li key={s.section} className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-claude" : "w-1.5 bg-white/25"}`} />
          ))}
        </ol>
      </div>
      <p className="text-sm leading-relaxed text-fg">
        <Typewriter text={step.text} />
      </p>
      <div className="mt-3 flex items-center gap-2">
        {index > 0 && (
          <button type="button" className={smallBtn} onClick={() => goTour(index - 1)} aria-label={buddyUiCopy.prevStepAria}>
            <ChevronLeft className="size-3.5" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className={`${smallBtn} !border-claude/50 !bg-claude/20`}
          onClick={() => (last ? endTour() : goTour(index + 1))}
        >
          {last ? buddyUiCopy.finishTourBtn : buddyUiCopy.nextStepBtn}
          {!last && <ChevronRight className="size-3.5" aria-hidden="true" />}
        </button>
        {!last && (
          <button type="button" className="ml-auto text-xs text-subtle underline-offset-2 hover:text-fg hover:underline" onClick={endTour}>
            {buddyUiCopy.exitTourBtn}
          </button>
        )}
      </div>
    </div>
  );
}

function TextView({ view }: { view: Extract<BuddyView, { type: "text" }> }) {
  const { say } = useBuddyActions();
  return (
    <div>
      {view.title && <Heading>{view.title}</Heading>}
      <p className="text-sm leading-relaxed text-fg">
        <Typewriter text={view.text} />
      </p>
      {view.actions && (
        <div className="mt-3 flex flex-wrap gap-2">
          {view.actions.map((a) => (
            <button key={a.label} type="button" className={smallBtn} onClick={a.run}>
              {a.label}
            </button>
          ))}
          {!view.auto && (
            <button type="button" className={smallBtn} onClick={() => say({ type: "menu" })}>
              {buddyUiCopy.menuBtn}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function BuddyPanel({ view }: { view: BuddyView }) {
  switch (view.type) {
    case "menu":
      return <MenuView />;
    case "faq":
      return <FaqView />;
    case "projects":
      return <ProjectsView />;
    case "project":
      return <ProjectView projectId={view.projectId} />;
    case "contact":
      return <ContactView />;
    case "tour":
      return <TourView index={view.index} />;
    case "text":
      return <TextView view={view} />;
  }
}

/** Texto plano equivalente a la vista, para la región viva de lectores de pantalla. */
export function viewToSpeech(view: BuddyView | null): string {
  if (!view) return "";
  switch (view.type) {
    case "text":
      return [view.title, view.text].filter(Boolean).join(". ");
    case "tour": {
      const step = tour[view.index];
      return step ? buddyUiCopy.speechTourStep(view.index + 1, tour.length, step.text) : "";
    }
    case "project": {
      const p = projectById(view.projectId);
      return p ? buddyUiCopy.speechProject(p.title, p.buddy.challenge, p.buddy.architecture, p.buddy.takeaway) : "";
    }
    case "menu":
      return buddyUiCopy.speechMenu;
    case "faq":
      return buddyUiCopy.speechFaq;
    case "projects":
      return buddyUiCopy.speechProjects;
    case "contact":
      return buddyUiCopy.speechContact;
  }
}
