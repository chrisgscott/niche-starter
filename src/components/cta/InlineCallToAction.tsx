'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Mail, ExternalLink, Gift, BookOpen } from 'lucide-react';
import { CTAConfig } from './types';
import { EmailCollectionForm } from './EmailCollectionForm';
import { useTheme } from '@/hooks/useTheme';

const icons = {
  'download': Download,
  'mail': Mail,
  'external': ExternalLink,
  'gift': Gift,
  'arrow': ArrowRight,
  'book': BookOpen
} as const;

interface InlineCallToActionProps {
  config: CTAConfig;
  className?: string;
}

export const InlineCallToAction: React.FC<InlineCallToActionProps> = ({
  config,
  className = ''
}) => {
  const { getColor } = useTheme();

  // Direct link CTA
  if (config.type === 'link' && config.href) {
    return (
      <div className="w-full">
        <div className={`bg-blue-50/50 border border-dashed border-blue-200 rounded-lg p-4 my-8 ${className}`}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{config.title}</h3>
              <p className="text-slate-600 mt-1 text-sm leading-relaxed">{config.description}</p>
            </div>
            <div>
              <Link 
                href={config.href}
                className={`
                  px-4 py-2 rounded-md transition-all duration-300 
                  inline-flex items-center justify-center gap-2
                  ${getColor('accent', 'dark')} text-white hover:opacity-90
                `}
              >
                {(() => {
                  const Icon = icons[config.icon ?? 'arrow'];
                  return <Icon className="w-5 h-5" />;
                })()}
                <span>{config.buttonText}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email collection form
  return (
    <div className="w-full">
      <div className={`bg-blue-50/50 border border-dashed border-blue-200 rounded-lg p-4 my-8 ${className}`}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{config.title}</h3>
            <p className="text-slate-600 mt-1 text-sm leading-relaxed">{config.description}</p>
          </div>
          <div>
            <EmailCollectionForm config={config} variant="inline" />
          </div>
        </div>
      </div>
    </div>
  );
};
