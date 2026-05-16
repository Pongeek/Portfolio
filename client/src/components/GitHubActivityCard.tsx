import { useQuery } from "@tanstack/react-query";
import { Github, GitCommit, ArrowUpRight, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const GITHUB_USERNAME = "Pongeek";
const PROFILE_URL     = `https://github.com/${GITHUB_USERNAME}`;

type GitHubUser = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

/**
 * GitHub's public events API used to embed the full `commits` array inside
 * each PushEvent payload. It no longer does — the payload only carries the
 * head/before SHAs. So we read `head` and then fetch the commit details
 * separately to get the actual message.
 */
type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { head?: string; before?: string; ref?: string };
};

type RecentCommit = {
  id: string;
  sha: string;
  message: string;
  repo: string;
  createdAt: string;
  url: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60)            return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60)            return `${min}m ago`;
  const hr  = Math.floor(min / 60);
  if (hr  < 24)            return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7)             return `${day}d ago`;
  const wk  = Math.floor(day / 7);
  if (wk  < 5)             return `${wk}w ago`;
  const mo  = Math.floor(day / 30);
  if (mo  < 12)            return `${mo}mo ago`;
  const yr  = Math.floor(day / 365);
  return `${yr}y ago`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function GitHubActivityCard() {
  const userQuery = useQuery<GitHubUser>({
    queryKey: ["github-user", GITHUB_USERNAME],
    queryFn:  () => fetchJson(`https://api.github.com/users/${GITHUB_USERNAME}`),
    staleTime: 1000 * 60 * 30, // 30 min
    retry: 1,
  });

  const commitsQuery = useQuery<RecentCommit[]>({
    queryKey: ["github-recent-commits", GITHUB_USERNAME],
    queryFn: async () => {
      const events = await fetchJson<GitHubEvent[]>(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`
      );

      // Keep PushEvents with a head SHA, dedupe by SHA (a force-push and a
      // follow-up push can share the same head), take the 3 most recent.
      const seen = new Set<string>();
      const recentPushes = events
        .filter((e) => e.type === "PushEvent" && Boolean(e.payload?.head))
        .filter((e) => {
          const sha = e.payload.head!;
          if (seen.has(sha)) return false;
          seen.add(sha);
          return true;
        })
        .slice(0, 3);

      // Look up the actual commit messages in parallel.
      return Promise.all(
        recentPushes.map(async (event): Promise<RecentCommit> => {
          const sha     = event.payload.head!;
          const repoFull = event.repo.name;
          const repoShort = repoFull.split("/").pop() ?? repoFull;
          try {
            const commit = await fetchJson<{
              commit: { message: string };
              html_url: string;
            }>(`https://api.github.com/repos/${repoFull}/commits/${sha}`);
            return {
              id:        event.id,
              sha,
              message:   commit.commit.message.split("\n")[0],
              repo:      repoShort,
              createdAt: event.created_at,
              url:       commit.html_url,
            };
          } catch {
            return {
              id:        event.id,
              sha,
              message:   `Pushed ${sha.slice(0, 7)}`,
              repo:      repoShort,
              createdAt: event.created_at,
              url:       `https://github.com/${repoFull}/commit/${sha}`,
            };
          }
        })
      );
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const isLoading = userQuery.isLoading || commitsQuery.isLoading;
  const hasError  = userQuery.isError && commitsQuery.isError;
  const recentCommits = commitsQuery.data ?? [];

  return (
    <a
      href={PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 rounded-xl bg-card border border-border/70
        hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5
        transition-all duration-300"
      aria-label="View GitHub profile"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Github className="h-4.5 w-4.5 text-primary" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold text-foreground">
              GitHub Activity
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              @{GITHUB_USERNAME}
            </span>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary
          group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>

      {/* Stats row */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : hasError ? null : userQuery.data ? (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatCell label="Repos"     value={userQuery.data.public_repos} icon={Star} />
          <StatCell label="Followers" value={userQuery.data.followers} />
          <StatCell label="Following" value={userQuery.data.following} />
        </div>
      ) : null}

      {/* Recent commits list */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
          Latest commits
        </p>
        {isLoading ? (
          <>
            <Skeleton className="h-9 rounded" />
            <Skeleton className="h-9 rounded" />
            <Skeleton className="h-9 rounded" />
          </>
        ) : hasError ? (
          <p className="text-xs text-muted-foreground italic">
            Couldn't load activity right now.
          </p>
        ) : recentCommits.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No recent public commits.</p>
        ) : (
          recentCommits.map((c) => (
            <div key={c.id} className="flex items-start gap-2 text-xs">
              <GitCommit className="h-3.5 w-3.5 mt-0.5 text-primary/70 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                  <span className="font-mono text-foreground/90 truncate max-w-full">
                    {c.repo}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/70">
                    · {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-1 mt-0.5 leading-snug">
                  {c.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </a>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────
function StatCell({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon?: typeof Star;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-2 rounded-lg
      bg-muted/40 border border-border/40">
      <div className="flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3 text-primary" />}
        <span className="font-display text-base font-bold text-foreground tabular-nums leading-none">
          {value}
        </span>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground mt-1 tracking-wide">
        {label}
      </span>
    </div>
  );
}
