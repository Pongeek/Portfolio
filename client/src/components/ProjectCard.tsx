import { useState, useRef, useLayoutEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Globe, ChevronDown } from "lucide-react";
import type { Project } from "@db/schema";
import { useCardTilt } from "@/hooks/useCardTilt";
import BlurImage from "@/components/BlurImage";

type ProjectCardProps = {
  title: Project["title"];
  description: Project["description"];
  technologies: string[];
  imageUrl: Project["imageUrl"];
  liveUrl: Project["liveUrl"];
  githubUrl: Project["githubUrl"];
};

export default function ProjectCard({
  title,
  description,
  technologies,
  imageUrl,
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  const hasLiveDemo = Boolean(liveUrl && liveUrl.trim() !== "");
  const { ref, onMouseMove, onMouseLeave } = useCardTilt();

  // "Read more" expand state
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Detect whether the text is actually being cut off (only when collapsed)
  useLayoutEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [description]);

  return (
    // Tilt wrapper - transform is applied here so the card's own border/shadow animates too
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="h-full"
      style={{ willChange: "transform" }}
    >
      <Card className="group flex flex-col w-full h-full overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-[border-color,box-shadow] duration-300">
        {/* Image - 16:9 aspect ratio, zoom on hover, blur-up on load */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <BlurImage
            src={imageUrl || "/max-profile.png"}
            alt={`${title} screenshot`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 group-hover:duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/max-profile.png";
            }}
          />
          {/* Live badge - shown when the project has a live URL */}
          {hasLiveDemo && (
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5
              px-2.5 py-1 rounded-full
              bg-card/85 backdrop-blur-sm border border-emerald-500/30 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-medium text-emerald-400 leading-none">Live</span>
            </div>
          )}
        </div>

        {/* Title */}
        <CardHeader className="p-5 pb-2">
          <CardTitle className="font-display text-lg leading-snug">{title}</CardTitle>
        </CardHeader>

        {/* Description + tech badges */}
        <CardContent className="p-5 pt-0 flex-grow flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p
              ref={descRef}
              className={`text-sm text-muted-foreground leading-relaxed transition-all duration-300 ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {description}
            </p>
            {isClamped && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((x) => !x); }}
                className="flex items-center gap-0.5 self-start text-xs text-primary/70 hover:text-primary transition-colors"
                aria-expanded={expanded}
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {technologies?.map((tech, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-xs font-mono px-2 py-0.5"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="p-5 pt-0 gap-2">
          {hasLiveDemo && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={liveUrl!} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-3.5 w-3.5" />
                Live Demo
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className={hasLiveDemo ? "flex-1" : "w-full"}
            asChild
          >
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-3.5 w-3.5" />
              View Code
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
