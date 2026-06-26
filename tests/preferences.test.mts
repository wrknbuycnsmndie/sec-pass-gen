import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_PASSWORD_PREFERENCES,
  hasSelectedCharacterSet,
  normalizePasswordPreferences,
  parsePasswordPreferences,
  serializePasswordPreferences,
} from '../src/lib/password/preferences.ts';
import { PASSWORD_PREFERENCES_STORAGE_KEY } from '../src/lib/password/storage.ts';

test('normalizePasswordPreferences applies defaults and clamps length', () => {
  const preferences = normalizePasswordPreferences({ passwordLength: 500 });

  assert.equal(preferences.passwordLength, 50);
  assert.equal(preferences.uppercase, true);
  assert.equal(preferences.lowercase, true);
  assert.equal(preferences.numbers, true);
  assert.equal(preferences.symbols, true);
});

test('hasSelectedCharacterSet detects empty selections', () => {
  assert.equal(hasSelectedCharacterSet(DEFAULT_PASSWORD_PREFERENCES), true);
  assert.equal(
    hasSelectedCharacterSet({
      ...DEFAULT_PASSWORD_PREFERENCES,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
    }),
    false
  );
});

test('serializePasswordPreferences and parsePasswordPreferences round trip', () => {
  const preferences = normalizePasswordPreferences({
    passwordLength: 18,
    lowercase: true,
    numbers: false,
  });

  const storedValue = serializePasswordPreferences(preferences);
  const parsedValue = parsePasswordPreferences(storedValue);

  assert.deepEqual(parsedValue, preferences);
});

test('parsePasswordPreferences returns null for invalid values', () => {
  assert.equal(parsePasswordPreferences(null), null);
  assert.equal(parsePasswordPreferences('not-json'), null);
});

test('storage key is stable', () => {
  assert.equal(PASSWORD_PREFERENCES_STORAGE_KEY, 'secpassgen-preferences');
});
