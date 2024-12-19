import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ContentMetadata {
  title: string;
  description: string;
  slug: string;
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
      slug: normalizedPath.split('/').pop() || ''
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
  }[contentType];

  // Read and parse the markdown file
  const filePath = path.join(process.cwd(), 'src/content', contentDir, `${slug}.md`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    return {
      title: data.title || 'Untitled',
      description: data.description || 'No description available',
      slug: data.slug || slug
    };
  } catch (error) {
    console.error(`Error reading content metadata for ${contentPath}:`, error);
    return {
      title: 'Untitled',
      description: 'No description available',
      slug: slug
    };
  }
}
