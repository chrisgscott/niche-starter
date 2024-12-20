import { NextResponse } from 'next/server';
import { getContentMetadata } from '@/utils/content';
import path from 'path';

const POSTS_PER_PAGE = 12;

interface PostData {
  title: string;
  description: string;
  path: string;
  image?: {
    url: string;
    alt?: string;
  };
  date?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * POSTS_PER_PAGE;

  try {
    console.log(`[API] Getting topic metadata for slug: ${params.slug}`);
    const topic = await getContentMetadata('topics', params.slug);
    if (!topic) {
      console.log(`[API] Topic not found: ${params.slug}`);
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const postSlugs = topic.data.links?.posts || [];
    console.log(`[API] Found post slugs:`, postSlugs);
    
    // Get all posts data
    const posts = await Promise.all(
      postSlugs.map(async (postPath: string) => {
        const slug = path.basename(postPath);
        console.log(`[API] Getting post metadata for slug: ${slug}`);
        const post = await getContentMetadata('posts', slug);
        if (!post) {
          console.log(`[API] Post not found: ${slug}`);
          return null;
        }
        
        return {
          title: post.data.title,
          description: post.data.description,
          path: postPath,
          image: post.data.image,
          date: post.data.date
        };
      })
    );

    // Filter out any null posts and paginate
    const validPosts = posts.filter(post => post !== null);
    const paginatedPosts = validPosts.slice(offset, offset + POSTS_PER_PAGE);
    
    console.log(`[API] Returning ${paginatedPosts.length} posts`);
    return NextResponse.json({
      posts: paginatedPosts,
      total: validPosts.length,
      hasMore: offset + POSTS_PER_PAGE < validPosts.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
