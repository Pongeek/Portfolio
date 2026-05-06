import FadeIn from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
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
        className="relative w-full rounded-2xl border border-primary/20 bg-card overflow-hidden
          shadow-xl shadow-primary/5 group mb-10"
        style={{ willChange: "transform" }}
      >
        {/* Featured badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full
            bg-card/90 backdrop-blur-sm border border-primary/30
            text-primary text-xs font-mono shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Featured Project
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Image - 3 / 5 columns on lg+ */}
          <div className="lg:col-span-3 aspect-video lg:aspect-auto min-h-[220px] overflow-hidden bg-muted relative">
            <BlurImage
              src={project.imageUrl || "/max-profile.png"}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.03] group-hover:duration-700"
              onError={(e) => { (e.target as HTMLImageElement).src = "/max-profile.png"; }}
            />
            {/* Live badge on featured image */}
            {hasLiveUrl && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5
                px-2.5 py-1 rounded-full
                bg-card/85 backdrop-blur-sm border border-emerald-500/30 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono font-medium text-emerald-400 leading-none">Live</span>
              </div>
            )}
            {/* Subtle gradient overlay on right edge for large screens */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-16
              bg-gradient-to-r from-transparent to-card/80 pointer-events-none" />
          </div>

          {/* Content - 2 / 5 columns on lg+ */}
          <div className="lg:col-span-2 flex flex-col justify-between p-7 gap-6">
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-foreground leading-snug">
                {project.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
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
