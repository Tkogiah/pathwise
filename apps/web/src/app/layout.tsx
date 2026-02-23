import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { AuthGuard } from '@/components/AuthGuard';
import { HeaderControls } from '@/components/HeaderControls';

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
            __html: `(function(){try{var t=localStorage.getItem('pathwise-auth-token');if(t){var p=JSON.parse(atob(t.split('.')[1]));var k='pathwise-theme:'+p.sub;var v=localStorage.getItem(k);if(v==='dark'){document.documentElement.classList.add('theme-dark');return}}if(matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('theme-dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${plex.className} bg-surface-primary text-content-primary antialiased`}
      >
        <AuthProvider>
          <header className="border-b border-edge bg-surface-elevated">
            <div className="mx-auto flex items-center max-w-3xl px-4 py-3 lg:max-w-6xl">
              <span className="text-base font-semibold tracking-wide text-content-secondary uppercase">
                Pathwise
              </span>
              <div className="ml-auto">
                <HeaderControls />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-3xl px-4 py-6 lg:max-w-6xl">
            <AuthGuard>{children}</AuthGuard>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
