import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function processSubmission(rawText: string, mediaUrls: string[] = [], langHint = 'hi') {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert civic issue classifier for India.
Analyze this citizen report and return STRICT JSON only:

{
  "title": "short clear title (max 12 words)",
  "description": "cleaned and expanded description in English",
  "category": "one of: water, education, health, infrastructure, agriculture, environment, other",
  "severity": 1-5,
  "language_detected": "hi|en|ta|te|bn|mr|gu|kn|ml|or|pa|other",
  "tags": ["tag1", "tag2"],
  "is_spam": false,
  "spam_reason": null,
  "location_hint": "any place name mentioned or null"
}

Raw report (language may be Hindi/regional):
"""
${rawText}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Extract JSON even if model wraps it
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('AI process failed', err);
    return {
      title: 'Unprocessed Report',
      description: rawText.slice(0, 300),
      category: 'other',
      severity: 3,
      language_detected: langHint,
      tags: [],
      is_spam: false,
      spam_reason: null,
      location_hint: null,
    };
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  // Gemini embedding via generateContent + manual or use text-embedding-004 if available
  // For free tier we approximate with a hash-based stub + real call when possible
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  try {
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch {
    // Fallback deterministic pseudo-embedding for prototype
    const hash = Array.from(text).reduce((a, c) => a + c.charCodeAt(0), 0);
    return Array.from({ length: 768 }, (_, i) => Math.sin(hash + i) * 0.1);
  }
}

export async function classifySpam(text: string): Promise<{ isSpam: boolean; score: number }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Rate if this citizen report is spam/abusive/irrelevant on 0-1 scale. Return JSON: {"is_spam": bool, "score": number}
Text: """${text.slice(0, 500)}"""`;
  try {
    const result = await model.generateContent(prompt);
    const json = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { isSpam: !!json.is_spam, score: json.score ?? 0.1 };
  } catch {
    return { isSpam: false, score: 0.1 };
  }
}
