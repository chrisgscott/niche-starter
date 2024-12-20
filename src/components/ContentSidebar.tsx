import React from 'react';
import { TableOfContents } from './TableOfContents';
import { StickyCallToAction } from './cta/StickyCallToAction';
import type { TOCItem } from '@/types';
import type { CTAConfig } from './cta/types';

interface ContentSidebarProps {
  toc: TOCItem[];
  activeColor?: string;
  cta: CTAConfig;
  hasFaq?: boolean;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({
  toc,
  activeColor,
  cta,
  hasFaq = false
}) => {
  return (
    <aside className="md:col-span-1">
      <div className="sticky top-8 space-y-8">
        <TableOfContents 
          items={toc} 
          activeColor={activeColor} 
          hasFaq={hasFaq}
        />

        {/* Sticky CTA */}
        <StickyCallToAction config={cta} />
      </div>
    </aside>
  );
};
