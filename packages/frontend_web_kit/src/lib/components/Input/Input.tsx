import { css } from '@emotion/react';
import { useTheme } from '../ThemeProvider';
import { Theme } from '../../types/Theme/theme'; // Assuming this is the path to your types
import { forwardRef, InputHTMLAttributes } from 'react';

// A default theme to use as a fallback if the component is not inside a ThemeProvider
// (This would typically be shared across components)
const defaultTheme: Omit<Theme, 'mode'> = {
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#1e3a8a',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  typography: {
    fontFamily: 'sans-serif',
    fontSize: {
      base: '1rem',
      xs: '0.75rem',
      sm: '0.875rem' /*...other sizes*/,
    },
    //... other typography settings
  },
  layout: {
    borderRadius: { md: '0.375rem' /*...other sizes*/ },
    spacing: (factor: number) => `${factor * 0.5}rem`,
  },
  effects: {
    transitions: { normal: '0.2s' },
    //... other effects
  },
  //... other theme properties
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * The label for the input, which will animate to the top on focus/entry.
   */
  label: string;
  /**
   * A unique identifier for the input, necessary for accessibility.
   */
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, ...rest }, ref): React.ReactElement => {
    const providedTheme = useTheme();
    const theme = providedTheme?.theme || defaultTheme;

    const containerStyle = css`
      position: relative;
      background-color: ${theme.colors.surface};
      border: 1px solid ${theme.colors.muted};
      border-radius: ${theme.layout.borderRadius.md};
      transition: border-color ${theme.effects.transitions.normal};
      padding: ${theme.layout.spacing(2)}; // Provides space for label to sit

      /* --- State Styling --- */
      /* Use :focus-within to style the container when the input inside is focused */
      &:focus-within {
        border-color: ${theme.colors.primary};
      }

      /* --- Child Element Styling --- */
      /* The actual input element */
      .input-field {
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.fontSize.base};
        color: ${theme.colors.text};
        position: relative;
        z-index: 1; // Ensures input is clickable over the label

        // This is a trick to make the :not(:placeholder-shown) selector work reliably
        &::placeholder {
          color: transparent;
        }
      }

      /* The floating label */
      .input-label {
        position: absolute;
        top: 50%;
        left: ${theme.layout.spacing(2)};
        transform: translateY(-50%);
        color: ${theme.colors.muted};
        font-size: ${theme.typography.fontSize.base};
        transition: all ${theme.effects.transitions.normal} ease-in-out;

        // Prevents the label from blocking clicks meant for the input
        pointer-events: none;
        z-index: 0;
      }

      .input-field:focus + .input-label,
      .input-field:not(:placeholder-shown) + .input-label {
        top: 0;
        transform: translateY(-50%) scale(0.85);
        font-size: ${theme.typography.fontSize.sm};
        color: ${theme.colors.primary};

        // This "cuts out" the border
        background-color: ${theme.colors.background};
        padding: 0 ${theme.layout.spacing(1)};
      }
    `;

    return (
      <div css={containerStyle}>
        <input
          ref={ref}
          className="input-field"
          id={id}
          // The placeholder must exist (even if empty) for the animation selector to work
          placeholder=" "
          {...rest}
        />
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      </div>
    );
  }
);
