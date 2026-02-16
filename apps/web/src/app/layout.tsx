import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Pathwise',
  description: 'Visual program state engine for case managers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('theme-dark')}})();`,
          }}
        />
      </head>
      <body
        className={`${plex.className} bg-surface-primary text-content-primary antialiased`}
      >
        <header className="border-b border-edge bg-surface-elevated">
          <div className="mx-auto max-w-3xl px-4 py-3 lg:max-w-5xl">
            <span className="text-sm font-semibold tracking-wide text-content-secondary uppercase">
              Pathwise
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6 lg:max-w-5xl">
          {children}
        </main>
      </body>
    </html>
  );
}
