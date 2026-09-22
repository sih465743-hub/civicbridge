export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Turn Citizen Pain into<br />
          <span className="text-sky-400">University & Industry Action</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Multi-modal intake (WhatsApp • IVR • Web) → AI cleaning & deduplication → 
          Smart matching with universities and companies that can actually solve it.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/submit"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg transition"
          >
            Report an Issue
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 border border-slate-700 hover:border-sky-500 rounded-lg transition"
          >
            View Live Challenges
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'WhatsApp First', desc: 'Citizens just message a number. No app install needed.' },
          { title: 'AI Pre-Processing', desc: 'Spam filter, language detection, severity scoring, vector embedding.' },
          { title: 'Smart Matching', desc: 'Graph + vector search connects the right university / industry partner.' },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="font-semibold text-sky-400 mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
