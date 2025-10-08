import { css } from '@emotion/react';
import { defaultTheme, useTheme } from '../ThemeProvider';
import { forwardRef } from 'react';
import { SkeletonLoader } from '../Loader/Loader';

export type btnType = 'primary' | 'secondary' | 'accent';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;

  children: React.ReactNode;

  width?: string | number;

  height?: string | number;

  btnType?: btnType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      loading = false,
      children,
      width = '100%',
      height,
      btnType = 'primary',
      ...rest
    },
    ref
  ): React.ReactElement => {
    const providedTheme = useTheme();
    const theme = providedTheme?.theme || defaultTheme;

    const buttonVariants = {
      primary: {
        background: theme.colors.primary,
        color: theme.colors.surface,
        borderColor: theme.colors.primary,
        hoverBackground: theme.colors.primary,
        activeBackground: theme.colors.accent,
      },
      secondary: {
        background: 'transparent',
        color: theme.colors.primary,
        borderColor: theme.colors.primary,
        hoverBackground: theme.colors.primary,
        activeBackground: theme.colors.secondary,
      },
      accent: {
        background: theme.colors.accent,
        color: theme.colors.surface,
        borderColor: theme.colors.accent,
        hoverBackground: theme.colors.secondary,
        activeBackground: theme.colors.primary,
      },
    };

    const currentVariant = buttonVariants[btnType];

    const containerStyle = css`
      position: relative; /* Essential for positioning the skeleton */
      display: inline-block; /* Allows the container to size to its content */
      width: ${width};
      height: ${height};
      /* Prevents the skeleton from looking weird if height isn't set */
      min-height: ${height || theme.layout.spacing(7)};
    `;

    // Style for the skeleton loader to make it fill the container
    const skeletonStyle = css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: ${theme.layout.borderRadius.md};
    `;

    const buttonStyle = css`
      width: 100%;
      height: 100%;
      padding: ${theme.layout.spacing(2)} ${theme.layout.spacing(4)};
      font-size: ${theme.typography.fontSize.base};
      font-weight: ${theme.typography.fontWeight.bold};
      font-family: ${theme.typography.fontFamily};
      border-radius: ${theme.layout.borderRadius.md};
      cursor: pointer;
      box-shadow: ${theme.effects.shadows.md};
      transition: all ${theme.effects.transitions.normal};

      /* Apply dynamic styles from the variants object */
      background: ${currentVariant.background};
      color: ${currentVariant.color};
      border: solid 1px ${currentVariant.borderColor};

      &:hover {
        background: ${currentVariant.hoverBackground};
        color: ${btnType === 'secondary'
          ? theme.colors.surface
          : currentVariant.color};
        box-shadow: ${theme.effects.shadows.lg};
      }

      &:active {
        background: ${currentVariant.activeBackground};
        box-shadow: ${theme.effects.shadows.sm};
        transform: scale(0.98);
      }

      &:focus-visible {
        outline: 2px solid ${currentVariant.borderColor};
        outline-offset: 2px;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: ${theme.colors.muted};
        border-color: ${theme.colors.muted};
      }
    `;

    return (
      <div css={containerStyle}>
        {loading ? (
          <SkeletonLoader css={skeletonStyle} />
        ) : (
          <button ref={ref} css={buttonStyle} {...rest}>
            {children}
          </button>
        )}
      </div>
    );
  }
);

// It's good practice to set a display name for components wrapped in forwardRef
Button.displayName = 'Button';
