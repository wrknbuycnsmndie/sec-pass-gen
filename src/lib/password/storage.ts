import {
  DEFAULT_PASSWORD_PREFERENCES,
  parsePasswordPreferences,
  serializePasswordPreferences,
  type PasswordPreferences,
} from './preferences.ts';

export const PASSWORD_PREFERENCES_STORAGE_KEY = 'secpassgen-preferences';

export const readPasswordPreferences = (): PasswordPreferences => {
  const storedValue = globalThis.localStorage?.getItem(PASSWORD_PREFERENCES_STORAGE_KEY) ?? null;
  return parsePasswordPreferences(storedValue) ?? { ...DEFAULT_PASSWORD_PREFERENCES };
};

export const savePasswordPreferences = (preferences: PasswordPreferences) => {
  globalThis.localStorage?.setItem(
    PASSWORD_PREFERENCES_STORAGE_KEY,
    serializePasswordPreferences(preferences)
  );
};
