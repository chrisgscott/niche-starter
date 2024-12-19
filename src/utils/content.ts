import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ContentMetadata {
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
  };
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
  const configPath = path.join(process.cwd(), 'src/content/config/site.md');
  const fileContent = fs.readFileSync(configPath, 'utf-8');
  const { data } = matter(fileContent);
  return data as SiteConfig;
}

export function getContentMetadata(contentPath: string): ContentMetadata | null {
  try {
    // Extract content type and slug from path
    const [, type, slug] = contentPath.split('/');
    if (!type || !slug) {
      console.warn(`Invalid content path: ${contentPath}`);
      return null;
    }

    // Convert type to plural for directory name
    const dirName = type === 'post' ? 'posts' : 
                   type === 'topic' ? 'topics' : 
                   type === 'article' ? 'articles' : type;
    
    const filePath = path.join(process.cwd(), 'src/content', dirName, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Content file not found: ${filePath}`);
      return null;
    }

    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(markdownWithMeta);

    return {
      title: data.title,
      description: data.description,
      slug: data.slug || slug,
      keywords: data.keywords || [],
      topic: data.topic,
      image: data.image,
      links: data.links
    };
  } catch (error) {
    console.error(`Error reading content metadata for ${contentPath}:`, error);
    return null;
  }
}

/**
 * Get topic data from a topic slug
 */
export function getTopicData(topicSlug: string) {
  try {
    const topicPath = path.join(process.cwd(), 'src/content/topics', `${topicSlug}.md`);
    const topicContent = fs.readFileSync(topicPath, 'utf-8');
    const { data } = matter(topicContent);
    return {
      title: data.title,
      slug: topicSlug
    };
  } catch (error) {
    console.error(`Error getting topic data for ${topicSlug}:`, error);
    return undefined;
  }
}

export function findRelatedContent(
  currentPath: string,
  limit: number = 4
): { posts: RelatedContent[], articles: RelatedContent[] } {
  try {
    // Get current post's metadata
    const currentMeta = getContentMetadata(currentPath);
    if (!currentMeta) return { posts: [], articles: [] };

    const currentKeywords = new Set(currentMeta.keywords || []);
    const currentTopic = currentPath.startsWith('/post/') ? currentMeta.topic : null;

    // Get all posts and articles
    const postsDir = path.join(process.cwd(), 'src/content/posts');
    const articlesDir = path.join(process.cwd(), 'src/content/articles');
    
    const posts = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '');
        const meta = getContentMetadata(`/post/${slug}`);
        if (!meta) return null;
        
        // Calculate relevance score
        const keywordOverlap = (meta.keywords || []).filter(k => currentKeywords.has(k)).length;
        const sameTopic = meta.topic === currentTopic;
        const score = keywordOverlap + (sameTopic ? 2 : 0);

        return {
          path: `/post/${slug}`,
          title: meta.title,
          description: meta.description,
          keywords: meta.keywords,
          image: meta.image,
          score
        };
      })
      .filter(post => post && post.path !== currentPath)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, limit)
      .map(({ path, title, description, keywords, image }) => ({ path, title, description, keywords, image }));

    const articles = fs.existsSync(articlesDir) ? 
      fs.readdirSync(articlesDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const slug = file.replace('.md', '');
          const meta = getContentMetadata(`/article/${slug}`);
          if (!meta) return null;

          // Calculate relevance score
          const keywordOverlap = (meta.keywords || []).filter(k => currentKeywords.has(k)).length;
          const score = keywordOverlap;

          return {
            path: `/article/${slug}`,
            title: meta.title,
            description: meta.description,
            keywords: meta.keywords,
            image: meta.image,
            score
          };
        })
        .filter(article => article && article.path !== currentPath)
        .sort((a, b) => b!.score - a!.score)
        .slice(0, limit)
        .map(({ path, title, description, keywords, image }) => ({ path, title, description, keywords, image }))
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
