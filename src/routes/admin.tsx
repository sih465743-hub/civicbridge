import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Page } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RoleSwitcher } from "@/components/civic/role-switcher";
import {
  dashboardStats,
  listAllInterests,
  reviewInterest,
  type ProfileRow,
} from "@/lib/civic/server";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof dashboardStats>> | null>(null);
  const [interests, setInterests] = useState<
    Array<{ id: string; title: string; org_name: string; status: string; note: string | null }>
  >([]);
  const ready = profile?.role === "admin";

  const load = useCallback(() => {
    void Promise.all([dashboardStats(), listAllInterests()]).then(([s, i]) => {
      setStats(s);
      setInterests(i);
    });
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

  return (
    <Page>
      <h1 className="font-display text-4xl text-ink">Admin operations</h1>
      <p className="mt-2 text-muted">
        Monitor problem formation, university interest, and civic volume. AI
        recommends; people decide.
      </p>
      <div className="mt-6">
        <RoleSwitcher needed="admin" onReady={setProfile} />
      </div>
      {ready && stats ? (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Tile n={stats.problems} label="Problems" />
            <Tile n={stats.reports} label="Reports" />
            <Tile n={stats.open} label="Open" />
            <Tile n={stats.duplicatesAbsorbed} label="Merged" />
            <Tile n={stats.citizensRepresented} label="Citizens" />
          </div>
          <h2 className="mt-10 font-display text-2xl">University interest review</h2>
          <div className="mt-4 space-y-3">
            {interests.length === 0 ? (
              <p className="text-sm text-muted">No interest filings yet.</p>
            ) : (
              interests.map((i) => (
                <div key={i.id} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{i.status}</Badge>
                    <span className="text-sm font-medium">{i.org_name}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{i.title}</p>
                  {i.note ? <p className="mt-1 text-xs text-subtle">{i.note}</p> : null}
                  {i.status === "proposed" ? (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          void reviewInterest({ data: { id: i.id, status: "accepted" } }).then(load)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void reviewInterest({ data: { id: i.id, status: "rejected" } }).then(load)
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </>
      ) : null}
    </Page>
  );
}

function Tile({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="font-display text-2xl tabular-nums">{n}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
