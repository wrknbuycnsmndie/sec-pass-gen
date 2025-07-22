import { motion } from 'framer-motion';
import { Github, Send, X } from 'lucide-react';

export const Footer = () => {
  return (
    <motion.footer
      className='w-full bg-gradient-to-t from-muted/50 to-background py-6 px-4 sm:px-6 lg:px-8 mt-8'
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
      <div className='container mx-auto max-w-4xl flex flex-col items-center gap-4'>
        <motion.p
          className='text-lg md:text-xl font-bold text-foreground'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.8,
            delay: 1.0,
          }}
        >
          Maked by{' '}
          <motion.span
            className='text-lg md:text-xl font-bold text-primary underline decoration-primary hover:decoration-secondary transition-colors duration-700'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              duration: 0.8,
              delay: 1.0,
            }}
          >
            @wrknbuycnsmndie
          </motion.span>
        </motion.p>
        <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
          {/* telega */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              duration: 0.8,
              delay: 1.1,
            }}
          >
            <motion.a
              href='https://t.me/wrknbuycnsmndie'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-300'
              aria-label='Telegram'
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div>
                <Send className='w-5 h-5' />
              </motion.div>
              <motion.span>Telegram</motion.span>
            </motion.a>
          </motion.div>

          {/* x */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              duration: 0.8,
              delay: 1.2,
            }}
          >
            <motion.a
              href='https://x.com/wrknbuycnsmndie'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-300'
              aria-label='X'
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div>
                <X className='w-5 h-5' />
              </motion.div>
              <motion.span>X</motion.span>
            </motion.a>
          </motion.div>

          {/* github */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              duration: 0.8,
              delay: 1.3,
            }}
          >
            <motion.a
              href='https://github.com/wrknbuycnsmndie'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-300'
              aria-label='GitHub'
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div>
                <Github className='w-5 h-5' />
              </motion.div>
              <motion.span>GitHub</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};
