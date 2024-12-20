import React from 'react';
import { TableOfContents } from './TableOfContents';
import { StickyCallToAction } from './cta';
import type { TOCItem } from '@/types';
import type { CTAConfig } from './cta';

interface PostSidebarProps {
  toc: TOCItem[];
  activeColor?: string;
  cta: CTAConfig;
}

export const PostSidebar: React.FC<PostSidebarProps> = ({
  toc,
  activeColor,
  cta
}) => {
  return (
    <div className="sticky top-4 space-y-6">
      <TableOfContents items={toc} className="not-sticky" activeColor={activeColor} />
      <StickyCallToAction config={cta} />
    </div>
  );
};
