import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Globe,
  Calendar,
  User,
  Target,
  Wrench,
  Sparkles,
} from "lucide-react";
import BlurImage from "@/components/BlurImage";
import type { Project } from "@db/schema";
import { CASE_STUDIES, type CaseStudy } from "@/lib/caseStudies";

interface ProjectDetailDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Heading row used for Problem / Approach / Result sections. */
function SectionHead({
  icon: Icon,
  label,
}: {
  icon: typeof Target;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary">
        {label}
      </h4>
    </div>
  );
}

/** Meta pill (role / year). */
function MetaPill({
  icon: Icon,
  children,
}: {
  icon: typeof Calendar;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
      bg-card border border-border/60 text-[11px] font-mono text-muted-foreground">
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

export default function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
}: ProjectDetailDialogProps) {
  const study: CaseStudy = CASE_STUDIES[project.title] ?? {};
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl.trim() !== "");

  const gallery = [
    { src: project.imageUrl || "/max-profile.png", alt: `${project.title} cover` },
    ...(study.gallery ?? []),
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = gallery[activeIdx] ?? gallery[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl w-[calc(100vw-2rem)] p-0 overflow-hidden
          max-h-[90vh] grid grid-rows-[auto_1fr] rounded-2xl border-border/60"
      >
        {/* Hero / cover image */}
        <div className="relative aspect-[16/8] bg-muted overflow-hidden">
          <BlurImage
            key={active.src}
            src={active.src}
            alt={active.alt}
            className="absolute inset-0 w-full h-full object-cover object-top
              animate-in fade-in duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/max-profile.png";
            }}
          />
          {/* Brand tint + bottom fade for legibility */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)/0.55) 0%, hsl(var(--background)/0.6) 70%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t
            from-background via-background/70 to-transparent pointer-events-none" />

          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 pointer-events-none">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-2 drop-shadow">
              Case study
            </p>
            <DialogTitle className="font-display text-2xl md:text-3xl font-bold
              text-foreground drop-shadow leading-tight">
              {project.title}
            </DialogTitle>
            {study.tagline ? (
              <DialogDescription className="mt-2 text-sm md:text-base text-foreground/85 drop-shadow max-w-2xl">
                {study.tagline}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                {`Case study for ${project.title}.`}
              </DialogDescription>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 md:px-8 pb-8 pt-6 space-y-7">
          {/* Meta row */}
          {(study.role || study.year) && (
            <div className="flex flex-wrap gap-2">
              {study.role && <MetaPill icon={User}>{study.role}</MetaPill>}
              {study.year && <MetaPill icon={Calendar}>{study.year}</MetaPill>}
            </div>
          )}

          {/* Overview (always shown — uses project description) */}
          <section>
            <SectionHead icon={Sparkles} label="Overview" />
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </section>

          {/* Problem */}
          {study.problem && (
            <section>
              <SectionHead icon={Target} label="Problem" />
              <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                {study.problem}
              </p>
            </section>
          )}

          {/* Approach */}
          {study.approach && study.approach.length > 0 && (
            <section>
              <SectionHead icon={Wrench} label="Approach" />
              <ul className="space-y-2.5">
                {study.approach.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/70" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Result */}
          {study.result && study.result.length > 0 && (
            <section>
              <SectionHead icon={Sparkles} label="Result" />
              <ul className="space-y-2.5">
                {study.result.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tech stack */}
          {technologies.length > 0 && (
            <section>
              <SectionHead icon={Wrench} label="Tech stack" />
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs font-mono px-2 py-0.5">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Gallery thumbnails (only if there's more than one image) */}
          {gallery.length > 1 && (
            <section>
              <SectionHead icon={Sparkles} label="Gallery" />
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {gallery.map((shot, i) => (
                  <button
                    key={shot.src + i}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    aria-pressed={i === activeIdx}
                    className={`relative aspect-video overflow-hidden rounded-md border
                      transition-all duration-200
                      ${
                        i === activeIdx
                          ? "border-primary ring-2 ring-primary/40"
                          : "border-border/60 hover:border-primary/40 opacity-80 hover:opacity-100"
                      }`}
                  >
                    <BlurImage
                      src={shot.src}
                      alt={shot.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2 sticky bottom-0 -mx-6 md:-mx-8
            px-6 md:px-8 py-4
            bg-gradient-to-t from-background via-background to-background/95
            border-t border-border/60">
            {hasLiveUrl && (
              <Button className="gap-2" asChild>
                <a href={project.liveUrl!} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                  Visit live site
                </a>
              </Button>
            )}
            <Button variant="outline" className="gap-2" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                View source
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
