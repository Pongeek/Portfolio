/**
 * Optional case-study overlays for projects, keyed by project title.
 *
 * Each entry is rendered inside the project detail modal alongside the data
 * from the database. Anything missing from the database (problem / approach /
 * result, role, year, extra screenshots) can be filled in here without
 * requiring a schema change.
 *
 * To extend: add a new entry whose key matches the project's `title` exactly.
 */

export interface CaseStudy {
  /** Role you played on the project (e.g. "Solo developer", "Tech lead"). */
  role?: string;
  /** Year / timeframe. */
  year?: string;
  /** Short tagline shown under the title in the modal. */
  tagline?: string;
  /** 1–3 sentences describing the problem you set out to solve. */
  problem?: string;
  /** Bullets describing how you approached the build. */
  approach?: string[];
  /** Bullets describing the outcome / impact. */
  result?: string[];
  /**
   * Extra screenshots beyond the cover image. Paths are resolved from the
   * site root, just like `Project.imageUrl`.
   */
  gallery?: { src: string; alt: string }[];
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  TileTech: {
    role: "Solo developer",
    year: "2026 – in progress",
    tagline: "Bilingual marketing site for a renovation business in central Israel — currently under active development.",
    problem:
      "A family-run tiling business has no online presence and is losing leads to competitors. They need a bilingual Hebrew/English site that ranks locally and feels fast on mobile.",
    approach: [
      "Next.js 14 App Router with statically rendered marketing pages for instant first paint.",
      "Custom RTL/LTR layout primitives so the same components work in both languages without duplication.",
      "Local-SEO foundation with JSON-LD structured data, automatic sitemap generation, and OpenGraph tags.",
      "Image pipeline that converts to AVIF/WebP at build time and serves responsive sizes via next/image.",
      "Rate-limited, server-validated contact form deployed as a Vercel serverless function.",
    ],
    result: [
      "Currently deployed to a Vercel preview URL while content and bilingual flows are being finalised.",
      "Performance and accessibility already passing Lighthouse audits in the 95+ range.",
      "Active build — final design pass, content polish, and a custom domain still ahead of public launch.",
    ],
  },

  "Portfolio Website": {
    role: "Solo developer & designer",
    year: "2024 – present",
    tagline: "The site you're on. A full-stack proof point, not just a list of links.",
    problem:
      "Most developer portfolios are static résumés. I wanted this one to also serve as evidence — real React patterns, real backend, real attention to detail.",
    approach: [
      "React 18 + TypeScript on the front, Express + Drizzle ORM + Postgres on the back, deployed serverlessly to Vercel.",
      "Theme system with zero-flash dark/light using a pre-hydration inline script.",
      "Section-level fade-ins, animated stat counters, GitHub activity card pulling live data via TanStack Query.",
      "Server-validated, rate-limited contact form with Zod schemas shared between client and API.",
      "Custom hover, cursor, and gradient-mesh treatments scoped to the Hero — restrained, not loud.",
    ],
    result: [
      "Passes Lighthouse accessibility / performance checks.",
      "CV download served directly from the origin — no CDN drift between deploys.",
      "Every interaction in this modal was hand-rolled.",
    ],
  },

  CoupCoupon: {
    role: "Full-stack engineer",
    year: "2024",
    tagline: "Role-based coupon platform: Admin, Company, and Customer dashboards.",
    problem:
      "Build a non-trivial full-stack system that proves clean separation of concerns between a typed API and a React client.",
    approach: [
      "Java Spring Boot REST API secured with JWT and method-level authorization.",
      "Domain modeled around three roles (Admin, Company, Customer), each with their own controllers, services, and DTOs.",
      "Normalized MySQL schema with Hibernate / JPA mappings and explicit transactional boundaries.",
      "React + TypeScript client with role-aware routing and per-role dashboards.",
    ],
    result: [
      "Three distinct, working user flows behind one authenticated API.",
      "Clean separation between persistence, service, and HTTP layers — easy to extend.",
    ],
  },

  "Billiard Game - Squeak Smalltalk": {
    role: "Solo developer",
    year: "Coursework",
    tagline: "Real-time billiard physics, written end-to-end in Smalltalk.",
    problem:
      "Build a non-trivial object-oriented application from scratch in pure Squeak Smalltalk — no engine, no libraries.",
    approach: [
      "Modeled balls, cushions, and the cue as first-class Smalltalk objects, each owning their own behavior.",
      "Implemented elastic-collision physics analytically — no library, just vector math.",
      "Kept the physics engine fully decoupled from the rendering layer so behavior could be tested in isolation.",
      "Mouse-driven trajectory aiming with a preview line.",
    ],
    result: [
      "Playable billiard game with realistic ball interactions.",
      "Clean OO design that demonstrates message-passing and encapsulation idiomatically.",
    ],
  },
};
