import React from 'react';
import { TableOfContents } from './TableOfContents';
import { CallToAction } from './CallToAction';
import type { TOCItem } from '@/types';

interface PostSidebarProps {
  toc: TOCItem[];
  activeColor?: string;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export const PostSidebar: React.FC<PostSidebarProps> = ({ toc, cta, activeColor }) => {
  return (
    <div className="sticky top-4 space-y-6">
      <TableOfContents items={toc} className="not-sticky" activeColor={activeColor} />
      <CallToAction 
        config={cta} 
        variant="sticky"
        layoutVariant="sticky"
      />
    </div>
  );
};
