'use client';

import { ReactNode } from 'react';
import { ConfigContext } from '@/hooks/useConfig';
import type { SiteConfig } from '@/utils/content';

interface ConfigProviderProps {
  config: SiteConfig;
  children: ReactNode;
}

export function ConfigProvider({ config, children }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
}
