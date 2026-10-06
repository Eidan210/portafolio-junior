import { profile } from "@/data/profile";
import { BuddyHUD } from "@/buddy/BuddyHUD";
import { BuddyProvider } from "@/buddy/BuddyProvider";
import { RouteBuddy } from "@/buddy/RouteBuddy";
import { About } from "@/components/About";
import { Background } from "@/components/Background";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";

export function App() {
  return (
    // BuddyProvider envuelve la app en MotionConfig con la preferencia de movimiento efectiva.
    <BuddyProvider>
        <a href="#main" className="skip-link btn btn-primary">
          Saltar al contenido
        </a>
        <Background />
        <Nav />
        {/* `relative`: RouteBuddy dibuja la ruta en coordenadas de <main>. */}
        <main id="main" className="relative overflow-x-clip">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
          <RouteBuddy />
        </main>
        <footer className="shell px-4 pt-8 pb-32 text-sm text-subtle sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-8">
            <p>
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p>
              Hecho con React, Tailwind y Motion · Ilustraciones de Clawd:{" "}
              <a href="https://icons8.com" target="_blank" rel="noreferrer" className="text-muted underline underline-offset-2 hover:text-fg">
                Icons by Icons8
              </a>
            </p>
          </div>
        </footer>
        <BuddyHUD />
    </BuddyProvider>
  );
}
