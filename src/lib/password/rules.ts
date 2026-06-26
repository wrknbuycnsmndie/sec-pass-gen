export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 50;

export const PASSWORD_CHARACTER_FIELDS = [
  'uppercase',
  'lowercase',
  'numbers',
  'symbols',
] as const;

export type PasswordCharacterField = (typeof PASSWORD_CHARACTER_FIELDS)[number];

export const clampPasswordLength = (value: number) =>
  Math.min(MAX_PASSWORD_LENGTH, Math.max(MIN_PASSWORD_LENGTH, value));
