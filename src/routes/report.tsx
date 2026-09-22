import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { DISTRICTS } from "@/lib/civic/categories";
import { submitCivicReport, type ProblemRow } from "@/lib/civic/server";

export const Route = createFileRoute("/report")({ component: ReportPage });

function ReportPage() {
  const { user, isPending } = useCurrentUserState();
  const [text, setText] = useState("");
  const [locality, setLocality] = useState("");
  const [district, setDistrict] = useState("Ranchi");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    relationship: string;
    usedAi: boolean;
    problem: ProblemRow;
    mergeScore: number | null;
  } | null>(null);

  if (isPending) {
    return (
      <Page>
        <div className="h-40 animate-pulse rounded-xl bg-border/60" />
      </Page>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const out = await submitCivicReport({
        data: { text, locality, district, source: "web" },
      });
      setResult({
        relationship: out.relationship,
        usedAi: out.usedAi,
        problem: out.problem,
        mergeScore: out.mergeScore,
      });
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit report.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page className="max-w-3xl">
      <h1 className="font-display text-4xl text-ink">Report a civic problem</h1>
      <p className="mt-2 text-muted">
        Write it the way you would tell a neighbour. The platform structures,
        deduplicates and routes it.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">What is wrong?</Label>
          <Textarea
            id="text"
            required
            minLength={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="There is a water pipe leaking near the school since yesterday…"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="locality">Locality / ward / village</Label>
            <Input
              id="locality"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="Ward 4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <select
              id="district"
              className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Understanding report…" : "Submit report"}
        </Button>
      </form>
      {result ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {result.relationship === "same"
                ? "Attached to an existing master challenge"
                : "New master challenge opened"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted">
              {result.usedAi
                ? "Structured with Grok."
                : "Structured with the local civic heuristic (AI key not used)."}
              {result.mergeScore
                ? ` Merge confidence ${result.mergeScore.toFixed(2)}.`
                : ""}
            </p>
            <p className="font-medium text-fg">{result.problem.title}</p>
            <p className="text-muted">{result.problem.summary}</p>
            <p className="text-subtle tabular-nums">
              {result.problem.report_count} citizen reports now sit on this problem.
            </p>
            <Link
              to="/problems/$id"
              params={{ id: result.problem.id }}
              className="inline-block text-primary underline"
            >
              Open public problem
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </Page>
  );
}
