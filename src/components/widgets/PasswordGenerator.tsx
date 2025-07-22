import { PasswordControls } from '@/components/password/PasswordControls';
import { PasswordDisplay } from '@/components/password/PasswordDisplay';
import { motion } from 'motion/react';

export const PasswordGenerator = () => {
  return (
    <motion.div
      className='container mx-auto p-4 max-w-3xl flex flex-col items-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <motion.h3
        className='text-xl md:text-3xl text-center font-bold text-foreground mb-4 
        underline decoration-primary hover:decoration-secondary transition-colors duration-700'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          duration: 0.8,
        }}
      >
        Generate your secure password
      </motion.h3>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          duration: 0.8,
          delay: 0.3,
        }}
      >
        <PasswordDisplay />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          duration: 0.8,
          delay: 0.9,
        }}
      >
        <PasswordControls />
      </motion.div>
    </motion.div>
  );
};
