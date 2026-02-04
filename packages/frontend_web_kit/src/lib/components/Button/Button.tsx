import { css, SerializedStyles } from '@emotion/react';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { SkeletonLoader } from '../Loader/Loader.js';
import { useTheme } from '../ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  label?: string;
  children?: ReactNode;
  width?: string | number;
  height?: string | number;
  btnType?: ButtonVariant;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  sx?: SerializedStyles;
}

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string }> = {
  sm: { padding: '0.45rem 1.1rem', fontSize: '0.875rem' },
  md: { padding: '0.65rem 1.6rem', fontSize: '0.95rem' },
  lg: { padding: '0.85rem 2.2rem', fontSize: '1rem' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      loading = false,
      children,
      width,
      height,
      btnType,
      variant,
      size = 'md',
      iconLeft,
      label,
      iconRight,
      fullWidth,
      sx,
      ...rest
    },
    ref
  ): ReactElement => {
    const { theme } = useTheme();
    const resolvedVariant = variant ?? btnType ?? 'primary';
    const { padding, fontSize } = sizeStyles[size];

    const variants: Record<
      ButtonVariant,
      { background: string; color: string; border: string; hover: string }
    > = {
      primary: {
        background: 'var(--quma-primary)',
        color: 'var(--quma-primary-foreground)',
        border: 'var(--quma-primary)',
        hover: 'var(--quma-foreground)',
      },
      secondary: {
        background: 'var(--quma-secondary)',
        color: 'var(--quma-secondary-foreground)',
        border: 'var(--quma-border)',
        hover: 'var(--quma-muted)',
      },
      accent: {
        background: 'var(--quma-accent)',
        color: 'var(--quma-accent-foreground)',
        border: 'var(--quma-accent)',
        hover: 'var(--quma-accent)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--quma-foreground)',
        border: 'transparent',
        hover: 'var(--quma-muted)',
      },
    };

    const currentVariant = variants[resolvedVariant];

    const containerStyle = css`
      position: relative;
      display: inline-flex;
      width: ${fullWidth ? '100%' : width ?? 'auto'};
      height: ${height ?? 'auto'};
      min-height: ${theme.layout.spacing(6)};
    `;

    const skeletonStyle = css`
      position: absolute;
      inset: 0;
      border-radius: var(--quma-radius-lg, ${theme.layout.radius.lg});
    `;

    const buttonStyle = css`
      width: 100%;
      height: 100%;
      padding: ${padding};
      font-size: ${fontSize};
      font-weight: ${theme.typography.fontWeight.semibold};
      font-family: var(--quma-font-sans, ${theme.typography.fontFamily});
      border-radius: var(--quma-radius-lg, ${theme.layout.radius.lg});
      border: 1px solid ${currentVariant.border};
      background: ${currentVariant.background};
      color: ${currentVariant.color};
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: ${theme.layout.spacing(1.5)};
      letter-spacing: ${theme.typography.letterSpacing.wide};
      text-transform: uppercase;
      transition: transform ${theme.effects.transitions.fast},
        box-shadow ${theme.effects.transitions.normal},
        background ${theme.effects.transitions.normal};
      box-shadow: var(--quma-shadow-sm, ${theme.effects.shadows.sm});

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        background: ${currentVariant.hover};
        box-shadow: var(--quma-shadow-md, ${theme.effects.shadows.md});
      }

      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: var(--quma-shadow-sm, ${theme.effects.shadows.sm});
      }

      &:focus-visible {
        outline: 2px solid var(--quma-ring, ${theme.colors.ring});
        outline-offset: 3px;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }
    `;

    return (
      <div css={containerStyle}>
        {loading ? (
          <SkeletonLoader css={skeletonStyle} />
        ) : (
          <button ref={ref} css={[buttonStyle, sx]} {...rest}>
            {iconLeft && <span>{iconLeft}</span>}
            <span>{label ?? children}</span>
            {iconRight && <span>{iconRight}</span>}
          </button>
        )}
      </div>
    );
  }
);

Button.displayName = 'Button';
