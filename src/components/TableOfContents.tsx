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
  hasFaq = false,
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
      {
        rootMargin: '-10% 0% -70% 0%',
        threshold: 0.1
      }
    );

    // Observe all headings
    document.querySelectorAll('h2, h3').forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  const bgColorClasses = {
    'indigo': 'bg-indigo-50',
    'emerald': 'bg-emerald-50',
    'blue': 'bg-blue-50',
    'purple': 'bg-purple-50',
    'amber': 'bg-amber-50',
  };

  const textColorClasses = {
    'indigo': 'text-indigo-600',
    'emerald': 'text-emerald-600',
    'blue': 'text-blue-600',
    'purple': 'text-purple-600',
    'amber': 'text-amber-600',
  };

  const bgColorClass = bgColorClasses[activeColor as keyof typeof bgColorClasses] || bgColorClasses.indigo;
  const textColorClass = textColorClasses[activeColor as keyof typeof textColorClasses] || textColorClasses.indigo;

  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
      <h3 className={`text-lg font-bold text-slate-900 p-4 mb-0 ${bgColorClass} border-b border-slate-200`}>
        Table of Contents
      </h3>
      <nav className="p-4 space-y-2">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const activeStyles = isActive ? `font-semibold ${textColorClass}` : 'text-slate-600 hover:text-slate-800';
          return (
            <a
              key={index}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                  window.history.pushState({}, '', `#${item.id}`);
                  setActiveId(item.id); // Set active immediately on click
                }
              }}
              className={`
                block text-sm
                ${item.level === 2 ? '' : 'ml-4'}
                ${activeStyles}
                hover:underline underline-offset-2
                transition-colors duration-150
              `}
            >
              {item.text}
            </a>
          );
        })}
        {hasFaq && (
          <a
            href="#common-questions"
            className={`
              block text-sm text-slate-900
              hover:text-slate-600
              hover:underline underline-offset-2
            `}
          >
            Common Questions
          </a>
        )}
      </nav>
    </div>
  );
}
