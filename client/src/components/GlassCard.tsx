import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  delay?: number;
}

const GlassCard = ({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  gradient = false,
  delay = 0 
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        'glass-card p-6 transition-all duration-300',
        hover && 'hover:shadow-elevated cursor-pointer',
        glow && 'shadow-glow',
        gradient && 'animated-border',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
