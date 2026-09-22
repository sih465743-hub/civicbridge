import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Page } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RoleSwitcher } from "@/components/civic/role-switcher";
import {
  expressInterest,
  listMyInterests,
  listPartners,
  listPublicProblems,
  type PartnerRow,
  type ProblemRow,
} from "@/lib/civic/server";

export const Route = createFileRoute("/university")({ component: UniversityPage });

function UniversityPage() {
  const { user, isPending } = useCurrentUserState();
  const [ready, setReady] = useState(false);
  const [problems, setProblems] = useState<ProblemRow[]>([]);
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [org, setOrg] = useState("BIT Mesra");
  const [note, setNote] = useState("We can field a student team under NEP community engagement.");
  const [interests, setInterests] = useState<Array<{ id: string; title: string; status: string }>>([]);

  const load = useCallback(() => {
    void Promise.all([listPublicProblems(), listPartners(), listMyInterests()]).then(
      ([p, partners, mine]) => {
        setProblems(p);
        setPartners(partners);
        setInterests(mine.map((i) => ({ id: i.id, title: i.title, status: i.status })));
      },
    );
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

  async function claim(problemId: string) {
    await expressInterest({ data: { problemId, orgName: org, note } });
    load();
  }

  return (
    <Page>
      <h1 className="font-display text-4xl text-ink">University workspace</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Discover master challenges that match departmental expertise. Interest is
        logged for admin review — a path toward NEP credits and later CSR pilots.
      </p>
      <div className="mt-6">
        <RoleSwitcher
          needed="university"
          onReady={(p) => {
            setReady(p.role === "university" || p.role === "admin");
            if (p.org_name) setOrg(p.org_name);
          }}
        />
      </div>
      {ready ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Institution name" />
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why this team" />
          </div>
          <h2 className="mt-10 font-display text-2xl">Partner map</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="mt-1 text-xs capitalize text-muted">{p.kind}</div>
                <div className="mt-2 text-xs text-subtle">{p.expertise}</div>
              </div>
            ))}
          </div>
          <h2 className="mt-10 font-display text-2xl">Open challenges</h2>
          <div className="mt-4 space-y-3">
            {problems
              .filter((p) => p.status !== "resolved" && p.status !== "closed")
              .map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{p.category}</Badge>
                    <Badge>{p.required_expertise}</Badge>
                  </div>
                  <h3 className="mt-2 font-display text-xl">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.summary}</p>
                  <Button className="mt-4" size="sm" onClick={() => void claim(p.id)}>
                    Express interest
                  </Button>
                </div>
              ))}
          </div>
          <h2 className="mt-10 font-display text-2xl">Your interest log</h2>
          <ul className="mt-3 space-y-2">
            {interests.map((i) => (
              <li key={i.id} className="text-sm text-muted">
                {i.title} · {i.status}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Page>
  );
}
