import ProjectCard from "@/components/ProjectCard";
import FadeIn from "@/components/FadeIn";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { useCardTilt } from "@/hooks/useCardTilt";
import type { Project } from "@db/schema";

interface ProjectsSectionProps {
  projects?: Project[];
}

// Skeleton that mirrors the layout of a single ProjectCard
function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col w-full rounded-xl border border-border/60 overflow-hidden bg-card">
      {/* 16:9 image area */}
      <Skeleton className="w-full aspect-video rounded-none" />

      {/* Title */}
      <div className="p-5 pb-2">
        <Skeleton className="h-5 w-3/4 rounded" />
      </div>

      {/* Description lines */}
      <div className="p-5 pt-2 flex-grow flex flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-2/3 rounded" />
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {[60, 80, 70, 55].map((w, i) => (
            <Skeleton key={i} className="h-5 rounded-full" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="p-5 pt-0">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  );
}

// Skeleton for the featured card
function FeaturedCardSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-border/60 overflow-hidden bg-card mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <Skeleton className="lg:col-span-3 aspect-video lg:aspect-auto min-h-[260px] rounded-none" />
        <div className="lg:col-span-2 p-7 flex flex-col gap-5">
          <div className="space-y-4">
            <Skeleton className="h-7 w-3/4 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[70, 90, 80, 60, 75, 55].map((w, i) => (
                <Skeleton key={i} className="h-5 rounded-full" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-auto">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Featured project card (full-width, used for the highlighted project) ─────
function FeaturedProjectCard({ project }: { project: Project }) {
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
          {/* Image — 3 / 5 columns on lg+ */}
          <div className="lg:col-span-3 aspect-video lg:aspect-auto min-h-[220px] overflow-hidden bg-muted relative">
            <img
              src={project.imageUrl || "/max-profile.png"}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
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

          {/* Content — 2 / 5 columns on lg+ */}
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

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Separate featured project (first one with a live URL) from the rest
  const featuredProject = projects?.find(
    (p) => p.liveUrl && p.liveUrl.trim() !== ""
  );
  const gridProjects = projects?.filter((p) => p !== featuredProject);

  return (
    <section id="projects" className="py-28 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="font-display text-4xl font-bold mb-4 text-center">My Projects</h2>
            <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
              A selection of things I've designed, built, and shipped.
            </p>
          </FadeIn>

          {/* Featured card (skeleton while loading) */}
          {!projects && <FeaturedCardSkeleton />}
          {featuredProject && (
            <FeaturedProjectCard project={featuredProject} />
          )}

          {/* Regular grid */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {!projects
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))
              : gridProjects?.map((project, i) => (
                  <FadeIn key={project.id} delay={i * 100}>
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      technologies={Array.isArray(project.technologies) ? project.technologies : []}
                      imageUrl={project.imageUrl}
                      liveUrl={project.liveUrl}
                      githubUrl={project.githubUrl}
                    />
                  </FadeIn>
                ))}
          </div>

          {projects?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No projects yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
