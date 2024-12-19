'use client';

import { useEffect, useState } from 'react';
import { ContentCard } from './ContentCard';
import { Post } from '@/utils/posts';

interface PostGridProps {
  posts: Post[];
  postsPerPage?: number;
}

export function PostGrid({ posts, postsPerPage = 12 }: PostGridProps) {
  const [visiblePosts, setVisiblePosts] = useState<Post[]>(posts.slice(0, postsPerPage));
  const [hasMore, setHasMore] = useState(posts.length > postsPerPage);

  const loadMore = () => {
    const currentLength = visiblePosts.length;
    const nextPosts = posts.slice(currentLength, currentLength + postsPerPage);
    setVisiblePosts(current => [...current, ...nextPosts]);
    setHasMore(currentLength + postsPerPage < posts.length);
  };

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post, index) => (
          <ContentCard
            key={`${post.slug}-${index}`}
            title={post.title}
            description={post.description}
            image={post.image}
            href={`/post/${post.slug}`}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}
