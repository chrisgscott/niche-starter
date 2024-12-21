'use client';

import { createContext, useContext } from 'react';
import { z } from 'zod';
import { siteConfigSchema } from '@/utils/validation/schemas';

type SiteConfig = z.infer<typeof siteConfigSchema>;

interface ConfigContextType {
  config: SiteConfig;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
