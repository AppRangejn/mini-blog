import { Footer } from '@/components/Footer';
import { Header } from '@/components/header/Header';
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
    'Mini-blog',
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
      <body className="flex min-h-screen flex-col bg-[#F7F8FA] text-slate-950">
        <AuthProvider>
          <Suspense
            fallback={
              <div className="h-20 border-b border-slate-200/80 bg-white" />
            }
          >
            <Header />
          </Suspense>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
