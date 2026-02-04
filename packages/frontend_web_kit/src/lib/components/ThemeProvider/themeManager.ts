import { Theme, ThemeMode } from '../../types/index.js';
import { darkTheme, defaultTheme } from './themes/index.js';

export const SHADCN_CDN =
  'https://cdn.jsdelivr.net/npm/@shadcn/ui@latest/styles.css';

export interface ThemeManagerOptions {
  themes?: Partial<Record<ThemeMode, Theme>>;
  initialMode?: ThemeMode;
  storageKey?: string;
  enableSystem?: boolean;
  cdnUrl?: string | false;
}

const themeDefaults: Record<ThemeMode, Theme> = {
  light: defaultTheme,
  dark: darkTheme,
};

const toKebabCase = (value: string) =>
  value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

export class ThemeManager {
  private themes: Record<ThemeMode, Theme>;
  private mode: ThemeMode;
  private storageKey: string;
  private enableSystem: boolean;
  private cdnUrl?: string | false;
  private listeners = new Set<(theme: Theme) => void>();
  private mediaQuery?: MediaQueryList;

  constructor(options: ThemeManagerOptions = {}) {
    this.themes = {
      ...themeDefaults,
      ...(options.themes ?? {}),
    };
    this.mode = options.initialMode ?? 'light';
    this.storageKey = options.storageKey ?? 'quma-theme-mode';
    this.enableSystem = options.enableSystem ?? true;
    this.cdnUrl = options.cdnUrl ?? SHADCN_CDN;
  }

  init() {
    if (typeof window === 'undefined') return;
    this.ensureCdn();

    const stored = window.localStorage.getItem(this.storageKey) as
      | ThemeMode
      | null;

    if (stored && this.themes[stored]) {
      this.mode = stored;
    } else if (this.enableSystem) {
      this.mode = this.getSystemMode();
    }

    if (this.enableSystem && typeof window.matchMedia === 'function') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemChange);
    }

    this.applyTheme(this.mode);
  }

  destroy() {
    this.mediaQuery?.removeEventListener('change', this.handleSystemChange);
    this.listeners.clear();
  }

  getTheme() {
    return this.themes[this.mode];
  }

  getMode() {
    return this.mode;
  }

  toggleMode() {
    this.setMode(this.mode === 'dark' ? 'light' : 'dark');
  }

  setMode(mode: ThemeMode) {
    if (!this.themes[mode]) return;
    this.mode = mode;
    this.applyTheme(mode);
  }

  setTheme(mode: ThemeMode, theme: Theme) {
    this.themes[mode] = theme;
    if (mode === this.mode) {
      this.applyTheme(mode);
    }
  }

  onChange(listener: (theme: Theme) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(theme: Theme) {
    for (const listener of this.listeners) {
      listener(theme);
    }
  }

  private getSystemMode(): ThemeMode {
    if (typeof window === 'undefined') return this.mode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private handleSystemChange = (event: MediaQueryListEvent) => {
    if (!this.enableSystem) return;
    const nextMode: ThemeMode = event.matches ? 'dark' : 'light';
    if (nextMode !== this.mode) {
      this.setMode(nextMode);
    }
  };

  private applyTheme(mode: ThemeMode) {
    if (typeof document === 'undefined') return;
    const theme = this.themes[mode];
    const root = document.documentElement;

    root.dataset.qumaTheme = mode;
    root.style.setProperty('color-scheme', mode);

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--quma-${toKebabCase(key)}`, value);
    });

    root.style.setProperty('--quma-font-sans', theme.typography.fontFamily);
    root.style.setProperty('--quma-font-mono', theme.typography.fontFamilyMono);
    root.style.setProperty('--quma-radius-sm', theme.layout.radius.sm);
    root.style.setProperty('--quma-radius-md', theme.layout.radius.md);
    root.style.setProperty('--quma-radius-lg', theme.layout.radius.lg);
    root.style.setProperty('--quma-radius-xl', theme.layout.radius.xl);
    root.style.setProperty('--quma-shadow-sm', theme.effects.shadows.sm);
    root.style.setProperty('--quma-shadow-md', theme.effects.shadows.md);
    root.style.setProperty('--quma-shadow-lg', theme.effects.shadows.lg);

    window.localStorage.setItem(this.storageKey, mode);
    this.notify(theme);
  }

  private ensureCdn() {
    if (!this.cdnUrl || typeof document === 'undefined') return;
    const existing = document.querySelector(
      'link[data-quma-shadcn-cdn]'
    ) as HTMLLinkElement | null;

    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = this.cdnUrl;
    link.dataset.qumaShadcnCdn = 'true';
    document.head.appendChild(link);
  }
}

export const createThemeManager = (options?: ThemeManagerOptions) =>
  new ThemeManager(options);
