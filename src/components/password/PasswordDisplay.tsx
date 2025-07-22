import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePasswordGeneratorStore } from '@/store/store';

export const PasswordDisplay = () => {
  const password = usePasswordGeneratorStore((state) => state.password);

  return (
    <div className='space-y-4'>
      <div className='relative'>
        <Label htmlFor='generatedPassword' className='text-foreground'>
          Generated Password
        </Label>
        <Input
          id='generatedPassword'
          type='text'
          value={password}
          readOnly
          className='mt-1 w-full bg-background text-foreground border-input'
          placeholder='Your password will appear here'
        />
      </div>
    </div>
  );
};
