import React, {
  createContext,
  useEffect,
  useMemo,
  ReactNode,
  useContext,
} from 'react';
import { Theme } from '../../types';
import { defaultTheme } from './themes/deafaultTheme.js';
import { darkTheme } from './themes/darkTheme.js';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    const storage = localStorage.getItem('theme-mode');
    return storage === 'dark' ? darkTheme : defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.colors)) {
      root.style.setProperty(`--color-${key}`, value);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev.mode === 'dark' ? defaultTheme : darkTheme;
      localStorage.setItem('theme-mode', newTheme.mode);
      return newTheme;
    });
  };

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeProvider;
