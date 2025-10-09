// src/theme/defaultTheme.ts
import { Theme } from '../../../types/index';

export const defaultTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#2563EB',
    secondary: '#64748B',
    background: '#FFFFFF',
    surface: '#F3F4F6',
    text: '#111827',
    success: '#22C55E',
    danger: '#EF4444',
    accent: '#3B82F6',
    muted: '#bebfc0ff',
    warning: '#F59E0B',
  },

  layout: {
    borderRadius: {
      sm: '4px',
      md: '9999px',
      lg: '12px',
      full: '',
    },
    spacing: (factor) => `${factor * 8}px`,
    containerWidth: {
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '2.5rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      normal: '1.5',
      tight: '1.1',
      relaxed: '1.2',
    },
  },
  effects: {
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.15)',
    },
    transitions: {
      fast: 'all 0.1s ease-in-out',
      normal: 'all 0.2s ease-in-out',
      slow: 'all 0.4s ease-in-out',
    },
  },
  breakpoints: {
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
};
