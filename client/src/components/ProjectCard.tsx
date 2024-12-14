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
    <Card className="flex flex-col w-full max-w-sm mx-auto overflow-hidden project-card animate-fade-up hover:scale-[1.02] transition-transform duration-300">
      <div className="h-48 overflow-hidden bg-muted">
        <img
          src={imageUrl || '/image.png'}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/image.png';
          }}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <CardHeader className="flex-none">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="min-h-[3rem] text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 mt-auto pt-4">
          {liveUrl && (
            <Button variant="outline" size="sm" className="flex-1 max-w-36" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 max-w-36" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View Code
            </a>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
