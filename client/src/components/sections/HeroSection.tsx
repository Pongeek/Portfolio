import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Download,
  Calendar,
  Rocket,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiSpring,
  SiTailwindcss,
  SiPostgresql,
} from "react-icons/si";
import { useInView } from "@/hooks/use-in-view";
import { scrollToSection } from "@/lib/scroll";
import CodeCard from "@/components/CodeCard";
import HeroCursor from "@/components/HeroCursor";

// ─── Tech stack chips shown under the description ─────────────────────────────
const TECH_STACK = [
  { name: "React",      Icon: SiReact,       hoverColor: "group-hover:text-[#61DAFB]" },
  { name: "TypeScript", Icon: SiTypescript,  hoverColor: "group-hover:text-[#3178C6]" },
  { name: "Node.js",    Icon: SiNodedotjs,   hoverColor: "group-hover:text-[#5FA04E]" },
  { name: "Spring",     Icon: SiSpring,      hoverColor: "group-hover:text-[#6DB33F]" },
  { name: "Tailwind",   Icon: SiTailwindcss, hoverColor: "group-hover:text-[#38BDF8]" },
  { name: "Postgres",   Icon: SiPostgresql,  hoverColor: "group-hover:text-[#4169E1]" },
];

// ─── Animated stat card ───────────────────────────────────────────────────────
function AnimatedStat({
  display,
  label,
  icon: Icon,
}: {
  display: string;
  label: string;
  icon: LucideIcon;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const [count, setCount] = useState(0);

  const numMatch = display.match(/^(\d+)(.*)$/);
  const target   = numMatch ? parseInt(numMatch[1], 10) : null;
  const suffix   = numMatch ? numMatch[2] : "";

  useEffect(() => {
    if (!inView || target === null) return;
    const steps = 36;
    const stepVal = target / steps;
    const stepMs  = 1200 / steps;
    let current   = 0;
    const timer = setInterval(() => {
      current += stepVal;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.round(current));
    }, stepMs);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div
      ref={ref}
      className="group relative flex-1 min-w-[110px] flex flex-col gap-1 rounded-xl
        border border-border bg-card/90 backdrop-blur-sm px-4 py-3 shadow-sm
        hover:border-primary/50 hover:bg-card hover:shadow-md hover:shadow-primary/10
        hover:-translate-y-0.5 transition-all duration-300"
    >
      <Icon
        className="absolute top-3 right-3 h-4 w-4 text-muted-foreground/60
          group-hover:text-primary transition-colors"
        aria-hidden="true"
      />
      <span className="font-display text-2xl font-bold text-foreground tabular-nums leading-none">
        {target !== null ? `${count}${suffix}` : display}
      </span>
      <span className="text-[11px] font-mono text-muted-foreground tracking-wide leading-tight">
        {label}
      </span>
    </div>
  );
}

const STATS: { display: string; label: string; icon: LucideIcon }[] = [
  { display: "3+",         label: "Years Coding",       icon: Calendar },
  { display: "5+",         label: "Projects Shipped",   icon: Rocket   },
  { display: "Full Stack", label: "Frontend & Backend", icon: Layers   },
];

// ─── Hero section ──────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  // Respect OS-level "reduce motion" preference — disable parallax for users
  // who are sensitive to motion (vestibular disorders, etc.)
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reducedMotion) return; // don't track scroll if parallax is disabled
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <section id="home" className="hero-cursor-target relative min-h-screen flex items-center overflow-hidden">
      <HeroCursor targetSelector="#home" />
      {/* Background layers */}
      {/* Animated multi-color gradient mesh — slowly drifts behind the dot grid.
          Wrapped so we can attach a subtle parallax tied to scroll position. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: reducedMotion ? "none" : `translateY(${scrollY * 0.18}px)`,
          willChange: reducedMotion ? "auto" : "transform",
        }}
      >
        <div className="hero-gradient-mesh" />
      </div>
      <div className="absolute inset-0 hero-dot-grid opacity-40 pointer-events-none" />

      {/* Content - two-column on lg+ */}
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* ── Left: text ─────────────────────────────────── */}
          <div className="flex-1 max-w-2xl">
            {/* Available for hire badge */}
            <div className="flex items-center gap-2 mb-5 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-emerald-500 tracking-wide">Available for hire</span>
            </div>

            <p className="font-mono text-primary text-sm tracking-[0.2em] uppercase mb-5 animate-fade-up"
               style={{ animationDelay: "0.04s" }}>
              Hi, I'm
            </p>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-3 animate-fade-up bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
                style={{ animationDelay: "0.08s" }}>
              Max Mullokandov
            </h1>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-6 animate-fade-up"
                style={{ animationDelay: "0.12s" }}>
              Full Stack Developer
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-7 animate-fade-up"
               style={{ animationDelay: "0.16s" }}>
              I build clean, scalable web applications end-to-end - responsive React frontends,
              robust Java Spring and Node.js backends, and everything in between.
            </p>

            {/* Tech stack strip */}
            <div className="mb-8 animate-fade-up"
                 style={{ animationDelay: "0.18s" }}>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Working with
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {TECH_STACK.map(({ name, Icon, hoverColor }) => (
                  <div
                    key={name}
                    className="group flex items-center gap-1.5 cursor-default"
                    title={name}
                  >
                    <Icon
                      className={`h-4 w-4 text-muted-foreground transition-colors duration-300 ${hoverColor}`}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-3 mb-10 animate-fade-up"
                 style={{ animationDelay: "0.22s" }}>
              {STATS.map((s) => (
                <AnimatedStat key={s.label} display={s.display} label={s.label} icon={s.icon} />
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 animate-fade-up"
                 style={{ animationDelay: "0.24s" }}>
              <Button size="lg" onClick={() => scrollToSection("projects")} className="gap-2 font-medium">
                View Projects <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 font-medium">
                <a href="/Max_Mullokandov_FullStack_Developer.pdf" download="Max_Mullokandov_CV.pdf">
                  Download Resume <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-5 animate-fade-up"
                 style={{ animationDelay: "0.28s" }}>
              <a href="https://github.com/Pongeek" target="_blank" rel="noopener noreferrer"
                 aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/maxim-mullokandov/" target="_blank" rel="noopener noreferrer"
                 aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:MaximPim95@gmail.com" aria-label="Email"
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ── Right: interactive code card ───────────────── */}
          <div className="hidden lg:flex flex-1 justify-center items-center animate-fade-up"
               style={{ animationDelay: "0.32s" }}>
            <CodeCard />
          </div>

        </div>
      </div>

      {/* Scroll indicator - vertical line with a falling pulse */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none pointer-events-none">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
          Scroll
        </span>
        <div className="relative h-10 w-px bg-muted-foreground/30 overflow-hidden">
          <span className="absolute left-0 top-0 h-3 w-px bg-primary animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
