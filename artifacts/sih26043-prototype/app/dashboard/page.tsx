import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: challenges } = await supabase
    .from('challenges')
    .select('id, title, category, severity, status, upvote_count, report_count, created_at, tags')
    .eq('is_primary', true)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Live Challenge Board</h1>
      <p className="text-slate-400">
        Open societal challenges waiting for university / industry match. 
        Only primary (de-duplicated) reports are shown.
      </p>

      <div className="grid gap-4">
        {(challenges || []).map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-700 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg">{c.title}</h2>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300">{c.category}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Severity {c.severity}/5</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">{c.status}</span>
                  {(c.report_count || 1) > 1 && (
                    <span className="px-2 py-0.5 rounded bg-amber-900/50 text-amber-300">
                      {c.report_count} reports
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-slate-500">
                {new Date(c.created_at).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        ))}
        {(!challenges || challenges.length === 0) && (
          <p className="text-slate-500 text-center py-12">No challenges yet. Be the first to report.</p>
        )}
      </div>
    </div>
  );
}
