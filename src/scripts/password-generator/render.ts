import { hasSelectedCharacterSet, type PasswordPreferences } from '@/lib/password/preferences';
import { PASSWORD_CHARACTER_FIELDS } from '@/lib/password/rules';
import type { PasswordGeneratorElements } from './dom';

export type PasswordGeneratorStatusTone = 'info' | 'success' | 'error';

const setTextContent = (element: HTMLElement | null, value: string) => {
  if (element) {
    element.textContent = value;
  }
};

export const renderPasswordGenerator = (
  elements: PasswordGeneratorElements,
  preferences: PasswordPreferences,
  password: string,
  isCopied: boolean
) => {
  if (elements.passwordInput) {
    elements.passwordInput.value = password;
  }

  if (elements.lengthInput) {
    elements.lengthInput.value = String(preferences.passwordLength);
  }

  setTextContent(elements.lengthOutput, String(preferences.passwordLength));

  if (elements.generateButton) {
    elements.generateButton.disabled = !hasSelectedCharacterSet(preferences);
  }

  if (elements.copyButton) {
    elements.copyButton.disabled = password.length === 0;
    elements.copyButton.dataset.copied = String(isCopied);
  }

  setTextContent(elements.copyLabel, isCopied ? 'Copied!' : 'Copy password');

  for (const field of PASSWORD_CHARACTER_FIELDS) {
    const input = elements.fieldInputs[field];
    if (input) {
      input.checked = preferences[field];
    }
  }
};

export const setPasswordGeneratorStatus = (
  element: HTMLElement | null,
  message: string,
  tone: PasswordGeneratorStatusTone
) => {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.dataset.tone = tone;
};
