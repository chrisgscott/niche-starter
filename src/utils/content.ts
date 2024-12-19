import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ContentMetadata {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
}

interface FooterConfig {
  about: {
    title: string;
    links: Array<{
      label: string;
      link: string;
    }>;
  };
  categories: {
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
  subscribe: {
    title: string;
    description: string;
  };
  copyright: string;
}

interface SiteConfig {
  title: string;
  description: string;
  navigation: Array<{
    label: string;
    link: string;
  }>;
  footer: FooterConfig;
}

export function getSiteConfig(): SiteConfig {
  const configPath = path.join(process.cwd(), 'src/content/config/site.md');
  const fileContent = fs.readFileSync(configPath, 'utf-8');
  const { data } = matter(fileContent);
  return data as SiteConfig;
}

export function getContentMetadata(contentPath: string): ContentMetadata {
  // Remove leading slash if present
  const normalizedPath = contentPath.replace(/^\//, '');
  
  // Extract content type and slug from the path
  const match = normalizedPath.match(/^(post|posts|article|articles|topic|topics)\/([^/]+)$/);
  if (!match) {
    console.warn(`Invalid content path: ${contentPath}, using fallback values`);
    return {
      title: 'Untitled',
      description: 'No description available',
      slug: normalizedPath.split('/').pop() || '',
      keywords: []
    };
  }

  const [, contentType, slug] = match;
  
  // Map content type to directory (handle both singular and plural forms)
  const contentDir = {
    post: 'posts',
    posts: 'posts',
    article: 'articles',
    articles: 'articles',
    topic: 'topics',
    topics: 'topics'
  }[contentType] || 'posts'; // Provide a default value

  // Read and parse the markdown file
  const filePath = path.join(process.cwd(), 'src/content', contentDir, `${slug}.md`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    return {
      title: data.title || 'Untitled',
      description: data.description || 'No description available',
      slug: data.slug || slug,
      keywords: data.keywords || []
    };
  } catch (error) {
    console.error(`Error reading content metadata for ${contentPath}:`, error);
    return {
      title: 'Untitled',
      description: 'No description available',
      slug,
      keywords: []
    };
  }
}
