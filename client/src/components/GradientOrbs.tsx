import { motion } from 'framer-motion';

interface GradientOrbsProps {
  variant?: 'hero' | 'page' | 'minimal';
}

const GradientOrbs = ({ variant = 'page' }: GradientOrbsProps) => {
  if (variant === 'minimal') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="gradient-orb gradient-orb-1 -top-40 -right-40 opacity-30"
        />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="gradient-orb gradient-orb-1 -top-60 -left-60"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="gradient-orb gradient-orb-2 top-1/4 -right-40"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="gradient-orb gradient-orb-3 bottom-20 left-1/4"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl bottom-40 right-1/4"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="gradient-orb gradient-orb-1 -top-40 -right-40 opacity-40"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="gradient-orb gradient-orb-2 bottom-0 -left-40 opacity-30"
      />
    </div>
  );
};

export default GradientOrbs;
