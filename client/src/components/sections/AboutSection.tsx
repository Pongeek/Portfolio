import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { scrollToSection } from "@/lib/scroll";

export default function AboutSection() {
  return (
    <section id="about" className="py-28 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <FadeIn>
            <div className="flex items-center gap-4 mb-20">
              <span className="h-px flex-1 bg-border" />
              <h2 className="font-display text-4xl font-bold">About Me</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <FadeIn className="flex justify-center" from="left">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
                </div>

                {/* Dot corners */}
                <div className="absolute -top-4 -left-4 w-24 h-24 hero-dot-grid opacity-25 pointer-events-none" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 hero-dot-grid opacity-25 pointer-events-none" />

                {/* Photo frame */}
                <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden
                  ring-2 ring-primary/25 ring-offset-4 ring-offset-background
                  shadow-2xl shadow-primary/10">
                  <img
                    src="/max-profile.png"
                    alt="Max Mullokandov"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                {/* Open to work pill */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20
                  flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-card/90 backdrop-blur-sm border border-border shadow-lg
                  text-xs font-mono whitespace-nowrap">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-foreground/80">Open to work</span>
                </div>

                {/* Location pill */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20
                  flex items-center gap-1.5 px-4 py-1.5 rounded-full
                  bg-card/90 backdrop-blur-sm border border-border shadow-lg
                  text-xs font-mono whitespace-nowrap text-muted-foreground">
                  <MapPin className="h-3 w-3 text-primary" />
                  Israel
                </div>
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn from="right" delay={120}>
              <div className="space-y-5">
                <p className="text-foreground/90 text-lg leading-relaxed">
                  I'm Max, a Full Stack Developer based in Israel. I got into web development
                  because I liked the idea that one person could build something complete from
                  scratch. That still drives me.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Most of my work sits across React and TypeScript on the frontend, Java Spring
                  and Node.js on the backend, and SQL databases underneath. I enjoy working
                  across the whole stack rather than staying in one corner of it.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  I care about writing code that is easy to read six months later. Good
                  architecture matters to me, but so does actually shipping things.
                </p>

                {/* Education */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/60
                  hover:border-primary/30 transition-colors duration-300">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">B.Sc. Computer Science</p>
                    <p className="text-muted-foreground text-sm">The Open University of Israel</p>
                  </div>
                </div>

                <Button onClick={() => scrollToSection("contact")} className="gap-2 w-full sm:w-auto">
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </FadeIn>

          </div>
        </div>
      </div>
    </section>
  );
}
