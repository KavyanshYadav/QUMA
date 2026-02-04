import { css } from '@emotion/react';
import {
  Button,
  Input,
  QumaGlobalStyles,
  ThemeProvider,
  useTheme,
} from './components';

const Content = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <main
      css={css`
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 6rem 1.5rem;
        background: radial-gradient(
            circle at top,
            rgba(227, 25, 55, 0.12),
            transparent 55%
          ),
          var(--quma-background);
      `}
    >
      <section
        css={css`
          width: min(960px, 100%);
          background: var(--quma-secondary);
          border-radius: var(--quma-radius-xl);
          border: 1px solid var(--quma-border);
          box-shadow: var(--quma-shadow-lg);
          padding: 3.5rem;
          display: grid;
          gap: 2.5rem;
        `}
      >
        <header
          css={css`
            display: grid;
            gap: 1rem;
          `}
        >
          <span
            css={css`
              font-size: 0.75rem;
              letter-spacing: 0.3em;
              text-transform: uppercase;
              color: var(--quma-muted-foreground);
            `}
          >
            Quma Webkit
          </span>
          <h1
            css={css`
              margin: 0;
              font-size: clamp(2.5rem, 4vw, 3.5rem);
              letter-spacing: -0.02em;
            `}
          >
            Minimal, elevated UI for modern product teams.
          </h1>
          <p
            css={css`
              margin: 0;
              font-size: 1.1rem;
              color: var(--quma-muted-foreground);
              max-width: 520px;
            `}
          >
            Refined, Tesla-inspired components with shadcn-powered tokens and a
            built-in theme manager.
          </p>
        </header>

        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
          `}
        >
          <Input
            id="email"
            label="Drive Mode"
            placeholder="Enter your workspace"
            helperText="Tesla-like simplicity with expressive tokens."
          />
          <Input
            id="location"
            label="Destination"
            placeholder="San Francisco"
            helperText="Subtle hints, crisp typography."
          />
        </div>

        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              display: flex;
              gap: 0.75rem;
              flex-wrap: wrap;
            `}
          >
            <Button variant="primary">Engage</Button>
            <Button variant="secondary">Preview</Button>
            <Button variant="ghost">Learn More</Button>
          </div>
          <Button variant="accent" onClick={toggleTheme}>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </section>
    </main>
  );
};

export function QumaWebkit() {
  return (
    <ThemeProvider>
      <QumaGlobalStyles />
      <Content />
    </ThemeProvider>
  );
}

export default QumaWebkit;
