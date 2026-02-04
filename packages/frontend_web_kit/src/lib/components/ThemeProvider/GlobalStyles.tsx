import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme } from './ThemeProvider.js';

export const QumaGlobalStyles = () => {
  const { theme } = useTheme();

  return (
    <Global
      styles={css`
        :root {
          color-scheme: ${theme.mode};
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: var(--quma-font-sans, ${theme.typography.fontFamily});
          background: var(--quma-background, ${theme.colors.background});
          color: var(--quma-foreground, ${theme.colors.foreground});
          line-height: ${theme.typography.lineHeight.normal};
          letter-spacing: ${theme.typography.letterSpacing.normal};
        }

        a {
          color: inherit;
          text-decoration: none;
        }
      `}
    />
  );
};

export default QumaGlobalStyles;
