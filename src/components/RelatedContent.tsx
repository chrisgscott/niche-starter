'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RelatedContent as RelatedContentType } from '@/types/schema';

interface RelatedContentProps {
  posts: RelatedContentType[];
  articles: RelatedContentType[];
}

export function RelatedContent({ posts, articles }: RelatedContentProps) {
  if (posts.length === 0 && articles.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Related Content</h2>
      <div className="space-y-4">
        {posts.map((post, index) => post && (
          <Link
            key={index}
            href={post.path}
            className="flex gap-4 group"
          >
            {post.image && (
              <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={post.image.url}
                  alt={post.image.alt || ''}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-slate-900 group-hover:text-slate-600">
                {post.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
        {articles.map((article, index) => article && (
          <Link
            key={`article-${index}`}
            href={article.path}
            className="flex gap-4 group"
          >
            {article.image && (
              <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={article.image.url}
                  alt={article.image.alt || ''}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-slate-900 group-hover:text-slate-600">
                {article.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
