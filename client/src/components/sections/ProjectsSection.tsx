import ProjectCard from "@/components/ProjectCard";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
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
          <SectionHeader
            eyebrow="04 / Work"
            title="My Projects"
            description="A selection of things I've designed, built, and shipped."
          />

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
