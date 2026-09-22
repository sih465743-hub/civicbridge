import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIH26043 | Civic Challenge Crowdsource',
  description: 'Multi-modal platform connecting citizen reports to universities & industry for real solutions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight">
              <span className="text-sky-400">Civic</span>Match
            </div>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-sky-400">Home</a>
              <a href="/submit" className="hover:text-sky-400">Report Issue</a>
              <a href="/dashboard" className="hover:text-sky-400">Dashboard</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
