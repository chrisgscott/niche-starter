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

export function TableOfContents({ 
  items = [], 
  activeColor = 'indigo', 
  hasFaq,
  className = '' 
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // If no items, don't render anything but still maintain hook order
  if (!items?.length) {
    return null;
  }

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

    const headings = document.querySelectorAll('h2, h3');
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

  const bgColor = bgColorClasses[activeColor as keyof typeof bgColorClasses] || bgColorClasses.indigo;
  const textColor = colorClasses[activeColor as keyof typeof colorClasses] || colorClasses.indigo;

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
    <nav className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      <h2 className={`${bgColor} px-4 py-2 text-lg font-semibold border-b border-gray-200 -mx-6 -mt-6 mb-4`}>
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {items.map((heading, index) => (
          <li
            key={index}
            className={`
              ${heading.level === 2 ? '' : 'ml-4'}
              ${activeId === heading.id ? textColor : 'text-slate-600'}
            `}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => scrollToHeading(e, heading.id)}
              className={`
                block text-sm py-1
                hover:text-${activeColor}-600 transition-colors duration-200
                ${activeId === heading.id ? 'font-medium' : ''}
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
