import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EviTrace — Turn messy media into traceable evidence',
  description:
    'AI-powered media pipeline that transforms a messy collection of photos and videos into organized, searchable, traceable visual evidence and a professional report.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
