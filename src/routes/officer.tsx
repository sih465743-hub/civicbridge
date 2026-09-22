import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Page } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RoleSwitcher } from "@/components/civic/role-switcher";
import {
  listPublicProblems,
  updateProblemStatus,
  type ProblemRow,
  type ProfileRow,
} from "@/lib/civic/server";
import type { ProblemStatus } from "@/lib/civic/categories";
import { statusLabel } from "@/lib/civic/categories";

export const Route = createFileRoute("/officer")({ component: OfficerPage });

function OfficerPage() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [queue, setQueue] = useState<ProblemRow[]>([]);
  const [note, setNote] = useState("");
  const ready = profile?.role === "officer" || profile?.role === "admin";

  const load = useCallback(() => {
    void listPublicProblems().then(setQueue);
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  if (isPending) {
    return (
      <Page>
        <div className="h-40 animate-pulse rounded-xl bg-border/60" />
      </Page>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function act(id: string, status: ProblemStatus) {
    await updateProblemStatus({ data: { problemId: id, status, note } });
    setNote("");
    load();
  }

  return (
    <Page>
      <h1 className="font-display text-4xl text-ink">Officer workspace</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Work the master-challenge queue. You see the canonical problem, not fifty
        duplicate tickets.
      </p>
      <div className="mt-6">
        <RoleSwitcher needed="officer" onReady={setProfile} />
      </div>
      {ready ? (
        <div className="mt-8 space-y-4">
          <input
            className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
            placeholder="Optional public note for the next status change"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {queue.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap gap-2">
                <Badge className="capitalize">{statusLabel(p.status)}</Badge>
                <Badge>{p.category}</Badge>
                <Badge className="tabular-nums">{p.report_count} reports</Badge>
              </div>
              <h2 className="mt-3 font-display text-xl">{p.title}</h2>
              <p className="mt-1 text-sm text-muted">{p.summary}</p>
              <p className="mt-2 text-xs text-subtle">
                {p.locality}, {p.district}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => void act(p.id, "assigned")}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => void act(p.id, "in_progress")}>
                  In progress
                </Button>
                <Button size="sm" variant="secondary" onClick={() => void act(p.id, "resolved")}>
                  Resolve
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Page>
  );
}
