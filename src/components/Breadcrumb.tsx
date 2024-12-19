'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  topic?: {
    title: string;
    slug: string;
  };
  currentTitle: string;
}

export function Breadcrumb({ topic, currentTitle }: BreadcrumbProps) {
  const pathname = usePathname();
  const isPost = pathname.startsWith('/post/');
  const isArticle = pathname.startsWith('/article/');
  const isTopic = pathname.startsWith('/topic/');

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600">
      <Link href="/" className="hover:text-slate-900">
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      {topic && (
        <>
          <Link href={`/topic/${topic.slug}`} className="hover:text-slate-900">
            {topic.title}
          </Link>
          <ChevronRight className="w-4 h-4" />
        </>
      )}
      <span className="text-slate-900">{currentTitle}</span>
    </nav>
  );
}
