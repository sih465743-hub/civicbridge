import { CATEGORIES, type Category, type Priority } from "./categories";
import { fingerprint } from "./dedup";

export type StructuredCivic = {
  title: string;
  summary: string;
  category: Category;
  subcategory: string;
  priority: Priority;
  locality: string | null;
  district: string | null;
  entities: string[];
  requiredExpertise: string;
  safetyFlags: string[];
  fingerprint: string;
  usedAi: boolean;
};

const KEYWORDS: Array<{ category: Category; words: string[] }> = [
  { category: "water", words: ["water", "handpump", "pump", "leak", "pipe", "tap", "well", "jal"] },
  { category: "sanitation", words: ["garbage", "waste", "drain", "sewage", "toilet", "dump"] },
  { category: "education", words: ["school", "teacher", "textbook", "classroom", "anganwadi", "primer"] },
  { category: "health", words: ["hospital", "clinic", "doctor", "health", "medicine"] },
  { category: "infrastructure", words: ["pothole", "road", "streetlight", "bridge", "light"] },
  { category: "energy", words: ["electricity", "power", "transformer", "outage"] },
  { category: "agriculture", words: ["crop", "farm", "irrigation", "kisan"] },
  { category: "environment", words: ["tree", "pollution", "forest", "smoke"] },
];

export function heuristicStructure(
  text: string,
  locality?: string | null,
  district?: string | null,
): StructuredCivic {
  const lower = text.toLowerCase();
  let category: Category = "other";
  for (const row of KEYWORDS) {
    if (row.words.some((w) => lower.includes(w))) {
      category = row.category;
      break;
    }
  }
  const urgent = /no water|accident|collapse|overflow|days? without/.test(lower);
  const title = text.replace(/\s+/g, " ").trim().slice(0, 88);
  const summary = text.replace(/\s+/g, " ").trim().slice(0, 280);
  return {
    title: title || "Civic report",
    summary: summary || title,
    category,
    subcategory: category,
    priority: urgent ? "high" : "medium",
    locality: locality || null,
    district: district || null,
    entities: [],
    requiredExpertise: category,
    safetyFlags: urgent ? ["needs-attention"] : [],
    fingerprint: fingerprint([title, category, locality, district]),
    usedAi: false,
  };
}

export async function structureReport(input: {
  text: string;
  locality?: string | null;
  district?: string | null;
}): Promise<StructuredCivic> {
  const fallback = heuristicStructure(input.text, input.locality, input.district);
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return fallback;

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 500,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You extract civic problem facts from citizen reports in Jharkhand, India. Reply with JSON only. No markdown.",
          },
          {
            role: "user",
            content: `Report: ${input.text}
Locality hint: ${input.locality ?? ""}
District hint: ${input.district ?? ""}
Return JSON keys: title, summary, category (one of ${CATEGORIES.join(",")}), subcategory, priority (low|medium|high|urgent), locality, district, entities (string[]), requiredExpertise, safetyFlags (string[]), fingerprint.`,
          },
        ],
      }),
    });
    if (!res.ok) return fallback;
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = body.choices?.[0]?.message?.content ?? "";
    const jsonText = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonText) as Partial<StructuredCivic>;
    const category = CATEGORIES.includes(parsed.category as Category)
      ? (parsed.category as Category)
      : fallback.category;
    const title = String(parsed.title || fallback.title).slice(0, 120);
    const summary = String(parsed.summary || fallback.summary).slice(0, 400);
    return {
      title,
      summary,
      category,
      subcategory: String(parsed.subcategory || category),
      priority: (parsed.priority as Priority) || fallback.priority,
      locality: parsed.locality || input.locality || null,
      district: parsed.district || input.district || null,
      entities: Array.isArray(parsed.entities) ? parsed.entities.map(String).slice(0, 8) : [],
      requiredExpertise: String(parsed.requiredExpertise || category),
      safetyFlags: Array.isArray(parsed.safetyFlags)
        ? parsed.safetyFlags.map(String).slice(0, 6)
        : [],
      fingerprint: fingerprint([
        parsed.fingerprint || title,
        category,
        parsed.locality,
        parsed.district,
      ]),
      usedAi: true,
    };
  } catch {
    return fallback;
  }
}
