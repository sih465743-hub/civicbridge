import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Layers, MessageCircle, Route as RouteIcon, Shield, Users } from "lucide-react";
import { Page } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { dashboardStats, listPublicProblems } from "@/lib/civic/server";
import { ProblemCard } from "@/components/civic/problem-card";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [stats, problems] = await Promise.all([
      dashboardStats(),
      listPublicProblems(),
    ]);
    return { stats, problems: problems.slice(0, 4) };
  },
  component: Home,
});

function Home() {
  const { stats, problems } = Route.useLoaderData();

  return (
    <Page className="py-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            SIH 26043 · Smart Education · Jharkhand
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl text-ink sm:text-5xl">
            Tell us what is wrong. We turn it into a problem the right people can act on.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted">
            CivicBridge is a civic problem operating system. Citizens speak in
            ordinary language. AI structures the report. Duplicates become one
            master challenge. Officers, universities and industry take it from there.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/report">
                File a report <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/problems">View master challenges</Link>
            </Button>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <Stat n={stats.problems} label="Master challenges" />
          <Stat n={stats.reports} label="Citizen reports" />
          <Stat n={stats.duplicatesAbsorbed} label="Duplicates absorbed" />
          <Stat n={stats.citizensRepresented} label="Citizens represented" />
        </dl>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Step
          icon={<MessageCircle className="h-5 w-5" />}
          title="Observe"
          body="WhatsApp voice note or a short web report. No app download."
        />
        <Step
          icon={<Layers className="h-5 w-5" />}
          title="Consolidate"
          body="Fifty complaints about one pump become one master challenge."
        />
        <Step
          icon={<RouteIcon className="h-5 w-5" />}
          title="Route"
          body="Geography, department rules and expertise decide who acts."
        />
        <Step
          icon={<Shield className="h-5 w-5" />}
          title="Prove"
          body="Officers update status. Universities attach interest. Citizens see progress."
        />
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-ink">Live master challenges</h2>
            <p className="mt-2 text-sm text-muted">
              Public problem pages never show private citizen identity.
            </p>
          </div>
          <Link to="/problems" className="text-sm font-medium text-primary">
            See all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Users className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-display text-2xl text-ink">Tri-party engine</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Citizens get a zero-friction channel. Government sees unique verified
              problems instead of ticket noise. Students and universities claim
              challenges as NEP community-engagement work, with industry CSR as a
              later funding layer.
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="font-display text-3xl tabular-nums text-ink">{n}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="text-primary">{icon}</div>
      <h3 className="mt-3 font-display text-lg text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
