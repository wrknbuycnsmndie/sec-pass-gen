import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CHAR_SETS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  generatePassword,
} from '../src/lib/password.ts';

const containsCharacterFromSet = (password, characters) =>
  password.split('').some((character) => characters.includes(character));

test('generatePassword returns the requested length', () => {
  const password = generatePassword({
    passwordLength: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  assert.equal(password.length, 16);
});

test('generatePassword includes at least one character from each selected set', () => {
  const password = generatePassword({
    passwordLength: 24,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  assert.equal(containsCharacterFromSet(password, CHAR_SETS.uppercase), true);
  assert.equal(containsCharacterFromSet(password, CHAR_SETS.lowercase), true);
  assert.equal(containsCharacterFromSet(password, CHAR_SETS.numbers), true);
  assert.equal(containsCharacterFromSet(password, CHAR_SETS.symbols), true);
});

test('generatePassword only uses characters from the selected sets', () => {
  const password = generatePassword({
    passwordLength: 20,
    uppercase: false,
    lowercase: true,
    numbers: true,
    symbols: false,
  });

  const allowedCharacters = `${CHAR_SETS.lowercase}${CHAR_SETS.numbers}`;
  assert.equal(
    password.split('').every((character) => allowedCharacters.includes(character)),
    true
  );
});

test('generatePassword clamps lengths to the supported range', () => {
  const tooShortPassword = generatePassword({
    passwordLength: 1,
    uppercase: true,
    lowercase: false,
    numbers: false,
    symbols: false,
  });
  const tooLongPassword = generatePassword({
    passwordLength: 500,
    uppercase: true,
    lowercase: false,
    numbers: false,
    symbols: false,
  });

  assert.equal(tooShortPassword.length, MIN_PASSWORD_LENGTH);
  assert.equal(tooLongPassword.length, MAX_PASSWORD_LENGTH);
});

test('generatePassword returns an empty string when no character sets are selected', () => {
  const password = generatePassword({
    passwordLength: 12,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
  });

  assert.equal(password, '');
});
