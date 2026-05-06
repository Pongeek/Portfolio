import { Github, Linkedin, Mail, FileText, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 md:px-6 py-7">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 text-center md:text-left">

          {/* Left - copyright */}
          <p className="text-sm text-muted-foreground order-3 md:order-1">
            © {new Date().getFullYear()} Max Mullokandov
          </p>

          {/* Centre - built-by credit */}
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60 order-2">
            Designed &amp; built by Max Mullokandov
            <Heart className="h-3 w-3 text-primary/80 fill-primary/80 flex-shrink-0" />
          </p>

          {/* Right - social/contact icons */}
          <div className="flex items-center justify-center md:justify-end gap-1 order-1 md:order-3">
            <a
              href="https://github.com/Pongeek"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/maxim-mullokandov"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:MaximPim95@gmail.com"
              aria-label="Email"
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="/Max_Mullokandov_FullStack_Developer.pdf"
              download="Max_Mullokandov_CV.pdf"
              aria-label="Download CV"
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <FileText className="h-4 w-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
