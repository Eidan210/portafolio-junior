import { profile } from "@/data/profile";
import { footerCopy } from "@/data/ui";
import { BuddyHUD } from "@/buddy/BuddyHUD";
import { BuddyProvider } from "@/buddy/BuddyProvider";
import { RouteBuddy } from "@/buddy/RouteBuddyLazy";
import { About } from "@/components/About";
import { Background } from "@/components/Background";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { KonamiEgg } from "@/components/KonamiEgg";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { useHashLanding } from "@/lib/useHashLanding";

export function App() {
  useHashLanding();
  return (
    // BuddyProvider envuelve la app en MotionConfig con la preferencia de movimiento efectiva.
    <BuddyProvider>
        <a href="#main" className="skip-link btn btn-primary">
          {footerCopy.skipToContent}
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
          {/* `data-landing`: el borde superior visible es el suelo donde aterriza el paracaídas del nav. */}
          <div data-landing className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-8">
            <p>
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p>
              {footerCopy.builtWith}
              <a href="https://icons8.com" target="_blank" rel="noreferrer" className="text-muted underline underline-offset-2 hover:text-fg">
                {footerCopy.iconsBy}
              </a>
            </p>
          </div>
        </footer>
        <BuddyHUD />
        <KonamiEgg />
    </BuddyProvider>
  );
}
