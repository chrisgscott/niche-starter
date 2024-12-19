import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: {
    url: string;
    alt?: string;
  };
  links?: {
    topic?: string;
    related_posts?: string[];
    related_articles?: string[];
  };
}

/**
 * Get posts from the posts directory. This explicitly excludes articles (pSEO pages)
 * which are stored in the articles directory and should only be included in the sitemap.
 */
export async function getPosts(options?: {
  limit?: number;
  topic?: string;
}): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'src/content/posts');
  
  // Ensure we're only looking at posts, not articles
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        title: data.title,
        description: data.description,
        slug: data.slug,
        date: data.date,
        image: data.image,
        links: data.links,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (options?.topic) {
    const topicPath = `/topic/${options.topic}`;
    return posts.filter(post => post.links?.topic === topicPath);
  }

  return options?.limit ? posts.slice(0, options.limit) : posts;
}

/**
 * Get posts for a specific topic. This only returns posts from the posts directory,
 * not articles from the articles directory.
 */
export async function getPostsByTopic(topicSlug: string, limit?: number): Promise<Post[]> {
  const posts = await getPosts({ topic: topicSlug });
  return limit ? posts.slice(0, limit) : posts;
}
