import React from 'react';
import LoginWidget from '../widgets/LoginWidget.js';
import { css } from '@emotion/react';

function LoginScreen() {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-items: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      <header
        css={css`
          width: 100%;
        `}
      >
        <h1
          css={css`
            padding: 1rem;
          `}
        >
          LOGO
        </h1>
      </header>
      <div
        css={css`
          margin: auto;
          width: 100%;
        `}
      >
        <LoginWidget />
      </div>
      <footer
        css={css`
          padding: 1rem;

          width: 100%;
        `}
      >
        <h4>English</h4>
      </footer>
    </div>
  );
}

export default LoginScreen;
