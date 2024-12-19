'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  navigation: Array<{
    label: string;
    link: string;
  }>;
}

export function Header({ title, navigation }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="navbar min-h-16">
          <div className="navbar-start">
            <Link href="/" className="text-xl font-bold">
              {title}
            </Link>
          </div>
          <div className="navbar-end">
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`text-sm font-medium ${
                    isActive(item.link) ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
