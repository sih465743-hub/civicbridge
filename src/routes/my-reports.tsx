import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/layout/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listMyReports, type ReportRow } from "@/lib/civic/server";

export const Route = createFileRoute("/my-reports")({ component: MyReports });

function MyReports() {
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<ReportRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    void listMyReports().then(setRows);
  }, [user]);

  if (isPending) {
    return (
      <Page>
        <div className="h-40 animate-pulse rounded-xl bg-border/60" />
      </Page>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <Page>
      <h1 className="font-display text-4xl text-ink">My reports</h1>
      <p className="mt-2 text-muted">Private to your account.</p>
      <div className="mt-6 space-y-3">
        {rows === null ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted">
            No reports yet. <Link to="/report" className="underline">File one</Link>.
          </p>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm text-fg">{r.raw_text}</p>
              <p className="mt-2 text-xs text-subtle">
                {r.source} · {r.processing_status}
                {r.relationship_type ? ` · ${r.relationship_type}` : ""}
              </p>
              {r.problem_id ? (
                <Link
                  to="/problems/$id"
                  params={{ id: r.problem_id }}
                  className="mt-2 inline-block text-sm text-primary underline"
                >
                  Open master challenge
                </Link>
              ) : null}
            </div>
          ))
        )}
      </div>
    </Page>
  );
}
