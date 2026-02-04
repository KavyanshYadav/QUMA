import { Theme } from '../../../types/index.js';
import { defaultTheme } from './defaultTheme.js';

export const darkTheme: Theme = {
  ...defaultTheme,
  name: 'Tesla Minimal Dark',
  mode: 'dark',
  colors: {
    background: '#0A0A0B',
    foreground: '#F5F5F6',
    muted: '#1C1C1E',
    mutedForeground: '#9A9CA1',
    border: '#2B2D30',
    input: '#121214',
    ring: '#F5F5F6',
    primary: '#F5F5F6',
    primaryForeground: '#0A0A0B',
    secondary: '#141416',
    secondaryForeground: '#F5F5F6',
    accent: '#E31937',
    accentForeground: '#FFFFFF',
    destructive: '#E11D48',
    destructiveForeground: '#FFFFFF',
    success: '#22C55E',
    successForeground: '#0A0A0B',
    warning: '#F8C25C',
    warningForeground: '#0A0A0B',
  },
};
