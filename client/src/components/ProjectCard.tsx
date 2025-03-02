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

// This is a list of project titles that should not display a Live Demo button
// even if they have a liveUrl value
const projectsWithoutLiveDemo = ["Portfolio Website", "CoupCoupon"];

export default function ProjectCard({
  title,
  description,
  technologies,
  imageUrl,
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  // Only show the Live Demo button if:
  // 1. The project has a liveUrl AND
  // 2. The project is not in the list of projects without Live Demo
  const shouldShowLiveDemo = liveUrl && liveUrl.trim() !== "" && !projectsWithoutLiveDemo.includes(title);

  return (
    <Card className="flex flex-col h-[32rem] w-[24rem] overflow-hidden project-card animate-fade-up hover:scale-[1.02] transition-transform duration-300">
      <div className="h-60 overflow-hidden bg-muted">
        <img
          src={
            title.toLowerCase().includes('coupcoupon')
              ? '/Coupon.png'
              : title.toLowerCase().includes('portfolio')
                ? '/EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png'
                : (imageUrl || '/image.png')
          }
          className="w-full h-full object-cover object-center transition-transform hover:scale-105"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/image.png';
          }}
          alt={`${title} project screenshot`}
        />
      </div>

      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow overflow-hidden">
        <div className="h-24 overflow-y-auto mb-4 text-sm text-muted-foreground">
          <p>{description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {technologies?.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex w-full gap-2">
          {shouldShowLiveDemo && (
            <Button variant="outline" size="sm" className="flex-1 max-w-36" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" className={shouldShowLiveDemo ? "flex-1 max-w-36" : "w-full"} asChild>
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              View Code
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
