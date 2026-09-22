import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { structureReport } from "./ai";
import { jaccard, localityClose } from "./dedup";
import type { ProblemStatus } from "./categories";

export type ProblemRow = {
  id: string;
  title: string;
  summary: string;
  category: string;
  subcategory: string | null;
  priority: string;
  locality: string | null;
  district: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  report_count: number;
  required_expertise: string | null;
  fingerprint: string | null;
  confidence: number;
  created_at: string;
  updated_at: string;
};

export type ReportRow = {
  id: string;
  user_id: string;
  problem_id: string | null;
  source: string;
  raw_text: string;
  structured_title: string | null;
  structured_summary: string | null;
  category: string | null;
  locality: string | null;
  district: string | null;
  processing_status: string;
  relationship_type: string | null;
  relationship_confidence: number | null;
  created_at: string;
};

export type EventRow = {
  id: string;
  problem_id: string;
  actor_user_id: string | null;
  kind: string;
  note: string | null;
  created_at: string;
};

export type InterestRow = {
  id: string;
  user_id: string;
  problem_id: string;
  org_name: string;
  note: string | null;
  status: string;
  created_at: string;
};

export type PartnerRow = {
  id: string;
  name: string;
  kind: string;
  expertise: string;
  district: string | null;
  capacity: number;
};

export type ProfileRow = {
  user_id: string;
  display_name: string | null;
  role: string;
  org_name: string | null;
  expertise: string | null;
};

function nid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 10)}`;
}

async function ensureProfile(userId: string, displayName?: string | null) {
  const sql = await getSql();
  await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${displayName ?? null})
    on conflict (user_id) do nothing
  `;
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      select user_id, display_name, role, org_name, expertise
      from profiles where user_id = ${context.userId}
    `;
    return rows[0] ?? null;
  });

export const setMyRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { role: string; orgName?: string; expertise?: string }) => input)
  .handler(async ({ context, data }) => {
    const allowed = ["citizen", "officer", "university", "admin"];
    if (!allowed.includes(data.role)) throw new Error("Invalid role");
    await ensureProfile(context.userId);
    const sql = await getSql();
    await sql`
      update profiles
      set role = ${data.role},
          org_name = coalesce(${data.orgName ?? null}, org_name),
          expertise = coalesce(${data.expertise ?? null}, expertise)
      where user_id = ${context.userId}
    `;
    await sql`
      insert into audit_logs (id, user_id, action, detail)
      values (${nid("a")}, ${context.userId}, 'role.set', ${data.role})
    `;
    return { ok: true as const };
  });

export const listPublicProblems = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<ProblemRow>`
    select id, title, summary, category, subcategory, priority, locality, district,
           lat, lng, status, report_count, required_expertise, fingerprint, confidence,
           created_at::text as created_at, updated_at::text as updated_at
    from problems
    order by report_count desc, updated_at desc
  `;
});

export const getPublicProblem = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const problems = await sql<ProblemRow>`
      select id, title, summary, category, subcategory, priority, locality, district,
             lat, lng, status, report_count, required_expertise, fingerprint, confidence,
             created_at::text as created_at, updated_at::text as updated_at
      from problems where id = ${data.id}
    `;
    const problem = problems[0];
    if (!problem) return null;
    const events = await sql<EventRow>`
      select id, problem_id, actor_user_id, kind, note, created_at::text as created_at
      from status_events where problem_id = ${data.id}
      order by created_at asc
    `;
    const evidence = await sql<{ count: number }>`
      select count(*)::int as count from reports where problem_id = ${data.id}
    `;
    const interests = await sql<{ count: number }>`
      select count(*)::int as count from university_interests where problem_id = ${data.id}
    `;
    return {
      problem,
      events,
      evidenceCount: evidence[0]?.count ?? 0,
      interestCount: interests[0]?.count ?? 0,
    };
  });

export const listPartners = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<PartnerRow>`select id, name, kind, expertise, district, capacity from partners order by name`;
});

export const listMyReports = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<ReportRow>`
      select id, user_id, problem_id, source, raw_text, structured_title, structured_summary,
             category, locality, district, processing_status, relationship_type,
             relationship_confidence, created_at::text as created_at
      from reports
      where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const submitCivicReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      text: string;
      locality?: string;
      district?: string;
      source?: "web" | "whatsapp";
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const text = data.text.trim();
    if (text.length < 8) throw new Error("Please describe the problem in a bit more detail.");
    await ensureProfile(context.userId);
    const sql = await getSql();
    const structured = await structureReport({
      text,
      locality: data.locality,
      district: data.district,
    });
    const reportId = nid("r");
    await sql`
      insert into reports (
        id, user_id, source, raw_text, structured_title, structured_summary,
        category, locality, district, processing_status
      ) values (
        ${reportId}, ${context.userId}, ${data.source ?? "web"}, ${text},
        ${structured.title}, ${structured.summary}, ${structured.category},
        ${structured.locality}, ${structured.district}, 'processing'
      )
    `;

    const candidates = await sql<ProblemRow>`
      select id, title, summary, category, subcategory, priority, locality, district,
             lat, lng, status, report_count, required_expertise, fingerprint, confidence,
             created_at::text as created_at, updated_at::text as updated_at
      from problems
      where status <> 'closed'
      order by updated_at desc
      limit 80
    `;

    let best: { problem: ProblemRow; score: number } | null = null;
    const query = `${structured.fingerprint} ${structured.title} ${structured.summary}`;
    for (const p of candidates) {
      if (p.category !== structured.category) continue;
      if (!localityClose(p.locality, structured.locality) && p.district !== structured.district) {
        continue;
      }
      const score = Math.max(
        jaccard(query, `${p.fingerprint} ${p.title} ${p.summary}`),
        jaccard(structured.title, p.title),
      );
      if (!best || score > best.score) best = { problem: p, score };
    }

    const merge = best && best.score >= 0.28;
    let problemId: string;
    let relationship: "same" | "new" = "new";
    if (merge && best) {
      problemId = best.problem.id;
      relationship = "same";
      await sql`
        update problems
        set report_count = report_count + 1,
            updated_at = now(),
            confidence = greatest(confidence, ${best.score})
        where id = ${problemId}
      `;
      await sql`
        insert into status_events (id, problem_id, actor_user_id, kind, note)
        values (
          ${nid("e")}, ${problemId}, ${context.userId}, 'reports.consolidated',
          ${`Citizen report merged (score ${best.score.toFixed(2)}).`}
        )
      `;
    } else {
      problemId = nid("pr");
      await sql`
        insert into problems (
          id, title, summary, category, subcategory, priority, locality, district,
          status, report_count, required_expertise, fingerprint, confidence
        ) values (
          ${problemId}, ${structured.title}, ${structured.summary}, ${structured.category},
          ${structured.subcategory}, ${structured.priority}, ${structured.locality},
          ${structured.district}, 'open', 1, ${structured.requiredExpertise},
          ${structured.fingerprint}, ${structured.usedAi ? 0.82 : 0.62}
        )
      `;
      await sql`
        insert into status_events (id, problem_id, actor_user_id, kind, note)
        values (
          ${nid("e")}, ${problemId}, ${context.userId}, 'problem.created',
          ${structured.usedAi ? "AI structured a new master challenge." : "Heuristic structured a new master challenge."}
        )
      `;
    }

    await sql`
      update reports
      set problem_id = ${problemId},
          processing_status = 'processed',
          relationship_type = ${relationship},
          relationship_confidence = ${merge && best ? best.score : 1}
      where id = ${reportId} and user_id = ${context.userId}
    `;

    const problems = await sql<ProblemRow>`
      select id, title, summary, category, subcategory, priority, locality, district,
             lat, lng, status, report_count, required_expertise, fingerprint, confidence,
             created_at::text as created_at, updated_at::text as updated_at
      from problems where id = ${problemId}
    `;

    return {
      reportId,
      relationship,
      usedAi: structured.usedAi,
      structured,
      problem: problems[0],
      mergeScore: merge && best ? best.score : null,
    };
  });

export const updateProblemStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { problemId: string; status: ProblemStatus; note?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const profiles = await sql<ProfileRow>`
      select user_id, display_name, role, org_name, expertise
      from profiles where user_id = ${context.userId}
    `;
    const role = profiles[0]?.role ?? "citizen";
    if (role !== "officer" && role !== "admin") {
      throw new Error("Officer workspace required.");
    }
    await sql`
      update problems set status = ${data.status}, updated_at = now()
      where id = ${data.problemId}
    `;
    await sql`
      insert into status_events (id, problem_id, actor_user_id, kind, note)
      values (${nid("e")}, ${data.problemId}, ${context.userId}, ${data.status}, ${data.note ?? null})
    `;
    await sql`
      insert into audit_logs (id, user_id, action, detail)
      values (${nid("a")}, ${context.userId}, 'problem.status', ${`${data.problemId}:${data.status}`})
    `;
    return { ok: true as const };
  });

export const expressInterest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { problemId: string; orgName: string; note?: string }) => input)
  .handler(async ({ context, data }) => {
    if (!data.orgName.trim()) throw new Error("Organisation name is required.");
    await ensureProfile(context.userId);
    const sql = await getSql();
    const id = nid("i");
    await sql`
      insert into university_interests (id, user_id, problem_id, org_name, note)
      values (${id}, ${context.userId}, ${data.problemId}, ${data.orgName.trim()}, ${data.note ?? null})
    `;
    await sql`
      insert into status_events (id, problem_id, actor_user_id, kind, note)
      values (${nid("e")}, ${data.problemId}, ${context.userId}, 'university.interest', ${data.orgName.trim()})
    `;
    return { id };
  });

export const listMyInterests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<(InterestRow & { title: string })>`
      select i.id, i.user_id, i.problem_id, i.org_name, i.note, i.status,
             i.created_at::text as created_at, p.title
      from university_interests i
      join problems p on p.id = i.problem_id
      where i.user_id = ${context.userId}
      order by i.created_at desc
    `;
  });

export const listAllInterests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profiles = await sql<ProfileRow>`
      select user_id, display_name, role, org_name, expertise
      from profiles where user_id = ${context.userId}
    `;
    if (profiles[0]?.role !== "admin") throw new Error("Admin workspace required.");
    return sql<(InterestRow & { title: string })>`
      select i.id, i.user_id, i.problem_id, i.org_name, i.note, i.status,
             i.created_at::text as created_at, p.title
      from university_interests i
      join problems p on p.id = i.problem_id
      order by i.created_at desc
    `;
  });

export const reviewInterest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; status: "accepted" | "rejected" }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const profiles = await sql<ProfileRow>`
      select user_id, display_name, role, org_name, expertise
      from profiles where user_id = ${context.userId}
    `;
    if (profiles[0]?.role !== "admin") throw new Error("Admin workspace required.");
    await sql`
      update university_interests set status = ${data.status} where id = ${data.id}
    `;
    return { ok: true as const };
  });

export const dashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const problems = await sql<{ count: number }>`select count(*)::int as count from problems`;
  const reports = await sql<{ count: number }>`select count(*)::int as count from reports`;
  const open = await sql<{ count: number }>`select count(*)::int as count from problems where status = 'open'`;
  const merged = await sql<{ count: number }>`
    select coalesce(sum(report_count - 1), 0)::int as count from problems where report_count > 1
  `;
  const citizens = await sql<{ count: number }>`select coalesce(sum(report_count), 0)::int as count from problems`;
  return {
    problems: problems[0]?.count ?? 0,
    reports: reports[0]?.count ?? 0,
    open: open[0]?.count ?? 0,
    duplicatesAbsorbed: merged[0]?.count ?? 0,
    citizensRepresented: citizens[0]?.count ?? 0,
  };
});
