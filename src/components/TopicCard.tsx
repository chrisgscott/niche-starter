'use client';

import Link from 'next/link';
import { Briefcase, Megaphone, Camera, Aperture, ArrowRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const icons = {
  briefcase: Briefcase,
  megaphone: Megaphone,
  camera: Camera,
  aperture: Aperture
} as const;

interface Post {
  title: string;
  link: string;
}

interface TopicCardProps {
  title: string;
  description: string;
  theme: {
    icon: keyof typeof icons;
  };
  recentPosts: Post[];
  slug: string;
}

export function TopicCard({ title, description, theme, recentPosts, slug }: TopicCardProps) {
  const { getColor, classNames } = useTheme();
  const Icon = icons[theme.icon];

  return (
    <div className={classNames(
      'rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col',
      getColor('primary', 'border')
    )}>
      <Link
        href={`/topic/${slug}`}
        className={classNames(
          getColor('primary', 'light'),
          'p-4 block hover:bg-opacity-75 transition-colors'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={classNames(
            getColor('primary', 'dark'),
            'p-2 rounded-lg'
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className={classNames(
            'font-semibold',
            getColor('primary', 'text')
          )}>{title}</h3>
        </div>
      </Link>
      <div className="p-6 bg-slate-25 bg-gray-50/50 flex-grow">
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          href={`/topic/${slug}`}
          className={`inline-flex items-center ${getColor('primary', 'text')} hover:underline font-medium`}
        >
          Explore {title} →
        </Link>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h4>
          <ul className="space-y-3">
            {recentPosts.map((post, index) => (
              <li key={index}>
                <Link
                  href={post.link}
                  className={`group flex items-center gap-2 text-gray-600 hover:text-gray-900`}
                >
                  <ArrowRight className={`w-4 h-4 ${getColor('primary', 'text')} transition-transform group-hover:translate-x-1`} />
                  <span className="text-sm hover:underline">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
