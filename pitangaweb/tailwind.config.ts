import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

const config: Config = {
  darkMode: ['class'],
    content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
  	extend: {
  		transitionProperty: {
  			bottom: 'bottom',
  			height: 'height'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			neutral: {
  				50: 'hsl(var(--neutral-50))',
  				100: 'hsl(var(--neutral-100))',
  				200: 'hsl(var(--neutral-200))',
  				300: 'hsl(var(--neutral-300))',
  				400: 'hsl(var(--neutral-400))',
  				500: 'hsl(var(--neutral-500))',
  				600: 'hsl(var(--neutral-600))',
  				700: 'hsl(var(--neutral-700))',
  				800: 'hsl(var(--neutral-800))',
  				900: 'hsl(var(--neutral-900))'
  			},
  			primary: {
  				50: 'hsl(var(--primary-50))',
  				100: 'hsl(var(--primary-100))',
  				200: 'hsl(var(--primary-200))',
  				300: 'hsl(var(--primary-300))',
  				400: 'hsl(var(--primary-400))',
  				500: 'hsl(var(--primary-500))',
  				600: 'hsl(var(--primary-600))',
  				700: 'hsl(var(--primary-700))',
  				800: 'hsl(var(--primary-800))',
  				900: 'hsl(var(--primary-900))',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				50: 'hsl(var(--secondary-50))',
  				100: 'hsl(var(--secondary-100))',
  				200: 'hsl(var(--secondary-200))',
  				300: 'hsl(var(--secondary-300))',
  				400: 'hsl(var(--secondary-400))',
  				500: 'hsl(var(--secondary-500))',
  				600: 'hsl(var(--secondary-600))',
  				700: 'hsl(var(--secondary-700))',
  				800: 'hsl(var(--secondary-800))',
  				900: 'hsl(var(--secondary-900))',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				50: 'hsl(var(--accent-50))',
  				100: 'hsl(var(--accent-100))',
  				200: 'hsl(var(--accent-200))',
  				300: 'hsl(var(--accent-300))',
  				400: 'hsl(var(--accent-400))',
  				500: 'hsl(var(--accent-500))',
  				600: 'hsl(var(--accent-600))',
  				700: 'hsl(var(--accent-700))',
  				800: 'hsl(var(--accent-800))',
  				900: 'hsl(var(--accent-900))',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
        complementary: {
  				50: 'hsl(var(--complementary-50))',
  				100: 'hsl(var(--complementary-100))',
  				200: 'hsl(var(--complementary-200))',
  				300: 'hsl(var(--complementary-300))',
  				400: 'hsl(var(--complementary-400))',
  				500: 'hsl(var(--complementary-500))',
  				600: 'hsl(var(--complementary-600))',
  				700: 'hsl(var(--complementary-700))',
  				800: 'hsl(var(--complementary-800))',
  				900: 'hsl(var(--complementary-900))',
          DEFAULT: 'hsl(var(--complementary))',
  				foreground: 'hsl(var(--complementary-foreground))'
  			},
  			success: {
  				50: 'hsl(var(--success-50))',
  				100: 'hsl(var(--success-100))',
  				200: 'hsl(var(--success-200))',
  				300: 'hsl(var(--success-300))',
  				400: 'hsl(var(--success-400))',
  				500: 'hsl(var(--success-500))',
  				600: 'hsl(var(--success-600))',
  				700: 'hsl(var(--success-700))',
  				800: 'hsl(var(--success-800))',
  				900: 'hsl(var(--success-900))',
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			error: {
  				50: 'hsl(var(--error-50))',
  				100: 'hsl(var(--error-100))',
  				200: 'hsl(var(--error-200))',
  				300: 'hsl(var(--error-300))',
  				400: 'hsl(var(--error-400))',
  				500: 'hsl(var(--error-500))',
  				600: 'hsl(var(--error-600))',
  				700: 'hsl(var(--error-700))',
  				800: 'hsl(var(--error-800))',
  				900: 'hsl(var(--error-900))',
  				DEFAULT: 'hsl(var(--error))',
  				foreground: 'hsl(var(--error-foreground))'
  			},
  			warning: {
  				50: 'hsl(var(--warning-50))',
  				100: 'hsl(var(--warning-100))',
  				200: 'hsl(var(--warning-200))',
  				300: 'hsl(var(--warning-300))',
  				400: 'hsl(var(--warning-400))',
  				500: 'hsl(var(--warning-500))',
  				600: 'hsl(var(--warning-600))',
  				700: 'hsl(var(--warning-700))',
  				800: 'hsl(var(--warning-800))',
  				900: 'hsl(var(--warning-900))',
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [animate],
}

export default config;
