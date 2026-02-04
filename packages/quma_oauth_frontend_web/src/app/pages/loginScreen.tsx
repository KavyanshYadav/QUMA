import LoginWidget from '../widgets/LoginWidget.js';
import { css } from '@emotion/react';
import { ThemeProvider, QumaGlobalStyles } from '@quma/webkit';

const LoginScreenContent = (): JSX.Element => {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr;
        @media (min-width: 1024px) {
          grid-template-columns: 1fr 1fr;
        }
        background: var(--quma-background, #0a0a0a);
        overflow: hidden;
      `}
    >
      {/* Left Panel: Promotional / Visual */}
      <div
        css={css`
          display: none;
          @media (min-width: 1024px) {
            display: flex;
          }
          flex-direction: column;
          justify-content: space-between;
          padding: 4rem;
          background: radial-gradient(
              circle at top left,
              rgba(227, 25, 55, 0.15),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              var(--quma-secondary) 0%,
              var(--quma-background) 100%
            );
          position: relative;
          color: var(--quma-foreground);
        `}
      >
        <div
          css={css`
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.05em;
          `}
        >
          QUMA
        </div>

        <div
          css={css`
            z-index: 10;
          `}
        >
          <h1
            css={css`
              font-size: 3.5rem;
              line-height: 1.1;
              font-weight: 700;
              margin-bottom: 1.5rem;
              background: linear-gradient(
                to bottom right,
                #fff 0%,
                rgba(255, 255, 255, 0.5) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            `}
          >
            Secure access for modern teams.
          </h1>
          <p
            css={css`
              font-size: 1.25rem;
              color: var(--quma-muted-foreground);
              max-width: 480px;
              line-height: 1.6;
            `}
          >
            Enterprise-grade authentication with a refined, Tesla-inspired
            aesthetic. seamless, secure, and built for scale.
          </p>
        </div>

        {/* Abstract Art Element */}
        <div
          css={css`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 60%;
            background: linear-gradient(
              45deg,
              rgba(227, 25, 55, 0.1),
              transparent
            );
            filter: blur(80px);
            border-radius: 50%;
            pointer-events: none;
          `}
        />

        <div
          css={css`
            font-size: 0.875rem;
            color: var(--quma-muted-foreground);
          `}
        >
          © 2024 Quma Inc.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        `}
      >
        <header
          css={css`
            position: absolute;
            top: 2rem;
            right: 2rem;
            display: flex;
            gap: 2rem;
          `}
        >
          <span
            css={css`
              font-size: 0.875rem;
              color: var(--quma-muted-foreground);
              cursor: pointer;
              &:hover {
                color: var(--quma-foreground);
              }
            `}
          >
            Help
          </span>
          <span
            css={css`
              font-size: 0.875rem;
              color: var(--quma-muted-foreground);
              cursor: pointer;
              &:hover {
                color: var(--quma-foreground);
              }
            `}
          >
            Privacy
          </span>
        </header>

        <div
          css={css`
            width: 100%;
            max-width: 440px;
          `}
        >
          <LoginWidget />
        </div>
      </div>
    </div>
  );
};

const LoginScreen = (): JSX.Element => {
  return (
    <ThemeProvider>
      <QumaGlobalStyles />
      <LoginScreenContent />
    </ThemeProvider>
  );
};

export default LoginScreen;
