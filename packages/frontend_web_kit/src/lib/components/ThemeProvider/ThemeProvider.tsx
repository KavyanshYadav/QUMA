import React, {
  createContext,
  useEffect,
  useMemo,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { Theme, ThemeMode } from '../../types/index.js';
import {
  createThemeManager,
  ThemeManager,
  ThemeManagerOptions,
} from './themeManager.js';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  setTheme: (mode: ThemeMode, theme: Theme) => void;
  manager: ThemeManager;
}

const fallbackManager = createThemeManager({ enableSystem: false, cdnUrl: false });
const fallbackContext: ThemeContextType = {
  theme: fallbackManager.getTheme(),
  mode: fallbackManager.getMode(),
  toggleTheme: () => undefined,
  setMode: () => undefined,
  setTheme: () => undefined,
  manager: fallbackManager,
};

const ThemeContext = createContext<ThemeContextType>(fallbackContext);

interface ThemeProviderProps extends ThemeManagerOptions {
  children: ReactNode;
  manager?: ThemeManager;
}

export const ThemeProvider = ({ children, manager, ...options }: ThemeProviderProps) => {
  const [themeManager] = useState(() => manager ?? createThemeManager(options));
  const [theme, setThemeState] = useState<Theme>(themeManager.getTheme());
  const [mode, setModeState] = useState<ThemeMode>(themeManager.getMode());

  useEffect(() => {
    themeManager.init();
    const unsubscribe = themeManager.onChange((nextTheme) => {
      setThemeState(nextTheme);
      setModeState(nextTheme.mode);
    });

    setThemeState(themeManager.getTheme());
    setModeState(themeManager.getMode());

    return () => {
      unsubscribe();
      themeManager.destroy();
    };
  }, [themeManager]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      toggleTheme: () => themeManager.toggleMode(),
      setMode: (nextMode: ThemeMode) => themeManager.setMode(nextMode),
      setTheme: (nextMode: ThemeMode, nextTheme: Theme) =>
        themeManager.setTheme(nextMode, nextTheme),
      manager: themeManager,
    }),
    [theme, mode, themeManager]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeProvider;
