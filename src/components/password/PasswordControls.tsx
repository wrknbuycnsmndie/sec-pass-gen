import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { usePasswordGeneratorStore } from '@/store/store';
import { toast } from 'sonner';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

export const PasswordControls = () => {
  const {
    passwordLength,
    password,
    uppercase,
    lowercase,
    numbers,
    symbols,
    setPasswordLength,
    setUppercase,
    setLowercase,
    setNumbers,
    setSymbols,
    generatePassword,
  } = usePasswordGeneratorStore();

  const [isCopied, setIsCopied] = useState(false);
  const hasSelectedCharacterType =
    uppercase || lowercase || numbers || symbols;
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

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleGenerate = useCallback(() => {
    if (!hasSelectedCharacterType) {
      toast('Cannot generate password', {
        description:
          'Please select at least one character type (uppercase, lowercase, numbers, or symbols)',
      });
      return;
    }
    generatePassword();
  }, [generatePassword, hasSelectedCharacterType]);

  const copyToClipboard = useCallback(async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
      } catch {
        toast('Error', {
          description: 'Failed to copy the generated password.',
        });
        return;
      }

      setIsCopied(true);
    } else {
      toast('Error', {
        description: 'Cannot copy an empty password.',
      });
    }
  }, [password]);

  return (
    <div className='space-y-4 mt-6'>
      <Button
        onClick={handleGenerate}
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
          onValueChange={(value) => setPasswordLength(value[0])}
          className='mt-2'
          disabled={!hasSelectedCharacterType}
        />
      </div>
      <div className='flex flex-col justify-between md:flex-row gap-2 md:gap-4'>
        {passwordOptions.map((option) => (
          <div key={option.id} className='flex items-center space-x-2'>
            <Checkbox
              id={option.id}
              checked={option.checked}
              onCheckedChange={(checked) => option.onChange(!!checked)}
            />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </div>
      <Button
        className='w-full max-w-3xl flex items-center justify-center space-x-2 mt-8'
        onClick={copyToClipboard}
        aria-label={isCopied ? 'Password copied' : 'Copy password'}
        disabled={!password}
      >
        <motion.span
          key={isCopied ? 'check' : 'copy'}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {isCopied ? (
            <Check className='w-5 h-5' />
          ) : (
            <Copy className='w-5 h-5' />
          )}
        </motion.span>
        <span>{isCopied ? 'Copied!' : 'Copy password'}</span>
      </Button>
    </div>
  );
};
