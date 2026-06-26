import { PASSWORD_CHARACTER_FIELDS, type PasswordCharacterField } from '@/lib/password/rules';

export interface PasswordGeneratorElements {
  passwordInput: HTMLInputElement | null;
  lengthInput: HTMLInputElement | null;
  lengthOutput: HTMLOutputElement | null;
  generateButton: HTMLButtonElement | null;
  copyButton: HTMLButtonElement | null;
  copyLabel: HTMLElement | null;
  status: HTMLElement | null;
  fieldInputs: Record<PasswordCharacterField, HTMLInputElement | null>;
}

export const queryPasswordGeneratorRoot = () =>
  document.querySelector<HTMLElement>('[data-password-generator]');

export const queryThemeButton = () =>
  document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

export const bindPasswordGeneratorElements = (root: HTMLElement): PasswordGeneratorElements => ({
  passwordInput: root.querySelector<HTMLInputElement>('[data-password-output]'),
  lengthInput: root.querySelector<HTMLInputElement>('[data-password-length]'),
  lengthOutput: root.querySelector<HTMLOutputElement>('[data-password-length-output]'),
  generateButton: root.querySelector<HTMLButtonElement>('[data-generate-password]'),
  copyButton: root.querySelector<HTMLButtonElement>('[data-copy-password]'),
  copyLabel: root.querySelector<HTMLElement>('[data-copy-label]'),
  status: root.querySelector<HTMLElement>('[data-password-status]'),
  fieldInputs: Object.fromEntries(
    PASSWORD_CHARACTER_FIELDS.map((field) => [
      field,
      root.querySelector<HTMLInputElement>(`[data-password-field="${field}"]`),
    ])
  ) as Record<PasswordCharacterField, HTMLInputElement | null>,
});
