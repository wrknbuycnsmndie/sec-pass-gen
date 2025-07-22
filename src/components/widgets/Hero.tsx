import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <div className='flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8'>
      <motion.h1
        className='text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight  bg-clip-text drop-shadow-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          duration: 0.3,
        }}
      >
        That&apos;s a cool, simple passwords generator
      </motion.h1>
      <motion.h2
        className='text-xl sm:text-2xl font-medium tracking-tight'
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          duration: 0.3,
          delay: 0.3,
        }}
      >
        I made this in inspiration of wonderful{' '}
        <a
          href={'https://lastpass.com/features/password-generator'}
          className=''
        >
          LastPass generator
        </a>
      </motion.h2>
    </div>
  );
};
