import { clampPasswordLength } from './rules.ts';

export const DEFAULT_PASSWORD_LENGTH = 16;

export interface PasswordPreferences {
  passwordLength: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export const DEFAULT_PASSWORD_PREFERENCES: PasswordPreferences = {
  passwordLength: DEFAULT_PASSWORD_LENGTH,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

const toBoolean = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback;

const toPasswordLength = (value: unknown) => {
  const length = Number(value);
  return Number.isFinite(length)
    ? clampPasswordLength(length)
    : DEFAULT_PASSWORD_PREFERENCES.passwordLength;
};

export const hasSelectedCharacterSet = (preferences: PasswordPreferences) =>
  preferences.uppercase ||
  preferences.lowercase ||
  preferences.numbers ||
  preferences.symbols;

export const normalizePasswordPreferences = (
  preferences: Partial<PasswordPreferences> = {}
): PasswordPreferences => ({
  passwordLength: toPasswordLength(preferences.passwordLength),
  uppercase: toBoolean(preferences.uppercase, DEFAULT_PASSWORD_PREFERENCES.uppercase),
  lowercase: toBoolean(preferences.lowercase, DEFAULT_PASSWORD_PREFERENCES.lowercase),
  numbers: toBoolean(preferences.numbers, DEFAULT_PASSWORD_PREFERENCES.numbers),
  symbols: toBoolean(preferences.symbols, DEFAULT_PASSWORD_PREFERENCES.symbols),
});

export const serializePasswordPreferences = (preferences: PasswordPreferences) =>
  JSON.stringify(preferences);

export const parsePasswordPreferences = (rawPreferences: string | null) => {
  if (!rawPreferences) {
    return null;
  }

  try {
    return normalizePasswordPreferences(JSON.parse(rawPreferences) as Partial<PasswordPreferences>);
  } catch {
    return null;
  }
};
