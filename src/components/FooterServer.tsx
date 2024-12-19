import { getSiteConfig } from '@/app/api/config';
import { Footer } from './Footer';

interface FooterServerProps {
  topics?: Array<{
    title: string;
    slug: string;
  }>;
}

export async function FooterServer({ topics = [] }: FooterServerProps) {
  const siteConfig = await getSiteConfig();
  return <Footer config={siteConfig.footer} topics={topics} />;
}
