import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { TooltipWrapper } from './TooltipWrapper';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='w-10 h-6 bg-muted animate-pulse rounded-full' />;
  }

  return (
    <TooltipWrapper label='Toggle theme' asChild>
      <Button
        className={cn('cursor-pointer')}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label='Toggle theme'
      >
        {theme === 'light' ? <Sun /> : <Moon />}
      </Button>
    </TooltipWrapper>
  );
};
