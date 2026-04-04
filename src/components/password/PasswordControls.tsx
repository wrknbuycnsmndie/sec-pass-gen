import { Check, Copy, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  selectCanCopyPassword,
  selectHasSelectedCharacterType,
  usePasswordGeneratorStore,
} from '@/store/store';

export const PasswordControls = () => {
  const copyPassword = usePasswordGeneratorStore((state) => state.copyPassword);
  const generatePassword = usePasswordGeneratorStore(
    (state) => state.generatePassword
  );
  const isCopied = usePasswordGeneratorStore((state) => state.isCopied);
  const numbers = usePasswordGeneratorStore((state) => state.numbers);
  const passwordLength = usePasswordGeneratorStore(
    (state) => state.passwordLength
  );
  const setLowercase = usePasswordGeneratorStore((state) => state.setLowercase);
  const setNumbers = usePasswordGeneratorStore((state) => state.setNumbers);
  const setPasswordLength = usePasswordGeneratorStore(
    (state) => state.setPasswordLength
  );
  const setSymbols = usePasswordGeneratorStore((state) => state.setSymbols);
  const setUppercase = usePasswordGeneratorStore((state) => state.setUppercase);
  const symbols = usePasswordGeneratorStore((state) => state.symbols);
  const uppercase = usePasswordGeneratorStore((state) => state.uppercase);
  const lowercase = usePasswordGeneratorStore((state) => state.lowercase);
  const hasSelectedCharacterType = usePasswordGeneratorStore(
    selectHasSelectedCharacterType
  );
  const canCopyPassword = usePasswordGeneratorStore(selectCanCopyPassword);
  const passwordOptions = [
    {
      id: 'uppercase',
      label: 'Uppercase Letters',
      checked: uppercase,
      onChange: setUppercase,
    },
    {
      id: 'lowercase',
      label: 'Lowercase Letters',
      checked: lowercase,
      onChange: setLowercase,
    },
    {
      id: 'numbers',
      label: 'Numbers',
      checked: numbers,
      onChange: setNumbers,
    },
    {
      id: 'symbols',
      label: 'Symbols',
      checked: symbols,
      onChange: setSymbols,
    },
  ] as const;

  return (
    <div className='space-y-4 mt-6'>
      <Button
        onClick={generatePassword}
        disabled={!hasSelectedCharacterType}
        className='w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90'
      >
        <RefreshCcw />
      </Button>

      <div>
        <Label htmlFor='passwordLength' className='text-foreground'>
          Password Length: {passwordLength}
        </Label>
        <Slider
          id='passwordLength'
          min={4}
          max={50}
          value={[passwordLength]}
          onValueChange={(value) => setPasswordLength(value[0] ?? passwordLength)}
          className='mt-2'
          disabled={!hasSelectedCharacterType}
        />
      </div>
      <div className='flex flex-col justify-between gap-2 md:flex-row md:gap-4'>
        {passwordOptions.map((option) => (
          <div key={option.id} className='flex items-center space-x-2'>
            <Checkbox
              id={option.id}
              checked={option.checked}
              onCheckedChange={(checked) => option.onChange(Boolean(checked))}
            />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </div>
      <Button
        className='mt-8 flex w-full max-w-3xl items-center justify-center space-x-2'
        onClick={() => void copyPassword()}
        aria-label={isCopied ? 'Password copied' : 'Copy password'}
        disabled={!canCopyPassword}
      >
        <motion.span
          key={isCopied ? 'check' : 'copy'}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {isCopied ? (
            <Check className='h-5 w-5' />
          ) : (
            <Copy className='h-5 w-5' />
          )}
        </motion.span>
        <span>{isCopied ? 'Copied!' : 'Copy password'}</span>
      </Button>
    </div>
  );
};
