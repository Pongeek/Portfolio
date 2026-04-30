/**
 * SectionDivider — a subtle teal glow line placed between page sections.
 * Renders a 1 px hairline that fades from transparent → primary/35 → transparent
 * plus a soft bloom blur underneath for depth.
 */
export default function SectionDivider() {
  return (
    <div className="relative h-px w-full overflow-visible" aria-hidden="true">
      {/* Hairline */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      {/* Bloom — wider, blurred layer for the glow effect */}
      <div className="absolute left-[15%] right-[15%] h-px bg-primary/20 blur-md" />
    </div>
  );
}
