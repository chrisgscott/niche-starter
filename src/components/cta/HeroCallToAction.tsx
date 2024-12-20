'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CTAConfig } from './types';
import { EmailCollectionForm } from './EmailCollectionForm';

interface HeroCallToActionProps {
  config: CTAConfig;
  className?: string;
}

export const HeroCallToAction: React.FC<HeroCallToActionProps> = ({
  config,
  className = ''
}) => {
  // Direct link CTA
  if (config.type === 'link' && config.href) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`bg-blue-50/50 border border-dashed border-blue-200 rounded-lg p-6 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900">{config.title}</h3>
                <p className="text-slate-600 mt-1 text-base leading-relaxed">{config.description}</p>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <Link 
                  href={config.href}
                  className="
                    px-4 py-2 rounded-md transition-all duration-300 
                    flex items-center justify-center gap-2
                    bg-emerald-600 text-white hover:bg-emerald-700
                  "
                >
                  <span>{config.buttonText}</span>
                  <ArrowRight className="w-5 h-5" />
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
          <div className={`bg-blue-50/50 border border-dashed border-blue-200 rounded-lg p-6 ${className}`}>
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
        <div className={`bg-blue-50/50 border border-dashed border-blue-200 rounded-lg p-6 ${className}`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-900">{config.title}</h3>
              <p className="text-slate-600 mt-1 text-base leading-relaxed">{config.description}</p>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <Link 
                href={config.href || '#'}
                className="
                  px-4 py-2 rounded-md transition-all duration-300 
                  flex items-center justify-center gap-2
                  bg-emerald-600 text-white hover:bg-emerald-700
                "
              >
                <span>{config.buttonText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
