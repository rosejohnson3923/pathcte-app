import { tokens } from '../shared/src/design-system/tokens';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors from design tokens
      colors: {
        ...tokens.colors,
        // Semantic color aliases
        primary: tokens.colors.purple,
        secondary: tokens.colors.teal,
        success: tokens.colors.green,
        danger: tokens.colors.red,
        warning: tokens.colors.amber,
      },
      // Semantic backgrounds using CSS variables (theme-aware)
      backgroundColor: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'bg-elevated': 'var(--color-bg-elevated)',
        'glass-bg-base': 'var(--glass-bg-base)',
        'glass-bg-elevated': 'var(--glass-bg-elevated)',
        'glass-bg-subtle': 'var(--glass-bg-subtle)',
      },
      // Semantic text colors using CSS variables (theme-aware)
      textColor: {
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-inverse': 'var(--color-text-inverse)',
      },
      // Semantic border colors using CSS variables (theme-aware)
      borderColor: {
        'border-default': 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        'border-subtle': 'var(--color-border-subtle)',
        'glass-border': 'var(--glass-border)',
      },
      // Spacing from design tokens
      spacing: {
        ...tokens.spacing,
      },
      // Typography from design tokens
      fontFamily: {
        ...tokens.typography.fontFamily,
        display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        ...tokens.typography.fontSize,
      },
      fontWeight: {
        ...tokens.typography.fontWeight,
      },
      lineHeight: {
        ...tokens.typography.lineHeight,
      },
      letterSpacing: {
        ...tokens.typography.letterSpacing,
      },
      // Border radius from design tokens
      borderRadius: {
        ...tokens.borders.radius,
      },
      // Shadows from design tokens
      boxShadow: {
        ...tokens.shadows,
        // Custom glow effects for game UI
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.5)',
        'glow-md': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
      },
      // Animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'slide-out': 'slideOut 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      // Breakpoints
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
