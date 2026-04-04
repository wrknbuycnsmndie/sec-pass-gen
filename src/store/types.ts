import type { StateStorage } from 'zustand/middleware';

export type CharacterType = 'uppercase' | 'lowercase' | 'numbers' | 'symbols';

export interface PasswordGeneratorState {
  password: string;
  passwordLength: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  isCopied: boolean;
}

export interface PasswordGeneratorActions {
  setPasswordLength: (length: number) => void;
  setUppercase: (value: boolean) => void;
  setLowercase: (value: boolean) => void;
  setNumbers: (value: boolean) => void;
  setSymbols: (value: boolean) => void;
  generatePassword: () => boolean;
  copyPassword: () => Promise<boolean>;
  resetCopiedState: () => void;
}

export type PasswordGeneratorStore = PasswordGeneratorState &
  PasswordGeneratorActions;

export interface PasswordGeneratorStoreOptions {
  storage?: StateStorage;
  copiedStateDurationMs?: number;
  writeToClipboard?: (value: string) => Promise<void>;
}
