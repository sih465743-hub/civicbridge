import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import type { ProblemRow } from "@/lib/civic/server";
import { categoryLabel, statusLabel } from "@/lib/civic/categories";

export function ProblemCard({ problem }: { problem: ProblemRow }) {
  return (
    <Link
      to="/problems/$id"
      params={{ id: problem.id }}
      className="block rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-transform duration-150 hover:-translate-y-0.5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{categoryLabel(problem.category)}</Badge>
        <Badge className="capitalize">{statusLabel(problem.status)}</Badge>
        <Badge className="capitalize">{problem.priority}</Badge>
      </div>
      <h3 className="mt-3 font-display text-xl text-ink">{problem.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{problem.summary}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-subtle">
        <span>
          {problem.locality ? `${problem.locality}, ` : ""}
          {problem.district ?? "Jharkhand"}
        </span>
        <span className="tabular-nums">{problem.report_count} citizen reports</span>
      </div>
    </Link>
  );
}
