import FadeIn from "@/components/FadeIn";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

// Unified section header — eyebrow tag + heading + accent line + optional description.
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <FadeIn>
      <div
        className={`mb-14 ${isCenter ? "text-center" : "text-left"}`}
      >
        <div
          className={`flex items-center gap-3 mb-4 ${
            isCenter ? "justify-center" : "justify-start"
          }`}
        >
          <span className="h-px w-8 bg-primary/60" />
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-primary">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-primary/60" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-tight">
          {title}
        </h2>

        <div
          className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-primary/30 ${
            isCenter ? "mx-auto" : ""
          }`}
        />

        {description && (
          <p
            className={`mt-6 text-muted-foreground leading-relaxed ${
              isCenter ? "max-w-2xl mx-auto" : "max-w-2xl"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
