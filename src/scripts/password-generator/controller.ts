import { generatePassword } from '@/lib/password/generator';
import {
  hasSelectedCharacterSet,
  normalizePasswordPreferences,
  type PasswordPreferences,
} from '@/lib/password/preferences';
import { PASSWORD_CHARACTER_FIELDS } from '@/lib/password/rules';
import { readPasswordPreferences, savePasswordPreferences } from '@/lib/password/storage';
import {
  bindPasswordGeneratorElements,
  queryPasswordGeneratorRoot,
  queryThemeButton,
} from './dom';
import { renderPasswordGenerator, setPasswordGeneratorStatus } from './render';
import {
  applyTheme,
  readThemePreference,
  saveThemePreference,
  syncThemeButton,
} from '@/scripts/theme';

const COPY_LABEL_RESET_MS = 2000;
const STATUS_MESSAGES = {
  copied: 'Password copied to clipboard.',
  copyError: 'Unable to copy password.',
  generateFirst: 'Generate a password first.',
  generated: 'Password generated.',
  noCharacterType: 'Pick at least one character type.',
  preferencesSaved: 'Preferences saved.',
  ready: 'Ready when you are.',
  updated: 'Password updated.',
} as const;

export const initPasswordApp = () => {
  const root = queryPasswordGeneratorRoot();
  const themeButton = queryThemeButton();

  if (!root) {
    return;
  }

  const elements = bindPasswordGeneratorElements(root);
  let preferences = readPasswordPreferences();
  let password = '';
  let isCopied = false;
  let isDark = readThemePreference();
  let copyResetTimeout: ReturnType<typeof setTimeout> | null = null;

  const render = () => {
    renderPasswordGenerator(elements, preferences, password, isCopied);
  };

  const updateTheme = () => {
    applyTheme(isDark);
    syncThemeButton(themeButton, isDark);
  };

  const clearCopyResetTimeout = () => {
    if (copyResetTimeout === null) {
      return;
    }

    clearTimeout(copyResetTimeout);
    copyResetTimeout = null;
  };

  const resetCopiedState = () => {
    isCopied = false;
    render();
  };

  const scheduleCopiedStateReset = () => {
    clearCopyResetTimeout();
    copyResetTimeout = setTimeout(resetCopiedState, COPY_LABEL_RESET_MS);
  };

  const updatePreferences = (nextPreferences: PasswordPreferences) => {
    preferences = normalizePasswordPreferences(nextPreferences);
    savePasswordPreferences(preferences);
    isCopied = false;
    render();
  };

  const generateCurrentPassword = (message = STATUS_MESSAGES.generated) => {
    if (!hasSelectedCharacterSet(preferences)) {
      setPasswordGeneratorStatus(elements.status, STATUS_MESSAGES.noCharacterType, 'error');
      return false;
    }

    password = generatePassword(preferences);
    isCopied = false;
    render();
    setPasswordGeneratorStatus(elements.status, message, 'success');
    return true;
  };

  updateTheme();
  render();
  setPasswordGeneratorStatus(elements.status, STATUS_MESSAGES.ready, 'info');

  for (const field of PASSWORD_CHARACTER_FIELDS) {
    const input = elements.fieldInputs[field];

    input?.addEventListener('change', () => {
      updatePreferences({ ...preferences, [field]: input.checked });
      setPasswordGeneratorStatus(elements.status, STATUS_MESSAGES.preferencesSaved, 'info');
    });
  }

  elements.lengthInput?.addEventListener('input', () => {
    updatePreferences({
      ...preferences,
      passwordLength: Number(elements.lengthInput?.value ?? preferences.passwordLength),
    });

    if (password) {
      generateCurrentPassword(STATUS_MESSAGES.updated);
      return;
    }

    if (!hasSelectedCharacterSet(preferences)) {
      setPasswordGeneratorStatus(elements.status, STATUS_MESSAGES.noCharacterType, 'error');
    }
  });

  elements.generateButton?.addEventListener('click', () => {
    generateCurrentPassword();
  });

  elements.copyButton?.addEventListener('click', async () => {
    if (!password) {
      setPasswordGeneratorStatus(elements.status, STATUS_MESSAGES.generateFirst, 'error');
      return;
    }

    try {
      await globalThis.navigator.clipboard.writeText(password);
      isCopied = true;
      render();
      scheduleCopiedStateReset();
      setPasswordGeneratorStatus(elements.status, STATUS_MESSAGES.copied, 'success');
    } catch {
      setPasswordGeneratorStatus(elements.status, STATUS_MESSAGES.copyError, 'error');
    }
  });

  themeButton?.addEventListener('click', () => {
    isDark = !isDark;
    updateTheme();
    saveThemePreference(isDark);
  });
};
