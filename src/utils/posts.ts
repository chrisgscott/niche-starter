import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Schema {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: {
    url: string;
    alt?: string;
  };
  links?: {
    related_posts?: string[];
    related_articles?: string[];
  };
  topic?: string;
  parent_topic?: string;
  keywords?: string[];
}

/**
 * Get posts from the posts directory. This explicitly excludes articles (pSEO pages)
 * which are stored in the articles directory and should only be included in the sitemap.
 */
export async function getPosts(options?: {
  limit?: number;
  topic?: string;
}): Promise<Schema[]> {
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
        topic: data.topic,
        parent_topic: data.parent_topic,
        keywords: data.keywords
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (options?.topic) {
    return posts.filter(post => post.topic === options.topic);
  }

  return options?.limit ? posts.slice(0, options.limit) : posts;
}

/**
 * Get posts for a specific topic. This only returns posts from the posts directory,
 * not articles from the articles directory.
 */
export async function getPostsByTopic(topicSlug: string, limit?: number): Promise<Schema[]> {
  const posts = await getPosts();
  const topicPosts = posts.filter(post => post.parent_topic === topicSlug);
  return limit ? topicPosts.slice(0, limit) : topicPosts;
}

/**
 * Find related posts for a given post based on shared topic and keywords.
 * Returns posts sorted by relevance (number of shared keywords).
 */
export async function findRelatedPosts(
  currentPost: Schema,
  limit: number = 3
): Promise<Schema[]> {
  // Get all posts
  const allPosts = await getPosts();
  
  // Remove the current post
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  // Score each post based on relevance
  const scoredPosts = otherPosts.map(post => {
    let score = 0;
    
    // Higher score for same topic
    if (post.parent_topic === currentPost.parent_topic) {
      score += 5;
    }
    
    // Score based on shared keywords
    const sharedKeywords = (post.keywords || []).filter(keyword => 
      (currentPost.keywords || []).includes(keyword)
    );
    score += sharedKeywords.length;
    
    return { post, score };
  });
  
  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
