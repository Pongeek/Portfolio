import { useState } from "react";
import SkillBar from "@/components/SkillBar";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import type { Skill } from "@db/schema";

interface SkillsSectionProps {
  skills?: Skill[];
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function SkillTileSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-card border border-border/60">
      <Skeleton className="w-9 h-9 rounded-lg" />
      <Skeleton className="h-3 w-14 rounded" />
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tab bar skeleton */}
      <div className="flex items-center gap-2 justify-center mb-10">
        {[48, 88, 76, 96, 72, 80].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-full flex-shrink-0" style={{ width: `${w}px` }} />
        ))}
      </div>
      {/* Tile grid skeleton */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkillTileSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Ordered category display ─────────────────────────────────────────────────
const CATEGORY_ORDER = ["Frontend", "Backend", "Database", "Tools", "DevOps"];

function sortedCategories(skills: Skill[]) {
  const found = Array.from(new Set(skills.map((s) => s.category)));
  return [
    ...CATEGORY_ORDER.filter((c) => found.includes(c)),
    ...found.filter((c) => !CATEGORY_ORDER.includes(c)),
  ];
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [gridVisible, setGridVisible] = useState(true);

  const categories = skills ? sortedCategories(skills) : [];
  const tabs = skills ? ["All", ...categories] : [];

  const filteredSkills = !skills
    ? []
    : activeTab === "All"
    ? skills
    : skills.filter((s) => s.category === activeTab);

  const changeTab = (tab: string) => {
    if (tab === activeTab) return;
    // Fade out → swap content → fade in
    setGridVisible(false);
    setTimeout(() => {
      setActiveTab(tab);
      setGridVisible(true);
    }, 150);
  };

  return (
    <section id="skills" className="py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          <SectionHeader
            eyebrow="03 / Skills"
            title="Technical Skills"
            description="Technologies I work with regularly and have shipped to production."
          />

          {!skills ? (
            <SkillsSkeleton />
          ) : (
            <>
              {/* ── Filter tab bar ────────────────────────────────────────── */}
              <FadeIn delay={80}>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-10
                  justify-start md:justify-center
                  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {tabs.map((tab) => {
                    const count =
                      tab === "All"
                        ? skills.length
                        : skills.filter((s) => s.category === tab).length;
                    const active = activeTab === tab;

                    return (
                      <button
                        key={tab}
                        onClick={() => changeTab(tab)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
                          text-sm font-medium transition-all duration-200 focus-visible:outline-none
                          focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                          ${active
                            ? "bg-primary text-primary-foreground shadow-md scale-[1.04]"
                            : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        aria-pressed={active}
                      >
                        {tab}
                        <span
                          className={`min-w-[18px] text-center text-[10px] font-mono px-1.5 py-0.5 rounded-full
                            ${active
                              ? "bg-white/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FadeIn>

              {/* ── Skill grid with fade-swap on tab change ───────────────── */}
              <div
                style={{
                  opacity:    gridVisible ? 1 : 0,
                  transform:  gridVisible ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.15s ease, transform 0.15s ease",
                }}
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {filteredSkills.map((skill) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      category={skill.category}
                    />
                  ))}
                </div>

                {filteredSkills.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">
                    No skills in this category.
                  </p>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
