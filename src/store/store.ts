import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PasswordGeneratorStore {
  password: string;
  passwordLength: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  setPasswordLength: (length: number) => void;
  setUppercase: (value: boolean) => void;
  setLowercase: (value: boolean) => void;
  setNumbers: (value: boolean) => void;
  setSymbols: (value: boolean) => void;
  generatePassword: (
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    symbols: boolean
  ) => void;
}

export const usePasswordGeneratorStore = create<PasswordGeneratorStore>()(
  persist(
    (set, get) => ({
      password: '',
      passwordLength: 8,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      setPasswordLength: (length: number) => {
        set({ passwordLength: Math.max(4, Math.min(50, length)) });
        get().generatePassword(
          get().uppercase,
          get().lowercase,
          get().numbers,
          get().symbols
        );
      },

      setUppercase: (value: boolean) => set({ uppercase: value }),
      setLowercase: (value: boolean) => set({ lowercase: value }),
      setNumbers: (value: boolean) => set({ numbers: value }),
      setSymbols: (value: boolean) => set({ symbols: value }),
      generatePassword: (
        uppercase: boolean,
        lowercase: boolean,
        numbers: boolean,
        symbols: boolean
      ) => {
        // If no options was provided
        if (!uppercase && !lowercase && !numbers && !symbols) {
          set({ password: '' });
          return;
        }

        const charSets = {
          uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          lowercase: 'abcdefghijklmnopqrstuvwxyz',
          numbers: '0123456789',
          symbols: '!@#$%^&*()_+[]{}|;:,.<>?',
        };

        // Combine selected character sets
        let charset = '';
        if (uppercase) charset += charSets.uppercase;
        if (lowercase) charset += charSets.lowercase;
        if (numbers) charset += charSets.numbers;
        if (symbols) charset += charSets.symbols;

        const length = get().passwordLength;
        let generatedPassword = '';

        // Ensure at least one character from each selected type
        if (uppercase)
          generatedPassword +=
            charSets.uppercase[Math.floor(Math.random() * 26)];
        if (lowercase)
          generatedPassword +=
            charSets.lowercase[Math.floor(Math.random() * 26)];
        if (numbers)
          generatedPassword += charSets.numbers[Math.floor(Math.random() * 10)];
        if (symbols)
          generatedPassword +=
            charSets.symbols[
              Math.floor(Math.random() * charSets.symbols.length)
            ];

        // Fill remaining length with random characters
        while (generatedPassword.length < length) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          generatedPassword += charset[randomIndex];
        }

        // Shuffle the password
        generatedPassword = generatedPassword
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('');

        set({ password: generatedPassword });
      },
    }),
    {
      name: 'password-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
