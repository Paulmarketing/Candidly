import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        accent: '#5b7cf6',
        accent2: '#7c9ef8',
        purple: '#9b8ef8',
        success: '#34c98a',
        warn: '#f5a623',
        danger: '#f25f5c',
        text1: '#1a1a2e',
        text2: '#4a4f72',
        text3: '#8890b0',
      },
      borderRadius: {
        card: '18px',
        secondary: '12px',
        pill: '40px',
      },
      backdropBlur: {
        glass: '24px',
      },
    },
  },
  plugins: [],
}

export default config
