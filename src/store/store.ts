import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from 'zustand/middleware';
import {
  generatePassword as buildPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../lib/password.ts';

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
  generatePassword: () => void;
}

const createStorage = (storage?: StateStorage) =>
  storage
    ? createJSONStorage(() => storage)
    : typeof window === 'undefined'
      ? undefined
      : createJSONStorage(() => window.localStorage);

export const createPasswordGeneratorStore = (storage?: StateStorage) =>
  create<PasswordGeneratorStore>()(
    persist(
      (set, get) => ({
        password: '',
        passwordLength: 8,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        setPasswordLength: (length: number) =>
          set({
            passwordLength: Math.min(
              MAX_PASSWORD_LENGTH,
              Math.max(MIN_PASSWORD_LENGTH, length)
            ),
          }),
        setUppercase: (value: boolean) => set({ uppercase: value }),
        setLowercase: (value: boolean) => set({ lowercase: value }),
        setNumbers: (value: boolean) => set({ numbers: value }),
        setSymbols: (value: boolean) => set({ symbols: value }),
        generatePassword: () => {
          const {
            passwordLength,
            uppercase,
            lowercase,
            numbers,
            symbols,
          } = get();

          set({
            password: buildPassword({
              passwordLength,
              uppercase,
              lowercase,
              numbers,
              symbols,
            }),
          });
        },
      }),
      {
        name: 'password-storage',
        storage: createStorage(storage),
        partialize: ({ passwordLength, uppercase, lowercase, numbers, symbols }) => ({
          passwordLength,
          uppercase,
          lowercase,
          numbers,
          symbols,
        }),
      }
    )
  );

export const usePasswordGeneratorStore = createPasswordGeneratorStore();
