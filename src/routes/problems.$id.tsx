import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/layout/shell";
import { Badge } from "@/components/ui/badge";
import { getPublicProblem } from "@/lib/civic/server";
import { categoryLabel, statusLabel } from "@/lib/civic/categories";

export const Route = createFileRoute("/problems/$id")({
  loader: async ({ params }) => getPublicProblem({ data: { id: params.id } }),
  component: ProblemDetail,
});

function ProblemDetail() {
  const data = Route.useLoaderData();
  if (!data) {
    return (
      <Page>
        <p>This problem was not found.</p>
        <Link to="/problems" className="mt-4 inline-block text-sm underline">
          Back to board
        </Link>
      </Page>
    );
  }
  const { problem, events, evidenceCount, interestCount } = data;
  return (
    <Page>
      <Link to="/problems" className="text-sm text-muted underline">
        All problems
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{categoryLabel(problem.category)}</Badge>
        <Badge className="capitalize">{statusLabel(problem.status)}</Badge>
        <Badge className="capitalize">{problem.priority} priority</Badge>
      </div>
      <h1 className="mt-4 font-display text-4xl text-ink">{problem.title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{problem.summary}</p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <Meta label="Location" value={`${problem.locality ?? "—"}, ${problem.district ?? "Jharkhand"}`} />
        <Meta label="Citizen reports" value={String(evidenceCount || problem.report_count)} />
        <Meta label="University interest" value={String(interestCount)} />
      </dl>
      <p className="mt-4 text-xs text-subtle">
        Private citizen information is not shown on public problem pages.
      </p>
      <h2 className="mt-10 font-display text-2xl text-ink">Lifecycle</h2>
      <ol className="mt-4 space-y-3">
        {events.map((e) => (
          <li key={e.id} className="rounded-md border border-border bg-surface px-4 py-3">
            <div className="text-sm font-medium text-fg">{e.kind}</div>
            {e.note ? <div className="mt-1 text-sm text-muted">{e.note}</div> : null}
            <div className="mt-1 text-xs text-subtle">{e.created_at}</div>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/university"
          className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg"
        >
          University workspace
        </Link>
        <Link
          to="/officer"
          className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium"
        >
          Officer workspace
        </Link>
      </div>
    </Page>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
