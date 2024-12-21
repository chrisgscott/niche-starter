'use client';

import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  title: string;
  navigation: Array<{
    label: string;
    link: string;
  }>;
}

export function Header({ title, navigation }: HeaderProps) {
  const { config } = useConfig();
  const { getColor, classNames } = useTheme();

  return (
    <header className={classNames(
      'border-b',
      getColor('secondary', 'border'),
      getColor('secondary', 'light')
    )}>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className={classNames(
            'font-bold text-xl',
            getColor('primary', 'text')
          )}>
            {title}
          </Link>
          <div className="flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className={classNames(
                  'hover:underline',
                  getColor('secondary', 'text')
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
