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
  const passwordLength = usePasswordGeneratorStore(
    (state) => state.passwordLength
  );
  const password = usePasswordGeneratorStore((state) => state.password);
  const uppercase = usePasswordGeneratorStore((state) => state.uppercase);
  const lowercase = usePasswordGeneratorStore((state) => state.lowercase);
  const numbers = usePasswordGeneratorStore((state) => state.numbers);
  const symbols = usePasswordGeneratorStore((state) => state.symbols);
  const setPasswordLength = usePasswordGeneratorStore(
    (state) => state.setPasswordLength
  );
  const setUppercase = usePasswordGeneratorStore((state) => state.setUppercase);
  const setLowercase = usePasswordGeneratorStore((state) => state.setLowercase);
  const setNumbers = usePasswordGeneratorStore((state) => state.setNumbers);
  const setSymbols = usePasswordGeneratorStore((state) => state.setSymbols);
  const generatePassword = usePasswordGeneratorStore(
    (state) => state.generatePassword
  );

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleGenerate = useCallback(() => {
    if (!uppercase && !lowercase && !numbers && !symbols) {
      toast('The generated password has been copied to your clipboard.', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
      return;
    }
    generatePassword(uppercase, lowercase, numbers, symbols);
  }, [uppercase, lowercase, numbers, symbols, generatePassword, toast]);

  const copyToClipboard = useCallback(() => {
    if (password) {
      navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast('Error', {
        description: 'Cannot copy an empty password.',
      });
    }
  }, [password, toast]);

  return (
    <div className='space-y-4 mt-6'>
      <Button
        onClick={handleGenerate}
        disabled={!uppercase && !lowercase && !numbers && !symbols}
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
          disabled={!uppercase && !lowercase && !numbers && !symbols}
        />
      </div>
      <div className='flex flex-col justify-between md:flex-row gap-2 md:gap-4'>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='uppercase'
            checked={uppercase}
            onCheckedChange={(checked) => setUppercase(!!checked)}
          />
          <Label htmlFor='uppercase'>Uppercase Letters</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='lowercase'
            checked={lowercase}
            onCheckedChange={(checked) => setLowercase(!!checked)}
          />
          <Label htmlFor='lowercase'>Lowercase Letters</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='numbers'
            checked={numbers}
            onCheckedChange={(checked) => setNumbers(!!checked)}
          />
          <Label htmlFor='numbers'>Numbers</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='symbols'
            checked={symbols}
            onCheckedChange={(checked) => setSymbols(!!checked)}
          />
          <Label htmlFor='symbols'>Symbols</Label>
        </div>
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
