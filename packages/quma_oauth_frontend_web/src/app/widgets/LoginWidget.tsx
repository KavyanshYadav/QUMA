import { css, keyframes } from '@emotion/react';
import { Button, Input, useTheme } from '@quma/webkit';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiClient } from './utilis';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ViewState = 'login' | 'signup' | 'forgot' | 'verify';

type FieldErrors = Partial<
  Record<'name' | 'email' | 'password' | 'confirm' | 'code', string>
>;

const useAuthForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = (searchParams.get('mode') as ViewState) || 'login';
  const api = new ApiClient('');

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

  const update = (key: keyof typeof values, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const switchView = (next: ViewState) => {
    setErrors({});
    setStatus('');
    setSearchParams({ mode: next });
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
      // Example API call for signup
      setStatus('Signing up...');
      // api.call('auth:signup', { body: { ... } });
      setStatus('We sent a verification code to your email.');
      switchView('verify');
      return;
    }

    if (current === 'login') {
      // Restore original API call logic
      api
        .call('auth:create:withEmail', {
          body: {
            email: values.email,
          },
        })
        .then(() => {
          setStatus('Login successful. Redirecting...');
        })
        .catch(() => {
          setStatus('Login failed. Please try again.');
        });
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

const Field: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
}> = ({ id, label, type = 'text', value, onChange, error, helper }) => {
  const { theme } = useTheme();

  return (
    <Input
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.value)
      }
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

const LoginWidget: React.FC = () => {
  const { theme } = useTheme();
  const { view, values, errors, status, update, switchView, handleSubmit } =
    useAuthForm();

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

  return (
    <div
      css={css`
        width: min(480px, 100%);
        margin: 0 auto;
        padding: 3rem;
        display: grid;
        gap: 2rem;
        animation: ${fadeIn} 0.4s ease-out;
      `}
    >
      <div
        css={css`
          display: grid;
          gap: 0.75rem;
          text-align: center;
        `}
      >
        <h1
          css={css`
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
            color: ${theme.colors.foreground};
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
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          handleSubmit(view);
        }}
        css={css`
          display: grid;
          gap: 1.5rem;
        `}
      >
        {view === 'signup' && (
          <Field
            id="name"
            label="Full name"
            value={values.name}
            onChange={(value: string) => update('name', value)}
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
            onChange={(value: string) => update('email', value)}
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
            onChange={(value: string) => update('password', value)}
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
            onChange={(value: string) => update('confirm', value)}
            error={errors.confirm}
          />
        )}

        {view === 'verify' && (
          <Field
            id="code"
            label="Verification code"
            type="text"
            value={values.code}
            onChange={(value: string) => update('code', value)}
            error={errors.code}
            helper="Check your email for a 6-digit code."
          />
        )}

        {view === 'login' && (
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 0.875rem;
            `}
          >
            <label
              css={css`
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: ${theme.colors.mutedForeground};
                cursor: pointer;
              `}
            >
              <input
                type="checkbox"
                checked={values.remember}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  update('remember', event.target.checked)
                }
                css={css`
                  accent-color: ${theme.colors.primary};
                `}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => switchView('forgot')}
              css={css`
                border: none;
                background: none;
                padding: 0;
                color: ${theme.colors.primary};
                cursor: pointer;
                font-weight: 500;
                &:hover {
                  text-decoration: underline;
                }
              `}
            >
              Forgot password?
            </button>
          </div>
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
              text-align: center;
            `}
          >
            {status}
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth size="lg">
          {view === 'login' && 'Sign in'}
          {view === 'signup' && 'Create account'}
          {view === 'forgot' && 'Send reset instructions'}
          {view === 'verify' && 'Verify email'}
        </Button>
      </form>

      <div
        css={css`
          text-align: center;
          font-size: 0.9rem;
          color: ${theme.colors.mutedForeground};
        `}
      >
        {view === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => switchView('signup')}
              css={css`
                border: none;
                background: none;
                padding: 0;
                color: ${theme.colors.primary};
                cursor: pointer;
                font-weight: 600;
                &:hover {
                  text-decoration: underline;
                }
              `}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchView('login')}
              css={css`
                border: none;
                background: none;
                padding: 0;
                color: ${theme.colors.primary};
                cursor: pointer;
                font-weight: 600;
                &:hover {
                  text-decoration: underline;
                }
              `}
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginWidget;
