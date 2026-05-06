import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowRight, Download } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedStat({ display, label }: { display: string; label: string }) {
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
    <div ref={ref} className="flex items-baseline gap-1.5 text-sm">
      <span className="font-semibold text-foreground tabular-nums">
        {target !== null ? `${count}${suffix}` : display}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

const STATS = [
  { display: "3+",        label: "Years Coding"       },
  { display: "5+",        label: "Projects Shipped"   },
  { display: "Full Stack", label: "Frontend & Backend" },
];

// ─── Code card with typing animation + mouse-tracking tilt ──────────────────
const CODE_LINES = [
  { indent: 0, tokens: [{ t: "keyword", v: "const " }, { t: "fn",      v: "buildApp"    }, { t: "plain",  v: " = async () => {" }] },
  { indent: 1, tokens: [{ t: "keyword", v: "const " }, { t: "plain",   v: "stack = ["   }] },
  { indent: 2, tokens: [{ t: "string",  v: '"React"'       }] },
  { indent: 2, tokens: [{ t: "string",  v: '"TypeScript"'  }] },
  { indent: 2, tokens: [{ t: "string",  v: '"Node.js"'     }] },
  { indent: 2, tokens: [{ t: "string",  v: '"Java Spring"' }] },
  { indent: 1, tokens: [{ t: "plain",   v: "];"            }] },
  { indent: 0, tokens: [] },
  { indent: 1, tokens: [{ t: "keyword", v: "return " }, { t: "keyword", v: "await " }, { t: "fn", v: "ship" }, { t: "plain", v: "(stack);" }] },
  { indent: 0, tokens: [{ t: "plain",   v: "};"            }] },
];

const TOKEN_COLOR: Record<string, string> = {
  keyword: "text-violet-400",
  fn:      "text-sky-400",
  string:  "text-emerald-400",
  plain:   "text-slate-300",
};

// Pre-compute: char index at which each line becomes visible + total chars
const LINE_THRESHOLD: number[] = [];
let _cumChars = 0;
for (const line of CODE_LINES) {
  LINE_THRESHOLD.push(_cumChars);
  _cumChars += line.tokens.reduce((a, t) => a + t.v.length, 0);
}
const TOTAL_CHARS = _cumChars;

function CodeCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [blink, setBlink] = useState(true);
  const [revealed, setRevealed] = useState(0);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  // Typing animation - kicks in after a short settle delay
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      let chars = 0;
      intervalId = setInterval(() => {
        chars++;
        setRevealed(chars);
        if (chars >= TOTAL_CHARS) clearInterval(intervalId);
      }, 18);
    }, 450);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Mouse-tracking tilt - listens on the whole hero section
  useEffect(() => {
    const section = cardRef.current?.closest("section") as HTMLElement | null;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const { left, top, width, height } = section.getBoundingClientRect();
      const x = ((e.clientX - left) / width  - 0.5) * 2;
      const y = ((e.clientY - top)  / height - 0.5) * 2;
      card.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 6}deg)`;
    };
    const onLeave = () => {
      const card = cardRef.current;
      if (!card) return;
      card.style.transition = "transform 0.6s ease-out";
      card.style.transform  = "";
      setTimeout(() => { if (card) card.style.transition = ""; }, 650);
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Build visible lines - charBudget tracks how many chars are left to allocate
  let charBudget = revealed;
  const renderedLines = CODE_LINES.map((line, i) => {
    // Line 0 always rendered (cursor ready before typing starts).
    // Other lines appear only once typing has reached their threshold.
    const lineVisible = i === 0 || revealed > LINE_THRESHOLD[i];
    if (!lineVisible) return null;

    if (line.tokens.length === 0) {
      // Empty spacer line - no budget consumed
      return (
        <div key={i}><span>&nbsp;</span></div>
      );
    }

    const tokenEls = line.tokens.map((tok, j) => {
      const toShow = Math.max(0, Math.min(tok.v.length, charBudget));
      const visible = tok.v.slice(0, toShow);
      charBudget = Math.max(0, charBudget - tok.v.length);
      return visible
        ? <span key={j} className={TOKEN_COLOR[tok.t]}>{visible}</span>
        : null;
    });

    return (
      <div key={i} style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
        {tokenEls}
      </div>
    );
  });

  return (
    <div
      ref={cardRef}
      style={{ willChange: "transform" }}
      className="w-full max-w-sm rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden select-none"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-muted/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70"    />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70"  />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70"/>
        <span className="ml-3 font-mono text-[11px] text-muted-foreground/60">portfolio.ts</span>
      </div>

      {/* Code body */}
      <div className="px-5 py-4 font-mono text-[13px] leading-6 space-y-0.5 min-h-[268px]">
        {renderedLines}
        {/* Blinking cursor */}
        <div className="pl-4">
          <span
            className="inline-block w-[2px] h-[1em] bg-primary align-middle"
            style={{ opacity: blink ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 hero-dot-grid opacity-40 pointer-events-none" />

      {/* Right orb - parallax wrapper (scroll) + inner float animation */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.28}px)`, willChange: "transform" }}
      >
        <div
          className="w-full h-full rounded-full animate-float-orb"
          style={{ background: "radial-gradient(circle, hsl(170 60% 52% / 0.10) 0%, transparent 70%)" }}
        />
      </div>

      {/* Left orb - slightly slower parallax for depth layering */}
      <div
        className="absolute bottom-1/4 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.16}px)`, willChange: "transform" }}
      >
        <div
          className="w-full h-full rounded-full animate-float-orb-slow"
          style={{ background: "radial-gradient(circle, hsl(252 87% 68% / 0.06) 0%, transparent 70%)" }}
        />
      </div>

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

            {/* Stats strip */}
            <div className="flex flex-wrap gap-x-7 gap-y-2 mb-10 animate-fade-up"
                 style={{ animationDelay: "0.20s" }}>
              {STATS.map((s) => (
                <AnimatedStat key={s.label} display={s.display} label={s.label} />
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

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 animate-bounce">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase">Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1" y="1" width="14" height="22" rx="7" />
          <line x1="8" y1="6" x2="8" y2="10" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
