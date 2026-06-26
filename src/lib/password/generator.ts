import type { PasswordPreferences } from './preferences.ts';
import { clampPasswordLength, PASSWORD_CHARACTER_FIELDS } from './rules.ts';

export const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+[]{}|;:,.<>?',
} as const;

const getRandomUint32 = () => {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0] ?? 0;
};

const getRandomIndex = (length: number) => {
  if (length <= 0) {
    throw new Error('Cannot pick a random index from an empty set.');
  }

  const maxUint32 = 0x1_0000_0000;
  const limit = maxUint32 - (maxUint32 % length);

  let value = getRandomUint32();
  while (value >= limit) {
    value = getRandomUint32();
  }

  return value % length;
};

const pickRandomCharacter = (characters: string) => characters[getRandomIndex(characters.length)] ?? '';

const shuffleCharacters = (characters: string[]) => {
  const shuffled = [...characters];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex] ?? '', shuffled[index] ?? ''];
  }

  return shuffled;
};

const getSelectedCharacterSets = (preferences: PasswordPreferences) =>
  PASSWORD_CHARACTER_FIELDS.filter((field) => preferences[field]).map((field) => CHAR_SETS[field]);

export const generatePassword = (preferences: PasswordPreferences) => {
  const selectedCharacterSets = getSelectedCharacterSets(preferences);

  if (selectedCharacterSets.length === 0) {
    return '';
  }

  const passwordLength = Math.max(
    clampPasswordLength(preferences.passwordLength),
    selectedCharacterSets.length
  );
  const passwordCharacters = selectedCharacterSets.map(pickRandomCharacter);
  const allCharacters = selectedCharacterSets.join('');

  while (passwordCharacters.length < passwordLength) {
    passwordCharacters.push(pickRandomCharacter(allCharacters));
  }

  return shuffleCharacters(passwordCharacters).join('');
};
