export const THEME_STORAGE_KEY = 'secpassgen-theme';

type ThemeName = 'light' | 'dark';

const getThemeName = (isDark: boolean): ThemeName => (isDark ? 'dark' : 'light');

export const applyTheme = (isDark: boolean) => {
  document.documentElement.classList.toggle('dark', isDark);
};

export const readThemePreference = () => {
  const storedTheme = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'dark') return true;
  if (storedTheme === 'light') return false;

  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

export const saveThemePreference = (isDark: boolean) => {
  globalThis.localStorage?.setItem(THEME_STORAGE_KEY, getThemeName(isDark));
};

export const syncThemeButton = (button: HTMLButtonElement | null, isDark: boolean) => {
  if (!button) return;

  button.dataset.theme = getThemeName(isDark);
  button.setAttribute('aria-pressed', String(isDark));
  button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
};
