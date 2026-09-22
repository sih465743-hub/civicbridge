import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Page } from "@/components/layout/shell";
import { Input } from "@/components/ui/input";
import { listPublicProblems } from "@/lib/civic/server";
import { ProblemCard } from "@/components/civic/problem-card";
import { CATEGORIES, categoryLabel } from "@/lib/civic/categories";

export const Route = createFileRoute("/problems")({
  loader: () => listPublicProblems(),
  component: ProblemsPage,
});

function ProblemsPage() {
  const problems = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!q.trim()) return true;
      const hay = `${p.title} ${p.summary} ${p.locality} ${p.district}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [problems, q, cat]);

  return (
    <Page>
      <h1 className="font-display text-4xl text-ink">Master challenges</h1>
      <p className="mt-2 max-w-2xl text-muted">
        A report is one citizen observation. A problem is the underlying civic
        issue. This board only shows consolidated problems.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search locality, school, pump…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-4 text-sm text-subtle tabular-nums">{filtered.length} problems</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <ProblemCard key={p.id} problem={p} />
        ))}
      </div>
    </Page>
  );
}
