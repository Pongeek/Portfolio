import FadeIn from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Sparkles } from "lucide-react";
import { useCardTilt } from "@/hooks/useCardTilt";
import BlurImage from "@/components/BlurImage";
import type { Project } from "@db/schema";

// ─── Featured project card (full-width, used for the highlighted project) ─────
export default function FeaturedProjectCard({ project }: { project: Project }) {
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const hasLiveUrl   = Boolean(project.liveUrl && project.liveUrl.trim() !== "");
  const { ref, onMouseMove, onMouseLeave } = useCardTilt();

  return (
    <FadeIn>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative w-full rounded-2xl border border-primary/25 bg-card overflow-hidden
          shadow-xl shadow-primary/10 group mb-10"
        style={{ willChange: "transform" }}
      >
        {/* Outer glow ring on hover */}
        <div className="absolute -inset-px rounded-2xl pointer-events-none
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
          [background:linear-gradient(120deg,hsl(var(--primary)/0.25),transparent_30%,hsl(var(--primary)/0.25))]
          [mask:linear-gradient(#000,transparent)]" />

        {/* Featured badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full
            bg-card/95 backdrop-blur-sm border border-primary/30
            text-primary text-xs font-mono shadow-sm">
            <Sparkles className="h-3 w-3" />
            Featured Project
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Image - 3 / 5 columns on lg+ */}
          <div className="lg:col-span-3 aspect-video lg:aspect-auto min-h-[260px] overflow-hidden bg-muted relative">
            <BlurImage
              src={project.imageUrl || "/max-profile.png"}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top
                transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              onError={(e) => { (e.target as HTMLImageElement).src = "/max-profile.png"; }}
            />

            {/* Color overlay - tints the screenshot toward the brand palette */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply
                opacity-50 group-hover:opacity-25 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary)/0.55) 0%, hsl(var(--background)/0.65) 70%)",
              }}
            />

            {/* Vignette - darkens edges, helps the foreground text contrast */}
            <div className="absolute inset-0 pointer-events-none
              bg-[radial-gradient(ellipse_at_center,transparent_50%,hsl(var(--background)/0.6)_120%)]" />

            {/* Dot-grid pattern - subtle premium texture */}
            <div className="absolute inset-0 hero-dot-grid opacity-20 mix-blend-overlay pointer-events-none" />

            {/* Gradient bleed into content column (desktop) */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-24
              bg-gradient-to-r from-transparent to-card pointer-events-none" />
            {/* Mobile gradient bleed at bottom */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-20
              bg-gradient-to-b from-transparent to-card pointer-events-none" />

            {/* Live badge on featured image */}
            {hasLiveUrl && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5
                px-2.5 py-1 rounded-full
                bg-card/90 backdrop-blur-sm border border-emerald-500/30 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono font-medium text-emerald-400 leading-none">Live</span>
              </div>
            )}

            {/* Title overlay on the banner */}
            <div className="absolute left-5 bottom-5 right-5 lg:right-24 z-10 pointer-events-none">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight drop-shadow-md">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Content - 2 / 5 columns on lg+ */}
          <div className="lg:col-span-2 flex flex-col justify-between p-7 gap-6">
            <div className="space-y-4">
              {/* Small section eyebrow inside content column */}
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                Case study
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono px-2 py-0.5">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {hasLiveUrl && (
                <Button className="flex-1 min-w-[120px] gap-2" asChild>
                  <a href={project.liveUrl!} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              <Button variant="outline" className="flex-1 min-w-[120px] gap-2" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  View Code
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
