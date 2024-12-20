'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Mail, ExternalLink, Gift, BookOpen } from 'lucide-react';
import { CTAConfig } from './types';
import { EmailCollectionForm } from './EmailCollectionForm';

interface StickyCallToActionProps {
  config: CTAConfig;
  className?: string;
}

const icons = {
  'download': Download,
  'mail': Mail,
  'external': ExternalLink,
  'gift': Gift,
  'arrow': ArrowRight,
  'book': BookOpen
} as const;

export const StickyCallToAction: React.FC<StickyCallToActionProps> = ({
  config,
  className = ''
}) => {
  // Direct link CTA
  if (config.type === 'link' && config.href) {
    return (
      <div className="w-full">
        <div className={`bg-blue-50/50 border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{config.title}</h3>
              <p className="text-slate-600 mt-1 text-sm leading-relaxed">{config.description}</p>
            </div>
            <div>
              <Link 
                href={config.href}
                className="
                  px-4 py-2 rounded-md transition-all duration-300 
                  flex items-center justify-center gap-2
                  bg-emerald-600 text-white hover:bg-emerald-700
                  w-full
                "
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
  if (config.type === 'email') {
    return (
      <div className="w-full">
        <div className={`bg-blue-50/50 border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{config.title}</h3>
              <p className="text-slate-600 mt-1 text-sm leading-relaxed">{config.description}</p>
            </div>
            <div>
              <EmailCollectionForm config={config} variant="sticky" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default CTA
  return (
    <div className="w-full">
      <div className={`bg-blue-50/50 border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{config.title}</h3>
            <p className="text-slate-600 mt-1 text-sm leading-relaxed">{config.description}</p>
          </div>
          <div>
            <Link
              href={config.href || '#'}
              className="
                px-4 py-2 rounded-md transition-all duration-300 
                flex items-center justify-center gap-2
                bg-emerald-600 text-white hover:bg-emerald-700
                w-full
              "
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
};
