import { toast } from 'sonner';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

import {
  generatePassword as buildPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../lib/password.ts';
import type {
  CharacterType,
  PasswordGeneratorState,
  PasswordGeneratorStore,
  PasswordGeneratorStoreOptions,
} from './types';

const PASSWORD_STORAGE_KEY = 'password-storage';
const COPIED_STATE_DURATION_MS = 2000;

const createStorage = (storage?: PasswordGeneratorStoreOptions['storage']) =>
  storage
    ? createJSONStorage(() => storage)
    : typeof window === 'undefined'
      ? undefined
      : createJSONStorage(() => window.localStorage);

const clampPasswordLength = (length: number) =>
  Math.min(MAX_PASSWORD_LENGTH, Math.max(MIN_PASSWORD_LENGTH, length));

const hasSelectedCharacterType = (
  state: Pick<
    PasswordGeneratorState,
    'uppercase' | 'lowercase' | 'numbers' | 'symbols'
  >
) => state.uppercase || state.lowercase || state.numbers || state.symbols;

const createCharacterTypeState = (
  characterType: CharacterType,
  value: boolean
): Partial<PasswordGeneratorState> => ({
  [characterType]: value,
});

const createGeneratedPassword = (
  state: Pick<
    PasswordGeneratorState,
    'passwordLength' | 'uppercase' | 'lowercase' | 'numbers' | 'symbols'
  >
) =>
  buildPassword({
    passwordLength: state.passwordLength,
    uppercase: state.uppercase,
    lowercase: state.lowercase,
    numbers: state.numbers,
    symbols: state.symbols,
  });

const writeToClipboard = async (value: string) => {
  if (!globalThis.navigator?.clipboard) {
    throw new Error('Clipboard API is unavailable.');
  }

  await globalThis.navigator.clipboard.writeText(value);
};

export const selectHasSelectedCharacterType = (state: PasswordGeneratorStore) =>
  hasSelectedCharacterType(state);

export const selectCanCopyPassword = (state: PasswordGeneratorStore) =>
  state.password.length > 0;

export const createPasswordGeneratorStore = ({
  storage,
  copiedStateDurationMs = COPIED_STATE_DURATION_MS,
  writeToClipboard: copy = writeToClipboard,
}: PasswordGeneratorStoreOptions = {}) => {
  let copiedResetTimeout: ReturnType<typeof setTimeout> | null = null;

  const clearCopiedResetTimeout = () => {
    if (copiedResetTimeout !== null) {
      clearTimeout(copiedResetTimeout);
      copiedResetTimeout = null;
    }
  };

  return create<PasswordGeneratorStore>()(
    persist(
      (set, get) => ({
        password: '',
        passwordLength: 8,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        isCopied: false,
        setPasswordLength: (length) => {
          const nextPasswordLength = clampPasswordLength(length);

          set((state) => ({
            passwordLength: nextPasswordLength,
            password: hasSelectedCharacterType(state)
              ? createGeneratedPassword({
                  ...state,
                  passwordLength: nextPasswordLength,
                })
              : state.password,
          }));
        },
        setUppercase: (value) => set(createCharacterTypeState('uppercase', value)),
        setLowercase: (value) => set(createCharacterTypeState('lowercase', value)),
        setNumbers: (value) => set(createCharacterTypeState('numbers', value)),
        setSymbols: (value) => set(createCharacterTypeState('symbols', value)),
        generatePassword: () => {
          const state = get();

          if (!hasSelectedCharacterType(state)) {
            toast('Cannot generate password', {
              description:
                'Please select at least one character type (uppercase, lowercase, numbers, or symbols).',
            });
            return false;
          }

          set({
            password: createGeneratedPassword(state),
          });

          return true;
        },
        copyPassword: async () => {
          const { password } = get();

          if (!password) {
            toast('Error', {
              description: 'Cannot copy an empty password.',
            });
            return false;
          }

          try {
            await copy(password);
          } catch {
            toast('Error', {
              description: 'Failed to copy the generated password.',
            });
            return false;
          }

          clearCopiedResetTimeout();
          set({ isCopied: true });

          copiedResetTimeout = setTimeout(() => {
            copiedResetTimeout = null;
            get().resetCopiedState();
          }, copiedStateDurationMs);

          return true;
        },
        resetCopiedState: () => {
          clearCopiedResetTimeout();
          set({ isCopied: false });
        },
      }),
      {
        name: PASSWORD_STORAGE_KEY,
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
};

export const usePasswordGeneratorStore = createPasswordGeneratorStore();
