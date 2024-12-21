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

interface HeroCallToActionProps {
  config: CTAConfig;
  className?: string;
}

export const HeroCallToAction: React.FC<HeroCallToActionProps> = ({
  config,
  className = ''
}) => {
  const { getColor } = useTheme();

  // Direct link CTA
  if (config.type === 'link' && config.href) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`bg-blue-100/30 border border-dashed border-blue-200 rounded-lg p-6 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900">{config.title}</h3>
                <p className="text-slate-600 mt-1 text-base leading-relaxed">{config.description}</p>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <Link 
                  href={config.href}
                  className={`
                    px-4 py-2 rounded-md transition-all duration-300 
                    flex items-center justify-center gap-2
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
      </div>
    );
  }

  // Email collection form
  if (config.type === 'email') {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`bg-blue-100/30 border border-dashed border-blue-200 rounded-lg p-6 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900">{config.title}</h3>
                <p className="text-slate-600 mt-1 text-base leading-relaxed">{config.description}</p>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <EmailCollectionForm config={config} variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default link CTA
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`bg-blue-100/30 border border-dashed border-blue-200 rounded-lg p-6 ${className}`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-900">{config.title}</h3>
              <p className="text-slate-600 mt-1 text-base leading-relaxed">{config.description}</p>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <Link 
                href={config.href || '#'}
                className={`
                  px-4 py-2 rounded-md transition-all duration-300 
                  flex items-center justify-center gap-2
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
    </div>
  );
};
