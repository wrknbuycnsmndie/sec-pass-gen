import test from 'node:test';
import assert from 'node:assert/strict';

import { createPasswordGeneratorStore } from '../src/store/store.ts';

const createMemoryStorage = () => {
  const values = new Map();

  return {
    getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => {
      values.set(name, value);
    },
    removeItem: (name) => {
      values.delete(name);
    },
  };
};

test('setPasswordLength keeps the length inside the supported range', () => {
  const store = createPasswordGeneratorStore(createMemoryStorage());

  store.getState().setPasswordLength(1);
  assert.equal(store.getState().passwordLength, 4);

  store.getState().setPasswordLength(500);
  assert.equal(store.getState().passwordLength, 50);
});

test('generatePassword uses the current store settings', () => {
  const store = createPasswordGeneratorStore(createMemoryStorage());

  store.getState().setPasswordLength(14);
  store.getState().setUppercase(false);
  store.getState().setSymbols(false);
  store.getState().generatePassword();

  const password = store.getState().password;
  assert.equal(password.length, 14);
  assert.equal(/[A-Z]/.test(password), false);
  assert.equal(/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password), false);
});

test('persisted state excludes the generated password', () => {
  const storage = createMemoryStorage();
  const store = createPasswordGeneratorStore(storage);

  store.getState().setPasswordLength(18);
  store.getState().generatePassword();

  const rawPersistedValue = storage.getItem('password-storage');
  assert.notEqual(rawPersistedValue, null);

  const parsedValue = JSON.parse(rawPersistedValue ?? '{}');
  assert.equal(parsedValue.state.password, undefined);
  assert.equal(parsedValue.state.passwordLength, 18);
});
