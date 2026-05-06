import { useEffect, useRef, useState } from "react";

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

export default function CodeCard() {
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
