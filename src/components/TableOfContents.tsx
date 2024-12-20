'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeColor?: string;
  hasFaq?: boolean;
  className?: string;
}

export function TableOfContents({ items, activeColor = 'indigo', hasFaq, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    const headings = document.querySelectorAll('h2, h3, h4');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  const bgColorClasses = {
    'indigo': 'bg-indigo-50',
    'emerald': 'bg-emerald-50',
    'blue': 'bg-blue-50',
    'purple': 'bg-purple-50',
  };

  const colorClasses = {
    'indigo': 'text-indigo-600',
    'emerald': 'text-emerald-600',
    'blue': 'text-blue-600',
    'purple': 'text-purple-600',
  };

  const bgColor = bgColorClasses[activeColor] || 'bg-indigo-50';

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      window.history.pushState({}, '', `#${id}`);
    }
  };

  return (
    <nav className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm overflow-hidden ${!className?.includes('not-sticky') ? 'sticky top-4' : ''} ${className}`}>
      <h2 className={`${bgColor} px-4 py-2 text-lg font-semibold border-b border-gray-200 -mx-6 -mt-6 mb-4`}>
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {items.map((heading, index) => (
          <li
            key={index}
            className={`
              ${heading.level === 2 ? '' : 'ml-4'}
              ${activeId === heading.id ? 'text-primary-600 font-medium' : 'text-gray-600'}
            `}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => scrollToHeading(e, heading.id)}
              className={`block hover:text-primary-700 transition-colors duration-150 ${
                activeId === heading.id
                  ? colorClasses[activeColor]
                  : 'text-slate-600 hover:text-slate-900'
              } ${activeId === heading.id ? 'font-medium' : ''}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
