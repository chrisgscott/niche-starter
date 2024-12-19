'use client';

import Link from 'next/link';
import { Schema } from '@/types/schema';

interface RelatedContentProps {
  topic: Schema;
  posts: Array<{
    title: string;
    description: string;
    path: string;
  }>;
}

export function RelatedContent({ topic, posts }: RelatedContentProps) {
  if (!posts.length) return null;
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Related Posts</h3>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.path}>
            <Link href={post.path} className="block hover:bg-slate-50 rounded transition-colors p-2 -mx-2">
              <h4 className="font-medium text-slate-900">
                {post.title}
              </h4>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {post.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
