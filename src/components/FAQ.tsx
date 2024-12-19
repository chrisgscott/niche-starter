'use client';

import { FAQItem } from '@/types/schema';

interface FAQProps {
  items: FAQItem[];
  themeColor: string;
}

export function FAQ({ items, themeColor }: FAQProps) {
  if (!items?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg border border-${themeColor}-200 p-6`}
          >
            <h3 className={`text-lg font-medium mb-3 text-${themeColor}-900`}>
              {item.question}
            </h3>
            <div className="text-slate-600">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
