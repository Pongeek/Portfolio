import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { Project } from "@db/schema";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const [search, setSearch] = useState("");

  const filteredProjects = projects?.filter((project: Project) =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    (Array.isArray(project.technologies) ? project.technologies : []).some((tech: string) =>
      tech.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12 text-center">My Projects</h1>

      <div className="w-full max-w-3xl mb-12">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by title or technology..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSearch("")}
            className="shrink-0"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full justify-center">
        {filteredProjects?.map((project: Project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            technologies={Array.isArray(project.technologies) ? project.technologies : []}
            imageUrl={project.imageUrl}
            liveUrl={project.liveUrl}
            githubUrl={project.githubUrl}
          />
        ))}
      </div>

      {filteredProjects?.length === 0 && (
        <div className="w-full text-center py-12">
          <p className="text-muted-foreground">
            No projects found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
