import { useQuery } from "@tanstack/react-query";
import { fetchSkills, fetchProjects } from "@/lib/api";
import type { Skill, Project } from "@db/schema";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SectionDivider from "@/components/SectionDivider";

export default function HomePage() {
  const { data: skills } = useQuery<Skill[]>({ queryKey: ["skills"], queryFn: fetchSkills });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["projects"], queryFn: fetchProjects });

  return (
    <>
      <HeroSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <ExperienceSection />
      <SectionDivider />
      <SkillsSection skills={skills} />
      <SectionDivider />
      <ProjectsSection projects={projects} />
      <SectionDivider />
      <ContactSection />
    </>
  );
}
