import { ThemeColor } from '@/types/schema';

export const themeColors = {
  blue: {
    light: 'bg-blue-100',
    dark: 'bg-blue-600',
    text: 'text-blue-600',
    textDark: 'text-blue-700',
    hover: 'hover:bg-blue-200',
    border: 'border-blue-200',
    stroke: 'stroke-blue-600'
  },
  green: {
    light: 'bg-green-100',
    dark: 'bg-green-600',
    text: 'text-green-600',
    textDark: 'text-green-700',
    hover: 'hover:bg-green-200',
    border: 'border-green-200',
    stroke: 'stroke-green-600'
  },
  purple: {
    light: 'bg-purple-100',
    dark: 'bg-purple-600',
    text: 'text-purple-600',
    textDark: 'text-purple-700',
    hover: 'hover:bg-purple-200',
    border: 'border-purple-200',
    stroke: 'stroke-purple-600'
  },
  orange: {
    light: 'bg-orange-100',
    dark: 'bg-orange-600',
    text: 'text-orange-600',
    textDark: 'text-orange-700',
    hover: 'hover:bg-orange-200',
    border: 'border-orange-200',
    stroke: 'stroke-orange-600'
  },
  indigo: {
    light: 'bg-indigo-100',
    dark: 'bg-indigo-600',
    text: 'text-indigo-600',
    textDark: 'text-indigo-700',
    hover: 'hover:bg-indigo-200',
    border: 'border-indigo-200',
    stroke: 'stroke-indigo-600'
  }
} as const;

export function getThemeColors(color: ThemeColor = 'indigo') {
  return themeColors[color];
}
