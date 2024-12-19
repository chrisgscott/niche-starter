import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface FooterConfig {
  company: {
    name: string;
    description: string;
  };
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  resources: {
    title: string;
    links: Array<{
      label: string;
      link: string;
    }>;
  };
  legal: {
    title: string;
    links: Array<{
      label: string;
      link: string;
    }>;
  };
}

export interface SiteConfig {
  title: string;
  description: string;
  navigation: Array<{
    label: string;
    link: string;
  }>;
  footer: FooterConfig;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const configPath = path.join(process.cwd(), 'src/content/config/site.md');
  const fileContent = fs.readFileSync(configPath, 'utf-8');
  const { data } = matter(fileContent);
  return data as SiteConfig;
}
