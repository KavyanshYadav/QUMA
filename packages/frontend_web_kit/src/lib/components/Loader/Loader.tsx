import React from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '../ThemeProvider'; // Adjust path as needed
import { Theme } from '../../types/Theme/theme'; // Adjust path as needed

// A fallback theme for standalone usage
const defaultTheme: Omit<Theme, 'mode'> = {
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#1e3a8a',
    background: '#ffffff',
    surface: '#f3f4f6', // A light gray for the shimmer
    text: '#111827',
    muted: '#e5e7eb', // A base gray for the skeleton
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  layout: {
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
    },
    spacing: (factor: number) => `${factor * 0.5}rem`,
  },
  //... other theme properties
};

// Keyframes for the shimmer animation
const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Allows overriding the default border-radius from the theme.
   * e.g., '50%' for a circle.
   */
  borderRadius?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  borderRadius,
  ...rest
}) => {
  const providedTheme = useTheme()?.theme;
  const theme = providedTheme || defaultTheme;
  console.log('skeleton', theme);
  const skeletonStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;

    background: linear-gradient(
      90deg,
      ${theme.colors.muted} 25%,
      ${theme.colors.surface} 50%,
      ${theme.colors.muted} 75%
    );
    background-size: 200% 100%;
    animation: ${shimmerAnimation} 1.2s infinite linear;

    // Use prop for border-radius or fallback to theme
    border-radius: ${borderRadius || theme.layout.borderRadius.md};
  `;

  return <div css={skeletonStyle} {...rest} />;
};
