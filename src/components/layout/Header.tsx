import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeSwitch } from '../shared/ThemeSwitch';

export const Header = () => {
  return (
    <motion.header
      className='sticky top-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm'
      role='banner'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.1,
        delay: 0.2,
      }}
    >
      <div className='w-full flex items-center justify-center p-4 relative'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.2,
            delay: 0.2,
          }}
        >
          <motion.p
            className='text-2xl md:text-4xl font-bold text-primary'
            aria-label='SecPassGen - Home'
          >
            SecPassGen
          </motion.p>
        </motion.div>
        <motion.div
          className='absolute top-4 right-4'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.8,
            delay: 1.6,
          }}
          whileHover={{ scale: 1.1 }}
        >
          <ThemeSwitch />
        </motion.div>
      </div>
    </motion.header>
  );
};
