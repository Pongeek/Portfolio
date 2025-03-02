import { Github, Linkedin, Mail, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with React, Express, and PostgreSQL. © 2024
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/Pongeek"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/maxim-mullokandov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:contact@example.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="/Max Mullokandov CV.pdf"
            download
            className="text-muted-foreground hover:text-foreground"
          >
            <FileText className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
