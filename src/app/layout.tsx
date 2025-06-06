import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UIProvider } from '@/contexts/UIContext';
import { NotificationBar } from '@/components/NotificationBar';
import { GlobalLoading } from '@/components/GlobalLoading';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Yameru',
  description: 'やめたいのにやめられない行動を支援するアプリ Yameru',
  openGraph: {
    title: 'Yameru',
    description: 'やめたいのにやめられない行動を支援するアプリ Yameru',
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: 'OGP image for Yameru',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* ファビコン・PWA対応の追加タグ */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <meta name="theme-color" content="#fefae0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
        <AuthProvider>
          <UIProvider>
            <GlobalLoading />
            <NotificationBar />
            <Header />
            <main className="p-4 pb-16">{children}</main>
            <Footer />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
