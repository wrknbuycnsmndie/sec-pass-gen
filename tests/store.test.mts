import assert from 'node:assert/strict';
import test from 'node:test';
import type { StateStorage } from 'zustand/middleware';

import {
  createPasswordGeneratorStore,
  selectCanCopyPassword,
  selectHasSelectedCharacterType,
} from '../src/store/store.ts';
import type { PasswordGeneratorStoreOptions } from '../src/store/types.ts';

interface PersistedPasswordStorageValue {
  state: {
    password?: string;
    isCopied?: boolean;
    passwordLength?: number;
  };
}

interface ClipboardDouble {
  writes: string[];
  writeToClipboard: NonNullable<PasswordGeneratorStoreOptions['writeToClipboard']>;
}

const wait = (delayMs: number): Promise<void> =>
  new Promise((resolve: () => void) => {
    setTimeout(resolve, delayMs);
  });

const createMemoryStorage = (): StateStorage => {
  const values = new Map<string, string>();

  return {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => {
      values.set(name, value);
    },
    removeItem: (name: string) => {
      values.delete(name);
    },
  };
};

const createClipboard = (): ClipboardDouble => {
  const writes: string[] = [];

  return {
    writes,
    writeToClipboard: async (value: string) => {
      writes.push(value);
    },
  };
};

test('setPasswordLength keeps the length inside the supported range', () => {
  const store = createPasswordGeneratorStore({
    storage: createMemoryStorage(),
  });

  store.getState().setPasswordLength(1);
  assert.equal(store.getState().passwordLength, 4);

  store.getState().setPasswordLength(500);
  assert.equal(store.getState().passwordLength, 50);
});

test('setPasswordLength regenerates the password immediately', () => {
  const store = createPasswordGeneratorStore({
    storage: createMemoryStorage(),
  });

  store.getState().setPasswordLength(20);

  const password = store.getState().password;
  assert.equal(password.length, 20);
});

test('generatePassword uses the current store settings', () => {
  const store = createPasswordGeneratorStore({
    storage: createMemoryStorage(),
  });

  store.getState().setUppercase(false);
  store.getState().setSymbols(false);
  store.getState().setPasswordLength(14);
  const generated = store.getState().generatePassword();

  const password = store.getState().password;
  assert.equal(generated, true);
  assert.equal(password.length, 14);
  assert.equal(/[A-Z]/.test(password), false);
  assert.equal(/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password), false);
});

test('selectors derive state outside the component layer', () => {
  const store = createPasswordGeneratorStore({
    storage: createMemoryStorage(),
  });

  assert.equal(selectHasSelectedCharacterType(store.getState()), true);
  assert.equal(selectCanCopyPassword(store.getState()), false);

  store.getState().setUppercase(false);
  store.getState().setLowercase(false);
  store.getState().setNumbers(false);
  store.getState().setSymbols(false);

  assert.equal(selectHasSelectedCharacterType(store.getState()), false);
});

test('generatePassword rejects generation when no character type is selected', () => {
  const store = createPasswordGeneratorStore({
    storage: createMemoryStorage(),
  });

  store.getState().setUppercase(false);
  store.getState().setLowercase(false);
  store.getState().setNumbers(false);
  store.getState().setSymbols(false);

  const previousPassword = store.getState().password;
  const generated = store.getState().generatePassword();

  assert.equal(generated, false);
  assert.equal(store.getState().password, previousPassword);
});

test('copyPassword copies the current password and resets copied state on timeout', async () => {
  const { writes, writeToClipboard } = createClipboard();
  const store = createPasswordGeneratorStore({
    copiedStateDurationMs: 5,
    storage: createMemoryStorage(),
    writeToClipboard,
  });

  store.getState().setPasswordLength(16);
  const password = store.getState().password;
  const copied = await store.getState().copyPassword();

  assert.equal(copied, true);
  assert.deepEqual(writes, [password]);
  assert.equal(store.getState().isCopied, true);

  await wait(15);
  assert.equal(store.getState().isCopied, false);
});

test('copyPassword reports an error when no password exists', async () => {
  const { writes, writeToClipboard } = createClipboard();
  const store = createPasswordGeneratorStore({
    storage: createMemoryStorage(),
    writeToClipboard,
  });

  const copied = await store.getState().copyPassword();

  assert.equal(copied, false);
  assert.deepEqual(writes, []);
  assert.equal(store.getState().isCopied, false);
});

test('copyPassword reports an error when clipboard access fails', async () => {
  const store = createPasswordGeneratorStore({
    storage: createMemoryStorage(),
    writeToClipboard: async () => {
      throw new Error('copy failed');
    },
  });

  store.getState().setPasswordLength(16);
  const copied = await store.getState().copyPassword();

  assert.equal(copied, false);
  assert.equal(store.getState().isCopied, false);
});

test('persisted state excludes generated password and transient copied state', async () => {
  const storage = createMemoryStorage();
  const { writeToClipboard } = createClipboard();
  const store = createPasswordGeneratorStore({
    storage,
    writeToClipboard,
  });

  store.getState().setPasswordLength(18);
  await store.getState().copyPassword();

  const rawPersistedValue = await storage.getItem('password-storage');
  assert.notEqual(rawPersistedValue, null);

  const parsedValue: PersistedPasswordStorageValue = JSON.parse(
    rawPersistedValue ?? '{}'
  );
  assert.equal(parsedValue.state.password, undefined);
  assert.equal(parsedValue.state.isCopied, undefined);
  assert.equal(parsedValue.state.passwordLength, 18);
});
