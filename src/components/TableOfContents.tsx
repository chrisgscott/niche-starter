'use client';

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeColor?: string;
  className?: string;
  hasFaq?: boolean;
}

export function TableOfContents({ 
  items = [], 
  activeColor = 'indigo', 
  className = '',
  hasFaq = false
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [activeH2Id, setActiveH2Id] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            // If this is an h3, find its parent h2 and set it as active
            const h3Element = entry.target;
            if (h3Element.tagName.toLowerCase() === 'h3') {
              let currentElement = h3Element.previousElementSibling;
              while (currentElement) {
                if (currentElement.tagName.toLowerCase() === 'h2') {
                  setActiveH2Id(currentElement.id);
                  break;
                }
                currentElement = currentElement.previousElementSibling;
              }
            } else if (h3Element.tagName.toLowerCase() === 'h2') {
              setActiveH2Id(h3Element.id);
            }
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

  // Group items by their parent h2
  const groupedItems = items.reduce((acc, item) => {
    if (item.level === 2) {
      acc.push({ h2: item, h3s: [] });
    } else if (item.level === 3 && acc.length > 0) {
      acc[acc.length - 1].h3s.push(item);
    }
    return acc;
  }, [] as { h2: TOCItem, h3s: TOCItem[] }[]);

  return (
    <div className={`bg-white rounded-lg border border-slate-200 transition-all duration-300 ease-in-out ${className}`}>
      <h3 className={`text-lg font-bold text-slate-900 p-4 mb-0 ${bgColorClass} border-b border-slate-200`}>
        Table of Contents
      </h3>
      <nav className="p-4">
        <div className="space-y-3">
          {groupedItems.map(({ h2, h3s }, index) => {
            const isH2Active = activeH2Id === h2.id;
            const h2ActiveStyles = activeId === h2.id ? `font-semibold ${textColorClass}` : 'text-slate-600 hover:text-slate-800';
            
            return (
              <div key={index}>
                <a
                  href={`#${h2.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(h2.id);
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                      window.history.pushState({}, '', `#${h2.id}`);
                      setActiveId(h2.id);
                      setActiveH2Id(h2.id);
                    }
                  }}
                  className={`
                    block text-sm
                    ${h2ActiveStyles}
                    hover:underline underline-offset-2
                    transition-colors duration-150
                  `}
                >
                  {h2.text}
                </a>
                
                {/* Only add expansion container if there are h3s */}
                {h3s.length > 0 && (
                  <div 
                    className={`
                      ml-4 transition-all duration-300 ease-in-out
                      ${isH2Active ? 'opacity-100 h-auto mt-3' : 'opacity-0 h-0 mt-0'}
                      overflow-hidden
                    `}
                  >
                    <div className="space-y-3">
                      {h3s.map((h3, h3Index) => {
                        const isActive = activeId === h3.id;
                        const activeStyles = isActive ? `font-semibold ${textColorClass}` : 'text-slate-600 hover:text-slate-800';
                        
                        return (
                          <a
                            key={h3Index}
                            href={`#${h3.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(h3.id);
                              if (element) {
                                element.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'start'
                                });
                                window.history.pushState({}, '', `#${h3.id}`);
                                setActiveId(h3.id);
                              }
                            }}
                            className={`
                              block text-sm
                              ${activeStyles}
                              hover:underline underline-offset-2
                              transition-colors duration-150
                            `}
                          >
                            {h3.text}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
