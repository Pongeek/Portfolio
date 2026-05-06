import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import { Menu, X } from "lucide-react";

const links = [
  { id: "about",      label: "About"      },
  { id: "experience", label: "Experience" },
  { id: "skills",     label: "Skills"     },
  { id: "projects",   label: "Projects"   },
  { id: "contact",    label: "Contact"    },
];

function scrollToSection(id: string, closeMobile?: () => void) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "smooth" });
  closeMobile?.();
}

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);

  // Sliding pill state
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  // Reposition pill whenever the active section changes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLElement>(`[data-section="${activeSection}"]`);
    if (!btn) {
      setPill((p) => ({ ...p, opacity: 0 }));
      return;
    }
    setPill({ left: btn.offsetLeft, width: btn.offsetWidth, opacity: 1 });
  }, [activeSection]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", "about", "experience", "skills", "projects", "contact"];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home", close)}
            className="font-display font-bold text-lg text-foreground hover:text-primary transition-colors tracking-tight"
          >
            Max<span className="text-primary">.</span>
          </button>

          {/* Desktop nav - sliding pill indicator */}
          <nav ref={navRef} className="hidden md:flex items-center gap-1 relative">
            {/* Sliding background pill */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 h-8 rounded-md bg-primary/10 pointer-events-none"
              style={{
                left:    pill.left,
                width:   pill.width,
                opacity: pill.opacity,
                transition: "left 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s",
              }}
            />
            {links.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                size="sm"
                data-section={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-4 text-sm font-medium transition-colors z-10 ${
                  activeSection === link.id
                    ? "text-primary hover:text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                }`}
              >
                {link.label}
              </Button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Hamburger - mobile only */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu - slides down */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-4 pb-4 pt-1 gap-1 border-t border-border/50">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id, close)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
