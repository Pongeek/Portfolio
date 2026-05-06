import { useInView } from "@/hooks/use-in-view";
import type { ReactNode, CSSProperties } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the transition starts - use for staggered children */
  delay?: number;
  /** Direction to slide from */
  from?: "bottom" | "left" | "right" | "none";
}

const TRANSLATE: Record<NonNullable<FadeInProps["from"]>, string> = {
  bottom: "translateY(24px)",
  left:   "translateX(-24px)",
  right:  "translateX(24px)",
  none:   "none",
};

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  from = "bottom",
}: FadeInProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const style: CSSProperties = {
    opacity:    inView ? 1 : 0,
    transform:  inView ? "none" : TRANSLATE[from],
    transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
