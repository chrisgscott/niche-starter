import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { ConfigProvider } from '@/providers/ConfigProvider';
import { getSiteConfig } from '@/utils/content';

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
  const siteConfig = getSiteConfig();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider config={siteConfig}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
