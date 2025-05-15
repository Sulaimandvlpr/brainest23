import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				utbk: {
					blue: '#3b82f6',
					purple: '#8b5cf6',
					orange: '#f97316',
					green: '#10b981',
					red: '#ef4444',
					cyan: '#06b6d4',
					dark: '#181e2a',
					"blue-3d": '#223a7a',
					"blue-3d-light": '#3456b3',
				}
			},
			borderRadius: {
				lg: '1.5rem',
				xl: '2rem',
				full: '9999px',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'3d': '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 4px 0 rgba(59, 130, 246, 0.25)',
				'3d-hover': '0 16px 48px 0 rgba(31, 38, 135, 0.45), 0 3px 8px 0 rgba(59, 130, 246, 0.35)',
				'neon': '0 0 8px #3b82f6, 0 0 16px #06b6d4',
			},
			backgroundImage: {
				'blue-gradient': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
				'card-glass': 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.10) 100%)',
			},
			fontFamily: {
				'display': ['Poppins', 'Inter', 'sans-serif'],
				'body': ['Inter', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-error': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'glow': {
					'0%': { boxShadow: '0 0 0 0 #22d3ee' },
					'50%': { boxShadow: '0 0 32px 16px #22d3ee, 0 0 64px 32px #2563eb' },
					'100%': { boxShadow: '0 0 0 0 #22d3ee' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-error': 'pulse-error 2s ease-in-out infinite',
				'glow': 'glow 2.5s ease'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
