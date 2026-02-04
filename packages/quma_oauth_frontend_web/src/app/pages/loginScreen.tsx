import React from 'react';
import LoginWidget from '../widgets/LoginWidget.js';
import { css } from '@emotion/react';
import { useTheme } from '@quma/webkit';

function LoginScreen() {
  const { theme } = useTheme();

  return (
    <div
      css={css`
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr auto;
        background: radial-gradient(
            circle at top,
            rgba(227, 25, 55, 0.18),
            transparent 55%
          ),
          ${theme.colors.background};
        color: ${theme.colors.foreground};
      `}
    >
      <header
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem 0;
        `}
      >
        <div
          css={css`
            font-size: 1rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: ${theme.colors.mutedForeground};
          `}
        >
          Quma
        </div>
        <span
          css={css`
            font-size: 0.9rem;
            color: ${theme.colors.mutedForeground};
          `}
        >
          Secure access
        </span>
      </header>

      <main
        css={css`
          display: grid;
          align-items: center;
          padding: 2rem 1.5rem;
        `}
      >
        <LoginWidget />
      </main>

      <footer
        css={css`
          padding: 1rem 3rem 2rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: ${theme.colors.mutedForeground};
        `}
      >
        <span>© 2024 Quma</span>
        <span>English · Privacy · Terms</span>
      </footer>
    </div>
  );
}

export default LoginScreen;
