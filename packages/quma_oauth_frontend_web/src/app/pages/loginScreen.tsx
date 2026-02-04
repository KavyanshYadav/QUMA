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
        background: ${theme.colors.background};
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
          padding: 2.5rem 3rem;
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
            gap: 4rem;
            align-items: center;
          `}
        >
          <section
            css={css`
              display: grid;
              gap: 2rem;
            `}
          >
            <div
              css={css`
                display: grid;
                gap: 1rem;
              `}
            >
              <span
                css={css`
                  font-size: 0.75rem;
                  letter-spacing: 0.35em;
                  text-transform: uppercase;
                  color: ${theme.colors.mutedForeground};
                `}
              >
                Quma Launchpad
              </span>
              <h1
                css={css`
                  margin: 0;
                  font-size: clamp(2.5rem, 3vw, 3.6rem);
                  letter-spacing: -0.02em;
                `}
              >
                A seamless, secure auth experience that feels premium.
              </h1>
              <p
                css={css`
                  margin: 0;
                  font-size: 1.05rem;
                  color: ${theme.colors.mutedForeground};
                  max-width: 520px;
                `}
              >
                Provide a frictionless login flow for global teams. Manage
                access, keep accounts secure, and onboard faster with Quma.
              </p>
            </div>

            <div
              css={css`
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 1.25rem;
              `}
            >
              {['Instant SSO', 'Audit-ready', 'Zero downtime'].map((item) => (
                <div
                  key={item}
                  css={css`
                    padding: 1.25rem;
                    border-radius: ${theme.layout.radius.lg};
                    background: ${theme.colors.secondary};
                    border: 1px solid ${theme.colors.border};
                  `}
                >
                  <h3
                    css={css`
                      margin: 0 0 0.5rem 0;
                      font-size: 1rem;
                    `}
                  >
                    {item}
                  </h3>
                  <p
                    css={css`
                      margin: 0;
                      font-size: 0.9rem;
                      color: ${theme.colors.mutedForeground};
                    `}
                  >
                    Built-in security, smooth onboarding, and instant access.
                  </p>
                </div>
              ))}
            </div>

            <div
              css={css`
                position: relative;
                border-radius: ${theme.layout.radius.xl};
                overflow: hidden;
                border: 1px solid ${theme.colors.border};
                background: linear-gradient(120deg, #111113, #2b2d30);
                min-height: 220px;
                display: grid;
                align-items: center;
                padding: 2rem;
                color: #fff;
              `}
            >
              <div
                css={css`
                  display: grid;
                  gap: 0.75rem;
                  max-width: 320px;
                `}
              >
                <span
                  css={css`
                    font-size: 0.75rem;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    opacity: 0.7;
                  `}
                >
                  Motion Preview
                </span>
                <strong
                  css={css`
                    font-size: 1.5rem;
                  `}
                >
                  Product highlight reel
                </strong>
                <p
                  css={css`
                    margin: 0;
                    opacity: 0.7;
                  `}
                >
                  Swap this panel with a hero video or product demo.
                </p>
              </div>
            </div>
          </section>

          <aside
            css={css`
              display: flex;
              justify-content: flex-end;
            `}
          >
            <LoginWidget />
          </aside>
        </div>
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
