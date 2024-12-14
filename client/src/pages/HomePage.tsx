import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProfile, fetchSkills, fetchProjects, submitContact } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Project, type Skill, type Message } from "@db/schema";
import { Github, Linkedin, Mail, ArrowRight, Code, Terminal, Braces, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { type Profile } from "@db/schema";
import Typewriter from "typewriter-effect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@db/schema";
import { useToast } from "@/hooks/use-toast";
import ProjectCard from "../components/ProjectCard";
import SkillBar from "../components/SkillBar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function HomePage() {
  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  type SocialLinks = {
    github?: string;
    linkedin?: string;
    email?: string;
  };

  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { toast } = useToast();
  const [matrixBg, setMatrixBg] = useState<string[]>([]);

  useEffect(() => {
    const generateMatrixBg = () => {
      const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01";
      const arr = new Array(50).fill(0).map(() => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      setMatrixBg(arr);
    };
    generateMatrixBg();
    const interval = setInterval(generateMatrixBg, 2000);
    return () => clearInterval(interval);
  }, []);

  // Remove project search state as it's no longer needed

  const contactForm = useForm({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      contactForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Projects are now displayed without filtering

  const categories: string[] = skills
    ? Array.from(new Set(skills.map((skill: Skill) => skill.category)))
    : [];

  if (profileLoading || skillsLoading || projectsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-black/90">
          <div className="matrix-bg opacity-20">
            {matrixBg.map((char, i) => (
              <span 
                key={i}
                className="matrix-char"
                style={{
                  left: `${(i % 10) * 10}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  color: `hsl(${Math.random() * 60 + 120}, 100%, 50%)`
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="container mx-auto relative h-full flex items-center justify-center">
          <div className="max-w-2xl text-white font-mono text-center">
            <div className="terminal-header mb-3 flex items-center justify-center gap-2">
              <Terminal className="h-5 w-5" />
              <span className="text-sm opacity-70">portfolio.tsx</span>
            </div>
            <h1 className="text-5xl font-bold mb-2 text-primary relative">
              <div className="relative h-[60px] flex items-center justify-center">
                <Code className="absolute -left-8 top-1/2 -translate-y-1/2 h-6 w-6 opacity-70" />
                <span className="inline-block min-w-[300px]">
                  <Typewriter
                    options={{
                      strings: ['Max Mullokandov'],
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 50,
                      cursor: '|'
                    }}
                  />
                </span>
                <Braces className="absolute -right-8 top-1/2 -translate-y-1/2 h-6 w-6 opacity-70" />
              </div>
            </h1>
            <div className="text-2xl mb-4 text-primary/80">
              <div className="h-[40px] flex items-center justify-center">
                <span className="inline-block min-w-[200px]">
                  <Typewriter
                    options={{
                      strings: ['Full Stack Developer'],
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 50,
                      cursor: '_'
                    }}
                  />
                </span>
              </div>
              <div className="flex flex-col items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <a href="/Max Mullokandov CV.pdf" download className="hover:text-primary transition-colors">
                    Download Resume
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" size="icon">
                    <a
                      href="https://github.com/Pongeek"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="icon">
                    <a
                      href="https://www.linkedin.com/in/maxim-mullokandov/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="icon">
                    <a href="mailto:MaximPim95@gmail.com">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="icon">
                    <a href="/Max Mullokandov CV.pdf" download>
                      <FileText className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">About Me</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Hi there! I'm Max Mullokandov, a dedicated Full Stack Developer with a strong foundation in Computer Science from The Open University of Israel. My journey in software development has equipped me with expertise in both Java and ReactJS, allowing me to build seamless, end-to-end solutions. I thrive on creating intuitive user experiences while ensuring robust backend functionality. As a developer, I combine my academic knowledge with hands-on experience to deliver impactful solutions that make a difference. I'm particularly passionate about clean code, modern web technologies, and creating applications that solve real-world problems.
              </p>
            </div>
            <Card className="p-0 bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-full aspect-square w-64 mx-auto">
              <img
                src="/EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png"
                alt="Profile Photo"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
              />
            </Card>
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-fit"
            >
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      

      {/* Skills Section */}
      <section id="skills" className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Technical Skills</h2>
          {categories.map((category: string) => (
            <div key={category} className="mb-16 max-w-6xl mx-auto">
              <h3 className="text-2xl font-semibold mb-8 capitalize text-center">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">My Projects</h2>

            <div className="grid gap-8 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects?.map((project: Project) => (
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

            {projects?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No projects available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-10">
              Feel free to reach out directly at{" "}
              <a 
                href="mailto:MaximPim95@gmail.com" 
                className="text-primary hover:underline"
              >
                MaximPim95@gmail.com
              </a>
              {" "}or use the form below.
            </p>
            
            <Card className="p-6">
              <Form {...contactForm}>
                <form
                  onSubmit={contactForm.handleSubmit((data) => contactMutation.mutate(data))}
                  className="space-y-6 text-left"
                >
                  <FormField
                    control={contactForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="text-left">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contactForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="text-left">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="text-left">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message here..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
