'use server';

import { SchemaComponent } from './SchemaComponent';
import { Header } from './Header';
import { FooterServer } from './FooterServer';
import { Schema } from '@/types/schema';
import { getSiteConfig } from '@/app/api/config';
import { ThemeColor } from '@/types/schema';

interface LayoutProps {
  data: Schema;
  children: React.ReactNode;
  topics?: Array<{
    title: string;
    slug: string;
  }>;
  theme?: {
    color: ThemeColor;
  };
}

export async function Layout({ data, children, topics = [], theme }: LayoutProps) {
  const siteConfig = await getSiteConfig();

  return (
    <>
      <SchemaComponent data={data} />
      <div className={`min-h-screen flex flex-col bg-white theme-${theme?.color || 'indigo'}`}>
        <Header title={siteConfig.title} navigation={siteConfig.navigation} />
        <main className="flex-grow">
          {children}
        </main>
        <FooterServer topics={topics} />
      </div>
    </>
  );
}
