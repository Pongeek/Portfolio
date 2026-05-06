import { GraduationCap, Code2, Headphones, Shield, Laptop } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/components/FadeIn";
import type { ComponentType } from "react";

// ─── Timeline data ─────────────────────────────────────────────────────────────
interface TimelineItem {
  title: string;
  org: string;
  period: string;        // e.g. "2021 – Present" or "2023"
  type: "Education" | "Work" | "Projects";
  icon: ComponentType<{ className?: string }>;
  current?: boolean;
  description: string;
  tags: string[];
}

// NOTE: verify / update the period values below to match your actual dates.
const TIMELINE: TimelineItem[] = [
  {
    title: "B.Sc. Computer Science",
    org: "The Open University of Israel",
    period: "2021 – Present",
    type: "Education",
    icon: GraduationCap,
    current: true,
    description:
      "Built a strong foundation in programming, algorithms, data structures, databases, operating systems, probability, and software engineering. Developed the discipline to learn complex topics independently and apply them through hands-on practice.",
    tags: ["Algorithms", "Data Structures", "Databases", "Operating Systems", "Software Engineering"],
  },
  {
    title: "Java Full Stack Bootcamp",
    org: "John Bryce Training",
    period: "2022",
    type: "Education",
    icon: Code2,
    description:
      "Completed an intensive bootcamp focused on building real-world full stack applications. Main project: a coupon management system with three user roles (Admin, Company, Customer) - Java Spring backend, MySQL database, React and TypeScript frontend.",
    tags: ["Java", "Spring Boot", "React", "TypeScript", "MySQL", "REST APIs", "Redux"],
  },
  {
    title: "Technical Support Specialist",
    org: "Website & Application Support · Banking",
    period: "2020 – 2022",
    type: "Work",
    icon: Headphones,
    description:
      "Supported users and investigated technical issues for web applications and internal systems inside a bank - an environment where reliability and accuracy are non-negotiable. Gained first-hand experience with how production software behaves under real business pressure.",
    tags: ["Technical Support", "Incident Management", "Banking Systems", "Troubleshooting"],
  },
  {
    title: "Security Operations Center Analyst",
    org: "Cybersecurity · Banking Environment",
    period: "2022 – 2024",
    type: "Work",
    icon: Shield,
    description:
      "Monitored security alerts, investigated incidents, and followed operational security procedures in a banking environment. This role sharpened analytical thinking and attention to detail, and gave me a security-first perspective - thinking not only about how to build software, but how to make it safer.",
    tags: ["Cybersecurity", "SOC", "Incident Response", "Security Monitoring"],
  },
  {
    title: "Freelance & Personal Projects",
    org: "Full Stack Development",
    period: "2023 – Present",
    type: "Projects",
    icon: Laptop,
    current: true,
    description:
      "Building personal and freelance projects end-to-end: designing features, building APIs, working with databases, and shipping frontend interfaces. Each project represents my active transition from learning technologies to using them to build real products.",
    tags: ["React", "TypeScript", "Node.js", "Java Spring", "Next.js", "PostgreSQL"],
  },
];

// ─── Type badge colours ────────────────────────────────────────────────────────
const TYPE_CLASS: Record<TimelineItem["type"], string> = {
  Education: "bg-primary/10 text-primary border-primary/20",
  Work:      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Projects:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ExperienceSection() {
  return (
    <section id="experience" className="py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Heading */}
          <FadeIn>
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px flex-1 bg-border" />
              <h2 className="font-display text-4xl font-bold">My Journey</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="text-muted-foreground text-center leading-relaxed mb-16 max-w-2xl mx-auto">
              Computer Science studies gave me the foundation. A full stack bootcamp turned that into
              practical skills. Professional experience in banking - in both technical support and
              cybersecurity - taught me how software behaves in the real world. Now I'm focused on
              combining all of it to build things that matter.
            </p>
          </FadeIn>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical spine */}
            <div
              className="absolute left-5 top-6 bottom-6 w-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, hsl(var(--border)/0.6) 10%, hsl(var(--border)/0.6) 90%, transparent 100%)",
              }}
            />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => {
                const Icon = item.icon;
                return (
                  <FadeIn key={item.title} delay={i * 90}>
                    <div className="relative flex gap-5 md:gap-7">

                      {/* Icon node */}
                      <div className="relative z-10 flex-shrink-0 w-10 h-10 mt-1 rounded-full
                        bg-card border border-border/70 shadow-sm
                        flex items-center justify-center
                        ring-4 ring-background">
                        <Icon className="h-4 w-4 text-primary" />

                        {/* Pulsing "current" dot */}
                        {item.current && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          </span>
                        )}
                      </div>

                      {/* Content card */}
                      <div className="flex-1 min-w-0">
                        <div className="group p-5 rounded-xl bg-card border border-border/60
                          hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
                          transition-all duration-300">

                          {/* Header row */}
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div className="space-y-0.5">
                              <h3 className="font-display font-semibold text-base text-foreground leading-snug">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{item.org}</p>
                            </div>

                            {/* Type badge + period */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className={`text-[11px] font-mono px-2.5 py-0.5
                                rounded-full border ${TYPE_CLASS[item.type]}`}>
                                {item.type}
                              </span>
                              <span className="text-[11px] font-mono text-muted-foreground/70">
                                {item.period}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {item.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[11px] font-mono px-2 py-0.5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
