'use client';

import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';
import { useTheme } from '@/hooks/useTheme';
import { Twitter, Facebook, Instagram } from 'lucide-react';

const socialIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram
} as const;

interface FooterConfig {
  company: {
    name: string;
    description: string;
  };
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  resources: {
    title: string;
    links: Array<{
      label: string;
      link: string;
    }>;
  };
  legal: {
    title: string;
    links: Array<{
      label: string;
      link: string;
    }>;
  };
  copyright: string;
}

interface FooterProps {
  config: FooterConfig;
}

const defaultConfig: FooterConfig = {
  company: {
    name: 'Photography Business Guide',
    description: 'Your complete guide to starting and growing a successful photography business.'
  },
  social: {},
  resources: {
    title: 'Resources',
    links: []
  },
  legal: {
    title: 'Legal',
    links: []
  },
  copyright: '2023 Photography Business Guide. All rights reserved.'
};

export function Footer({ config = defaultConfig }: FooterProps) {
  const { getColor, classNames } = useTheme();

  return (
    <footer className={classNames(
      'border-t',
      getColor('secondary', 'border'),
      getColor('secondary', 'light')
    )}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className={classNames(
              'text-lg font-semibold mb-4',
              getColor('primary', 'text')
            )}>
              {config.company.name}
            </h3>
            <p className={classNames(
              'mb-4',
              getColor('secondary', 'text')
            )}>
              {config.company.description}
            </p>
            <div className="flex gap-4">
              {Object.entries(config.social).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIcons[platform as keyof typeof socialIcons];
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      'p-2 rounded-full transition-colors',
                      getColor('primary', 'light'),
                      'hover:' + getColor('primary', 'dark').replace('bg-', '')
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className={classNames(
              'text-lg font-semibold mb-4',
              getColor('primary', 'text')
            )}>
              {config.resources.title}
            </h3>
            <ul className="space-y-2">
              {config.resources.links.map((link) => (
                <li key={link.link}>
                  <Link
                    href={link.link}
                    className={classNames(
                      'hover:underline',
                      getColor('secondary', 'text')
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className={classNames(
              'text-lg font-semibold mb-4',
              getColor('primary', 'text')
            )}>
              {config.legal.title}
            </h3>
            <ul className="space-y-2">
              {config.legal.links.map((link) => (
                <li key={link.link}>
                  <Link
                    href={link.link}
                    className={classNames(
                      'hover:underline',
                      getColor('secondary', 'text')
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={classNames(
          'mt-12 pt-8 border-t text-center',
          getColor('secondary', 'border'),
          getColor('secondary', 'text')
        )}>
          {config.copyright}
        </div>
      </div>
    </footer>
  );
}
