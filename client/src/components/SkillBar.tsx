import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiSpring,
  SiPython,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiGithub,
  SiAmazon,
  SiLinux,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Code2, Globe, Key } from "lucide-react";
import type { IconType } from "react-icons";

interface SkillBarProps {
  name: string;
  category: string;
}

// Map lowercase skill names → react-icons component
const TECH_ICONS: Record<string, IconType | React.ComponentType<{ className?: string }>> = {
  react:              SiReact,
  typescript:         SiTypescript,
  javascript:         SiJavascript,
  "tailwind css":     SiTailwindcss,
  "html/css":         SiHtml5,
  "node.js":          SiNodedotjs,
  java:               FaJava,
  "spring boot":      SiSpring,
  python:             SiPython,
  mysql:              SiMysql,
  postgresql:         SiPostgresql,
  mongodb:            SiMongodb,
  docker:             SiDocker,
  git:                SiGit,
  github:             SiGithub,
  "restful api":      Globe,
  jwt:                Key,
  aws:                SiAmazon,
  linux:              SiLinux,
};

export default function SkillBar({ name }: SkillBarProps) {
  const IconComponent = TECH_ICONS[name.toLowerCase()];

  return (
    <div className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-card border border-border/60 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default select-none">
      <div className="text-4xl text-muted-foreground/70 group-hover:text-primary transition-colors duration-300">
        {IconComponent ? (
          // react-icons and lucide both accept className
          <IconComponent className="w-9 h-9" />
        ) : (
          <Code2 className="w-9 h-9" />
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center leading-tight">
        {name}
      </span>
    </div>
  );
}
