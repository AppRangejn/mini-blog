import { Header } from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MINI BLOG — Digital Editorial & Mini-Blog',
  description:
    'Full-stack mini-blog built with Next.js, Express and PostgreSQL',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#F7F8FA] text-slate-950">
        <AuthProvider>
          <Suspense
            fallback={
              <div className="h-20 border-b border-slate-200/80 bg-white" />
            }
          >
            <Header />
          </Suspense>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
