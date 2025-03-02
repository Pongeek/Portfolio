import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../lib/api";
import SkillBar from "../components/SkillBar";
import type { Skill } from "@db/schema";

export default function SkillsPage() {
  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const categories: string[] = skills
    ? Array.from(new Set(skills.map((skill: Skill) => skill.category)))
    : [];

  const getCategoryDescription = (category: string) => {
    switch (category.toLowerCase()) {
      case 'backend':
        return 'Server-side technologies and frameworks I use to build robust and scalable applications.';
      case 'frontend':
        return 'Technologies I use to create responsive and interactive user interfaces.';
      case 'database':
        return 'Database systems I work with to manage and organize data effectively.';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-primary">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Technical Skills</h1>
        <p className="text-lg text-muted-foreground mb-12">
          My technical expertise spans across various domains of software development,
          with a focus on building modern web applications.
        </p>
        
        {categories.map((category: string) => (
          <div key={category} className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold capitalize text-primary">{category}</h2>
              <p className="text-muted-foreground mt-2">{getCategoryDescription(category)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills
                ?.filter((skill: Skill) => skill.category === category)
                .map((skill: Skill) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    category={skill.category}
                  />
                ))}
            </div>
          </div>
        ))}

        <div className="mt-16 p-8 bg-gradient-to-br from-muted to-muted/50 rounded-lg border border-border/50">
          <h3 className="text-xl font-semibold mb-4">Continuous Learning</h3>
          <p className="text-muted-foreground leading-relaxed">
            As a developer, I'm always learning and exploring new technologies.
            These skills represent my current expertise, but I'm constantly adding
            new tools and frameworks to my toolkit. I believe in staying current
            with industry trends and best practices.
          </p>
        </div>
      </div>
    </div>
  );
}
