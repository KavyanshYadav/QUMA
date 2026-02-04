import { css, keyframes } from '@emotion/react';
import { Button, Input, useTheme } from '@quma/webkit';
import React from 'react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ViewState = 'login' | 'signup' | 'forgot' | 'verify';

type FieldErrors = Partial<
  Record<'name' | 'email' | 'password' | 'confirm' | 'code', string>
>;

const getViewFromUrl = (): ViewState => {
  if (typeof window === 'undefined') return 'login';
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  if (mode === 'signup') return 'signup';
  return 'login';
};

const updateUrlMode = (mode: 'login' | 'signup') => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('mode', mode);
  window.history.replaceState({}, '', url);
};

const useAuthForm = () => {
  const [view, setView] = React.useState<ViewState>(getViewFromUrl());
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    code: '',
    remember: true,
  });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [status, setStatus] = React.useState<string>('');

  React.useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const update = (key: keyof typeof values, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const switchView = (next: ViewState) => {
    setErrors({});
    setStatus('');
    setView(next);
    if (next === 'login' || next === 'signup') {
      updateUrlMode(next);
    }
  };

  const validate = (current: ViewState) => {
    const nextErrors: FieldErrors = {};

    if (!emailPattern.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (current === 'signup') {
      if (!values.name.trim()) {
        nextErrors.name = 'Enter your full name.';
      }
      if (values.password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters.';
      }
      if (values.password !== values.confirm) {
        nextErrors.confirm = 'Passwords do not match.';
      }
    }

    if (current === 'login') {
      if (values.password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters.';
      }
    }

    if (current === 'forgot') {
      if (!values.email) {
        nextErrors.email = 'Enter the email you used to sign up.';
      }
    }

    if (current === 'verify') {
      if (!values.code || values.code.length < 6) {
        nextErrors.code = 'Enter the 6-digit verification code.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (current: ViewState) => {
    if (!validate(current)) return;

    if (current === 'signup') {
      setStatus('We sent a verification code to your email.');
      switchView('verify');
      return;
    }

    if (current === 'forgot') {
      setStatus('Reset instructions are on the way.');
      switchView('verify');
      return;
    }

    if (current === 'verify') {
      setStatus('Email verified. Welcome back!');
      switchView('login');
      return;
    }

    setStatus('Login successful. Redirecting...');
  };

  return {
    view,
    values,
    errors,
    status,
    update,
    switchView,
    handleSubmit,
  };
};

const Field = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  helper,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
}) => {
  const { theme } = useTheme();

  return (
    <Input
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      helperText={error ?? helper}
      sx={css`
        input {
          border-color: ${error
            ? theme.colors.destructive
            : theme.colors.border};
        }
      `}
    />
  );
};

function LoginWidget() {
  const { theme } = useTheme();
  const { view, values, errors, status, update, switchView, handleSubmit } =
    useAuthForm();
  const [transitionKey, setTransitionKey] = React.useState(0);

  React.useEffect(() => {
    setTransitionKey((prev) => prev + 1);
  }, [view]);

  const titleMap: Record<ViewState, string> = {
    login: 'Welcome back',
    signup: 'Create your account',
    forgot: 'Reset your password',
    verify: 'Verify your email',
  };

  const descriptionMap: Record<ViewState, string> = {
    login: 'Enter your credentials to access the Quma console.',
    signup: 'Join Quma with a single account and secure access.',
    forgot: 'We will send you a secure reset link and code.',
    verify: 'Enter the 6-digit code sent to your email.',
  };

  const fadeSlide = keyframes`
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  return (
    <div
      css={css`
        width: min(460px, 100%);
        padding: 2.75rem 2.5rem;
        display: grid;
        gap: 2rem;
        background: ${theme.colors.secondary};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.layout.radius.xl};
        box-shadow: ${theme.effects.shadows.lg};
      `}
    >
      <div
        key={`head-${transitionKey}`}
        css={css`
          display: grid;
          gap: 0.75rem;
          animation: ${fadeSlide} 360ms ease;
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
          Quma Auth
        </span>
        <h1
          css={css`
            margin: 0;
            font-size: clamp(1.8rem, 2vw, 2.4rem);
          `}
        >
          {titleMap[view]}
        </h1>
        <p
          css={css`
            margin: 0;
            color: ${theme.colors.mutedForeground};
          `}
        >
          {descriptionMap[view]}
        </p>
      </div>

      <form
        key={`form-${transitionKey}`}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(view);
        }}
        css={css`
          display: grid;
          gap: 1.5rem;
          animation: ${fadeSlide} 360ms ease;
        `}
      >
        {view === 'signup' && (
          <Field
            id="name"
            label="Full name"
            value={values.name}
            onChange={(value) => update('name', value)}
            error={errors.name}
            helper="Use the name on your legal documents."
          />
        )}

        {(view === 'login' || view === 'signup' || view === 'forgot') && (
          <Field
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={(value) => update('email', value)}
            error={errors.email}
            helper="Use the email tied to your workspace."
          />
        )}

        {(view === 'login' || view === 'signup') && (
          <Field
            id="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={(value) => update('password', value)}
            error={errors.password}
            helper="Minimum 8 characters."
          />
        )}

        {view === 'signup' && (
          <Field
            id="confirm"
            label="Confirm password"
            type="password"
            value={values.confirm}
            onChange={(value) => update('confirm', value)}
            error={errors.confirm}
          />
        )}

        {view === 'verify' && (
          <Field
            id="code"
            label="Verification code"
            type="text"
            value={values.code}
            onChange={(value) => update('code', value)}
            error={errors.code}
            helper="Check your email for a 6-digit code."
          />
        )}

        {view === 'login' && (
          <label
            css={css`
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.875rem;
              color: ${theme.colors.mutedForeground};
            `}
          >
            <input
              type="checkbox"
              checked={values.remember}
              onChange={(event) => update('remember', event.target.checked)}
            />
            Remember this device
          </label>
        )}

        {status && (
          <div
            role="status"
            css={css`
              padding: 0.75rem 1rem;
              border-radius: ${theme.layout.radius.md};
              background: ${theme.colors.muted};
              color: ${theme.colors.mutedForeground};
              font-size: 0.9rem;
            `}
          >
            {status}
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth>
          {view === 'login' && 'Continue'}
          {view === 'signup' && 'Create account'}
          {view === 'forgot' && 'Send reset'}
          {view === 'verify' && 'Verify email'}
        </Button>
      </form>

      <div
        css={css`
          display: grid;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: ${theme.colors.mutedForeground};
        `}
      >
        {view === 'login' && (
          <button
            type="button"
            onClick={() => switchView('forgot')}
            css={css`
              border: none;
              background: none;
              padding: 0;
              color: ${theme.colors.accent};
              text-align: left;
              cursor: pointer;
            `}
          >
            Forgot password?
          </button>
        )}
        {view === 'login' && (
          <span>
            New here?{' '}
            <button
              type="button"
              onClick={() => switchView('signup')}
              css={css`
                border: none;
                background: none;
                padding: 0;
                color: ${theme.colors.accent};
                cursor: pointer;
              `}
            >
              Create an account
            </button>
          </span>
        )}
        {view === 'signup' && (
          <span>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchView('login')}
              css={css`
                border: none;
                background: none;
                padding: 0;
                color: ${theme.colors.accent};
                cursor: pointer;
              `}
            >
              Sign in
            </button>
          </span>
        )}
        {view === 'verify' && (
          <button
            type="button"
            onClick={() => switchView('login')}
            css={css`
              border: none;
              background: none;
              padding: 0;
              color: ${theme.colors.accent};
              text-align: left;
              cursor: pointer;
            `}
          >
            Back to login
          </button>
        )}
      </div>
    </div>
  );
}

export default LoginWidget;
