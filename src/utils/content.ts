import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CTAConfig } from '@/components/cta';
import { siteConfigSchema } from '@/utils/validation/schemas';
import type { z } from 'zod';

interface Schema {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  topic?: string;
  image?: {
    url: string;
    alt?: string;
  };
  links?: {
    topic?: string;
    posts?: string[];
  };
  date?: string;
}

interface ContentMetadata {
  data: {
    title: string;
    description: string;
    slug: string;
    keywords?: string[];
    [key: string]: any;
  };
  content: string;
  path: string;
}

export type SiteConfig = z.infer<typeof siteConfigSchema>;

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

interface RelatedContent {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: {
    url: string;
    alt?: string;
  };
}

export function getSiteConfig(): SiteConfig {
  const siteConfigPath = path.join(process.cwd(), 'src/content/config/site.md');
  const fileContents = fs.readFileSync(siteConfigPath, 'utf8');
  const { data } = matter(fileContents);
  return siteConfigSchema.parse(data);
}

export function getContentMetadata(contentType: string, slug: string): ContentMetadata | null {
  try {
    // Handle URL paths that use singular form
    if (contentType === 'article') {
      contentType = 'articles';
    }
    if (contentType === 'post') {
      contentType = 'posts';
    }
    
    const contentPath = path.join(process.cwd(), 'src/content', contentType, `${slug}.md`);
    console.log(`[getContentMetadata] Reading file: ${contentPath}`);
    
    if (!fs.existsSync(contentPath)) {
      console.log(`[getContentMetadata] File not found: ${contentPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const { data, content } = matter(fileContents);
    console.log(`[getContentMetadata] Parsed frontmatter data:`, data);
    
    // Ensure required Schema fields are present
    const schemaData: Schema = {
      title: data.title || '',
      description: data.description || '',
      slug: data.slug || slug,
      date: data.date || new Date().toISOString(),
      keywords: data.keywords || [],
      ...data
    };
    
    return {
      data: schemaData,
      content,
      path: contentPath
    };
  } catch (error) {
    console.error(`[getContentMetadata] Error reading content metadata:`, error);
    return null;
  }
}

/**
 * Get topic data from a topic slug
 */
export function getTopicData(topicSlug: string) {
  const filePath = path.join(process.cwd(), 'src/content/topics', `${topicSlug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(markdownWithMeta);
  
  return {
    title: data.title,
    slug: topicSlug,
  };
}

/**
 * Get all topics with their metadata
 */
export function getAllTopics(): Array<{ title: string; slug: string }> {
  try {
    const topicsPath = path.join(process.cwd(), 'src/content/topics');
    const files = fs.readdirSync(topicsPath);
    
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '');
        const markdownWithMeta = fs.readFileSync(path.join(topicsPath, file), 'utf-8');
        const { data } = matter(markdownWithMeta);
        
        return {
          title: data.title,
          slug,
        };
      });
  } catch (error) {
    console.error('Error getting all topics:', error);
    return [];
  }
}

export function findRelatedContent(
  currentPath: string,
  limit: number = 4
): { posts: RelatedContent[], articles: RelatedContent[] } {
  try {
    // Get current post's metadata
    const currentMeta = getContentMetadata(
      currentPath.startsWith('/post/') ? 'posts' : 'articles',
      currentPath.split('/').pop() as string
    );
    if (!currentMeta) return { posts: [], articles: [] };

    const currentKeywords = new Set(currentMeta.data.keywords || []);
    const currentTopic = currentPath.startsWith('/post/') ? currentMeta.data.topic : null;

    // Get all posts and articles
    const postsDir = path.join(process.cwd(), 'src/content/posts');
    const articlesDir = path.join(process.cwd(), 'src/content/articles');
    
    const posts = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '');
        const meta = getContentMetadata('posts', slug);
        if (!meta) return null;
        
        // Calculate relevance score
        const keywordOverlap = (meta.data.keywords || []).filter(k => currentKeywords.has(k)).length;
        const sameTopic = meta.data.topic === currentTopic;
        const score = keywordOverlap + (sameTopic ? 2 : 0);

        return {
          path: `/post/${slug}`,
          title: meta.data.title,
          description: meta.data.description,
          keywords: meta.data.keywords,
          image: meta.data.image,
          score
        };
      })
      .filter((post): post is NonNullable<typeof post> => post !== null && post.path !== currentPath)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ path, title, description, keywords, image }) => ({ 
        path, 
        title, 
        description, 
        keywords, 
        image 
      }));

    const articles = fs.existsSync(articlesDir) ? 
      fs.readdirSync(articlesDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const slug = file.replace('.md', '');
          const meta = getContentMetadata('articles', slug);
          if (!meta) return null;

          // Calculate relevance score
          const keywordOverlap = (meta.data.keywords || []).filter(k => currentKeywords.has(k)).length;
          const score = keywordOverlap;

          return {
            path: `/article/${slug}`,
            title: meta.data.title,
            description: meta.data.description,
            keywords: meta.data.keywords,
            image: meta.data.image,
            score
          };
        })
        .filter((article): article is NonNullable<typeof article> => article !== null && article.path !== currentPath)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ path, title, description, keywords, image }) => ({ 
          path, 
          title, 
          description, 
          keywords, 
          image 
        }))
      : [];

    return {
      posts: posts as RelatedContent[],
      articles: articles as RelatedContent[]
    };
  } catch (error) {
    console.error('Error finding related content:', error);
    return { posts: [], articles: [] };
  }
}

export async function getCTAConfig(): Promise<CTAConfig> {
  const ctaPath = path.join(process.cwd(), 'src/content/config/cta.md');
  const ctaFile = fs.readFileSync(ctaPath, 'utf-8');
  const { data } = matter(ctaFile);
  
  return {
    title: data.title,
    description: data.description,
    buttonText: data.buttonText,
    type: data.type,
    icon: data.icon,
    trackingId: data.trackingId,
    ...(data.type === 'link' && { href: data.href }),
    ...(data.type === 'email' && { email: data.email })
  };
}

export const getSiteWideCTA = getCTAConfig;

export type { ContentMetadata };
