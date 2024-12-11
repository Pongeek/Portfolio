import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Globe } from "lucide-react";

import type { Project } from "@db/schema";

type ProjectCardProps = {
  title: Project["title"];
  description: Project["description"];
  technologies: string[];
  imageUrl: Project["imageUrl"];
  liveUrl: Project["liveUrl"];
  githubUrl: Project["githubUrl"];
}

export default function ProjectCard({
  title,
  description,
  technologies,
  imageUrl,
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden project-card animate-fade-up hover:scale-[1.02] transition-transform duration-300">
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/image.png'; // Fallback to the new image
            }}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {liveUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            View Code
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
