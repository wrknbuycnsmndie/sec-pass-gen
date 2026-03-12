export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 50;

export const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+[]{}|;:,.<>?',
} as const;

export interface PasswordOptions {
  passwordLength: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const clampPasswordLength = (passwordLength: number) =>
  Math.min(MAX_PASSWORD_LENGTH, Math.max(MIN_PASSWORD_LENGTH, passwordLength));

const randomUint32 = () => {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0] ?? 0;
};

const randomIndex = (length: number) => {
  if (length <= 0) {
    throw new Error('Cannot pick a random index from an empty set.');
  }

  const maxUint32 = 0x1_0000_0000;
  const limit = maxUint32 - (maxUint32 % length);

  let randomValue = randomUint32();
  while (randomValue >= limit) {
    randomValue = randomUint32();
  }

  return randomValue % length;
};

const randomCharacter = (characters: string) =>
  characters[randomIndex(characters.length)] ?? '';

const shuffleCharacters = (characters: string[]) => {
  const shuffledCharacters = [...characters];

  for (let index = shuffledCharacters.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [shuffledCharacters[index], shuffledCharacters[swapIndex]] = [
      shuffledCharacters[swapIndex] ?? '',
      shuffledCharacters[index] ?? '',
    ];
  }

  return shuffledCharacters;
};

export const generatePassword = ({
  passwordLength,
  uppercase,
  lowercase,
  numbers,
  symbols,
}: PasswordOptions) => {
  const selectedCharacterSets = [
    uppercase ? CHAR_SETS.uppercase : '',
    lowercase ? CHAR_SETS.lowercase : '',
    numbers ? CHAR_SETS.numbers : '',
    symbols ? CHAR_SETS.symbols : '',
  ].filter(Boolean);

  if (selectedCharacterSets.length === 0) {
    return '';
  }

  const effectiveLength = Math.max(
    clampPasswordLength(passwordLength),
    selectedCharacterSets.length
  );

  const requiredCharacters = selectedCharacterSets.map(randomCharacter);
  const combinedCharacterSet = selectedCharacterSets.join('');
  const passwordCharacters = [...requiredCharacters];

  while (passwordCharacters.length < effectiveLength) {
    passwordCharacters.push(randomCharacter(combinedCharacterSet));
  }

  return shuffleCharacters(passwordCharacters).join('');
};
