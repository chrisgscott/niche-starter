import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Niche Site Generator',
    template: '%s | Niche Site Generator',
  },
  description: 'A modern framework for building SEO-optimized niche sites',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Niche Site Generator',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
