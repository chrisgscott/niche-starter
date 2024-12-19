import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#2563eb',    // Blue-600
          secondary: '#16a34a',  // Green-600
          accent: '#9333ea',     // Purple-600
          neutral: '#3D4451',
          'base-100': '#FFFFFF',
          'base-200': '#F9FAFB',
          'base-300': '#F3F4F6',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#3b82f6',    // Blue-500
          secondary: '#22c55e',  // Green-500
          accent: '#a855f7',     // Purple-500
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false,
  },
}

export default config;
