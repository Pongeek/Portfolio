import { useState, type ImgHTMLAttributes } from "react";

type BlurImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Optional override for the placeholder layer.
   * Defaults to a subtle theme-tinted blurred gradient.
   */
  placeholderClassName?: string;
};

/**
 * Drop-in <img> replacement that fades + sharpens on load.
 *
 *  ┌──────────────┐   ┌──────────────┐
 *  │ blurred grad │ → │ real image   │
 *  └──────────────┘   └──────────────┘
 *
 * The parent must define the box (e.g. `aspect-video`) - this component
 * fills 100% of it. No layout shift, no blank grey flash.
 */
export default function BlurImage({
  className = "",
  placeholderClassName = "",
  onLoad,
  onError,
  ...rest
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <>
      {/* Placeholder layer - visible until the real image reports onLoad */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-500
          ${loaded || errored ? "opacity-0" : "opacity-100"}
          ${placeholderClassName ||
            "bg-gradient-to-br from-muted via-card to-muted/60"}`}
        style={{
          // Soft, content-agnostic blurred shimmer - matches dark/light theme
          // via the Tailwind tokens above, then layered with a soft glow.
          backgroundImage: placeholderClassName
            ? undefined
            : "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.10) 0%, transparent 55%), radial-gradient(circle at 75% 70%, hsl(var(--primary) / 0.06) 0%, transparent 60%)",
          filter: "blur(8px)",
        }}
      />

      {/* Real image - starts blurred + transparent, sharpens on load */}
      <img
        {...rest}
        className={`transition-[opacity,filter,transform] duration-700 ease-out
          ${loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-[1.04]"}
          ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setErrored(true);
          onError?.(e);
        }}
      />
    </>
  );
}
