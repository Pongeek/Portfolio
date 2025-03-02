import { Code2, Database, Layout } from "lucide-react";

interface SkillBarProps {
  name: string;
  category: string;
}

export default function SkillBar({ name, category }: SkillBarProps) {
  const getIcon = () => {
    switch (category.toLowerCase()) {
      case 'backend':
        return <Code2 className="h-5 w-5 text-primary/70" />;
      case 'frontend':
        return <Layout className="h-5 w-5 text-primary/70" />;
      case 'database':
        return <Database className="h-5 w-5 text-primary/70" />;
      default:
        return <Code2 className="h-5 w-5 text-primary/70" />;
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-card to-card/90 hover:from-accent/5 hover:to-accent/10 border border-border/50 transition-all duration-300 p-4 shadow-sm hover:shadow-md animate-fade-up opacity-0 hover:scale-[1.02]">
      <div className="relative z-10 flex items-center gap-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="h-0.5 w-24 bg-primary/20 group-hover:bg-primary group-hover:w-full transition-all duration-500 ease-in-out rounded-full mt-2 animate-slide-right" />
        </div>
      </div>
    </div>
  );
}
