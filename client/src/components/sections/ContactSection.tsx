import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { submitContact } from "@/lib/api";
import { z } from "zod";
import { Copy, Check, Github } from "lucide-react";
import { SiLinkedin } from "react-icons/si";

const EMAIL = "MaximPim95@gmail.com";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Maximum 1000 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast({ title: "Email copied!", description: EMAIL });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available - mailto fallback is still there
    }
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      toast({ title: "Message sent!", description: "I'll get back to you soon." });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <section id="contact" className="py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            eyebrow="05 / Contact"
            title="Get in Touch"
            description="Open to new opportunities, collaborations, or just a conversation."
          />

          <FadeIn>
            <p className="text-center mb-8">
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium group"
                title="Click to copy"
              >
                {EMAIL}
                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                  {copied
                    ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                    : <Copy className="h-3.5 w-3.5" />
                  }
                </span>
              </button>
            </p>

            {/* Social links - quick one-click alternatives to the form */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <a
                href="https://github.com/Pongeek"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                  border border-border/60 bg-card text-sm font-medium text-muted-foreground
                  hover:border-primary/40 hover:text-foreground hover:shadow-md hover:shadow-primary/5
                  transition-all duration-200"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/maxim-mullokandov/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                  border border-border/60 bg-card text-sm font-medium text-muted-foreground
                  hover:border-primary/40 hover:text-foreground hover:shadow-md hover:shadow-primary/5
                  transition-all duration-200"
              >
                <SiLinkedin className="h-4 w-4 text-[#0A66C2]" />
                LinkedIn
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
          <Card className="p-6 bg-card border-border">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                className="space-y-5"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Your message..."
                            className="min-h-[140px] resize-none"
                            {...field}
                          />
                          <div
                            className={`text-xs mt-1 text-right ${
                              (field.value?.length ?? 0) > 950
                                ? "text-destructive"
                                : (field.value?.length ?? 0) > 850
                                ? "text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {field.value?.length ?? 0}/1000
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
