import { Theme } from '../../../types';
import { defaultTheme } from './deafaultTheme';

export const darkTheme: Theme = {
  ...defaultTheme,
  mode: 'dark',
  colors: {
    primary: '#3B82F6',
    secondary: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    success: '#22C55E',
    danger: '#F87171',
    accent: '#60A5FA',
    muted: '#475569',
    warning: '#FBBF24',
  },
};
