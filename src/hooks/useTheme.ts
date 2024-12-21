'use client';

import { useConfig } from './useConfig';

type ColorScheme = 'primary' | 'secondary' | 'accent';
type ColorVariant = 'light' | 'dark' | 'text' | 'border';

interface ThemeUtils {
  getColorScheme: (scheme: ColorScheme) => {
    light: string;
    dark: string;
    text: string;
    border: string;
  };
  getColor: (scheme: ColorScheme, variant: ColorVariant) => string;
  classNames: (...classes: (string | undefined | null | false)[]) => string;
}

export function useTheme(): ThemeUtils {
  const { config } = useConfig();
  const { colors } = config.theme;

  const getColorScheme = (scheme: ColorScheme) => colors[scheme];

  const getColor = (scheme: ColorScheme, variant: ColorVariant) => 
    colors[scheme][variant];

  // Utility function to conditionally join class names
  const classNames = (...classes: (string | undefined | null | false)[]) => 
    classes.filter(Boolean).join(' ');

  return {
    getColorScheme,
    getColor,
    classNames
  };
}
