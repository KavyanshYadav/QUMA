import { css, SerializedStyles } from '@emotion/react';
import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactElement } from 'react';
import { useTheme } from '../ThemeProvider';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  helperText?: string;
  sx?: SerializedStyles;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, helperText, sx, ...rest }, ref): ReactElement => {
    const { theme } = useTheme();

    const containerStyle = css`
      display: flex;
      flex-direction: column;
      gap: ${theme.layout.spacing(1)};
    `;

    const labelStyle = css`
      font-size: ${theme.typography.fontSize.sm};
      letter-spacing: ${theme.typography.letterSpacing.wide};
      text-transform: uppercase;
      color: var(--quma-muted-foreground, ${theme.colors.mutedForeground});
    `;

    const inputStyle = css`
      width: 100%;
      padding: ${theme.layout.spacing(1.5)} ${theme.layout.spacing(2)};
      border-radius: var(--quma-radius-md, ${theme.layout.radius.md});
      border: 1px solid var(--quma-border, ${theme.colors.border});
      background: var(--quma-input, ${theme.colors.input});
      color: var(--quma-foreground, ${theme.colors.foreground});
      font-size: ${theme.typography.fontSize.base};
      font-family: var(--quma-font-sans, ${theme.typography.fontFamily});
      transition: border-color ${theme.effects.transitions.normal},
        box-shadow ${theme.effects.transitions.normal};

      &:focus {
        outline: none;
        border-color: var(--quma-ring, ${theme.colors.ring});
        box-shadow: 0 0 0 3px rgba(17, 17, 19, 0.12);
      }

      &::placeholder {
        color: var(--quma-muted-foreground, ${theme.colors.mutedForeground});
      }
    `;

    const helperStyle = css`
      font-size: ${theme.typography.fontSize.xs};
      color: var(--quma-muted-foreground, ${theme.colors.mutedForeground});
    `;

    return (
      <div css={[containerStyle, sx]}>
        {label && (
          <label htmlFor={id} css={labelStyle}>
            {label}
          </label>
        )}
        <input ref={ref} id={id} css={inputStyle} {...rest} />
        {helperText && <span css={helperStyle}>{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
