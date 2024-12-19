import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: '500',
            },
            code: {
              color: 'inherit',
              background: 'var(--tw-prose-pre-bg)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
          },
        },
        blue: {
          css: {
            '--tw-prose-links': theme('colors.blue.600'),
            '--tw-prose-links-hover': theme('colors.blue.800'),
          },
        },
        green: {
          css: {
            '--tw-prose-links': theme('colors.green.600'),
            '--tw-prose-links-hover': theme('colors.green.800'),
          },
        },
        purple: {
          css: {
            '--tw-prose-links': theme('colors.purple.600'),
            '--tw-prose-links-hover': theme('colors.purple.800'),
          },
        },
        orange: {
          css: {
            '--tw-prose-links': theme('colors.orange.600'),
            '--tw-prose-links-hover': theme('colors.orange.800'),
          },
        },
        indigo: {
          css: {
            '--tw-prose-links': theme('colors.indigo.600'),
            '--tw-prose-links-hover': theme('colors.indigo.800'),
          },
        },
        amber: {
          css: {
            '--tw-prose-links': theme('colors.amber.600'),
            '--tw-prose-links-hover': theme('colors.amber.800'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
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
