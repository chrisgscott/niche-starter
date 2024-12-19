'use client';

import { useEffect, useState } from 'react';
import { ThemeColor } from '@/types/schema';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  activeColor: ThemeColor;
  hasFaq?: boolean;
}

const colorClasses: Record<ThemeColor, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  indigo: 'text-indigo-600',
  amber: 'text-amber-600'
};

const bgColorClasses: Record<ThemeColor, string> = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  indigo: 'bg-indigo-50',
  amber: 'bg-amber-50'
};

export function TableOfContents({ content, activeColor, hasFaq }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    const extractedHeadings = matches.map((match) => {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      return { id, text, level };
    });

    // Add FAQ section if it exists
    if (hasFaq) {
      extractedHeadings.push({
        id: 'frequently-asked-questions',
        text: 'Frequently Asked Questions',
        level: 2
      });
    }
    
    setHeadings(extractedHeadings);
  }, [content, hasFaq]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0
      }
    );

    // Observe all section headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

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

  if (!headings.length) return null;
  
  const bgColor = bgColorClasses[activeColor] || 'bg-indigo-50';

  return (
    <nav className="w-full">
      <h2 className={`${bgColor} px-4 py-2 text-lg font-semibold border-b border-slate-200 -mx-6 -mt-6 mb-4`}>
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${Math.max(0, (heading.level - 2) * 0.75)}rem` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => scrollToHeading(e, heading.id)}
              className={`block transition-colors ${
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
