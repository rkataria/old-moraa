import { nextui } from '@nextui-org/react'
import TailwindScrollbar from 'tailwind-scrollbar'
import TailwindAnimate from 'tailwindcss-animate'

// eslint-disable-next-line import/no-default-export
export default {
  darkMode: ['class'],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        typing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(2)' },
        },
      },
      animation: {
        typing: 'typing 1s ease-in-out infinite',
      },
    },
  },
  plugins: [
    TailwindAnimate,
    TailwindScrollbar,
    nextui({
      layout: {
        radius: {
          small: '2px', // rounded-small
          medium: '4px', // rounded-medium
          large: '8px', // rounded-large
        },
      },
    }),
  ],
}
