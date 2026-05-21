/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Verde Fintech (Esmeralda Digital) — CTA, saldos positivos, estados de exito
        brand: {
          50: '#E7F8F0',
          100: '#C5EFDC',
          200: '#93E1BE',
          300: '#57CF9B',
          400: '#1FBA7C',
          500: '#00A86B',
          600: '#00915C',
          700: '#00754A',
          800: '#005C3A',
          900: '#00472D',
        },
        // Neutros corporativos: gray-50 #F9FAFB (Blanco Nieve), gray-500 #6B7280
        // (Gris Plata), gray-900 #111827 (Negro Grafito) — coinciden con Tailwind gray.
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F9FAFB',
          muted: '#F3F4F6',
          dark: '#111827',
          'dark-elevated': '#1F2937',
          'dark-muted': '#374151',
        },
        // Verde = exito (reutiliza la marca para reforzar identidad fintech)
        success: {
          50: '#E7F8F0',
          500: '#00A86B',
          600: '#00915C',
          700: '#00754A',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(17 24 39 / 0.04), 0 1px 3px 0 rgb(17 24 39 / 0.06)',
        card: '0 1px 3px 0 rgb(17 24 39 / 0.05), 0 1px 2px -1px rgb(17 24 39 / 0.04)',
        elevated:
          '0 4px 6px -1px rgb(17 24 39 / 0.06), 0 2px 4px -2px rgb(17 24 39 / 0.04)',
        floating:
          '0 10px 15px -3px rgb(17 24 39 / 0.08), 0 4px 6px -4px rgb(17 24 39 / 0.05)',
        glow: '0 0 0 1px rgb(0 168 107 / 0.12), 0 8px 24px -6px rgb(0 168 107 / 0.28)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        wave: {
          '0%, 60%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%, 50%': { transform: 'rotate(14deg)' },
          '20%, 40%': { transform: 'rotate(-8deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-in-up': 'fade-in-up 220ms ease-out',
        'scale-in': 'scale-in 180ms ease-out',
        'slide-in-right': 'slide-in-right 220ms ease-out',
        'slide-in-left': 'slide-in-left 240ms cubic-bezier(0.4, 0, 0.2, 1)',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        wave: 'wave 2.2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
