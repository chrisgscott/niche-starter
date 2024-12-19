import { NextResponse } from 'next/server';
import { getContentMetadata } from '@/utils/content';
import path from 'path';

const POSTS_PER_PAGE = 12;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * POSTS_PER_PAGE;

  try {
    const topic = await getContentMetadata('topics', params.slug);
    const postSlugs = topic.data.links?.posts || [];
    
    // Get all posts data
    const posts = await Promise.all(
      postSlugs.map(async (postPath: string) => {
        const slug = path.basename(postPath);
        const post = await getContentMetadata('posts', slug);
        return {
          title: post.data.title,
          description: post.data.description,
          path: postPath,
          image: post.data.image,
          date: post.data.date
        };
      })
    );

    // Paginate posts
    const paginatedPosts = posts.slice(offset, offset + POSTS_PER_PAGE);
    const hasMore = offset + POSTS_PER_PAGE < posts.length;

    return NextResponse.json({
      posts: paginatedPosts,
      hasMore,
      total: posts.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
