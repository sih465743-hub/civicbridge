'use client';

import { useState } from 'react';

export default function SubmitPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, channel: 'web' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Report a Societal Challenge</h1>
      <p className="text-slate-400">
        Describe the problem in any language. You can also use WhatsApp for faster reporting.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Example: हमारे गांव में पीने का पानी बहुत गंदा है, बच्चे बीमार हो रहे हैं..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-100 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg"
        >
          {loading ? 'Processing with AI…' : 'Submit Report'}
        </button>
      </form>

      {result && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <>
              <p className="text-sky-400 font-semibold">✅ Registered successfully</p>
              <p><strong>Title:</strong> {result.title}</p>
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Severity:</strong> {result.severity}/5</p>
              <p className="text-sm text-slate-400">{result.description}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
