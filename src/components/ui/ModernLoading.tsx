import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
}

const ModernLoading: React.FC<ModernLoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className,
  text
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    primary: 'text-blue-600',
    secondary: 'text-slate-600',
    white: 'text-white'
  };

  const Spinner = () => (
    <motion.div
      className={cn(sizes[size], colors[color])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60 60"
          strokeDashoffset="60"
        />
      </svg>
    </motion.div>
  );

  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('w-2 h-2 rounded-full', colors[color])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <motion.div
      className={cn('rounded-full', colors[color], sizes[size])}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ backgroundColor: 'currentColor' }}
    />
  );

  const Bars = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn('w-1 rounded-full', colors[color])}
          animate={{
            height: ['4px', '20px', '4px']
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner />;
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'bars':
        return <Bars />;
      default:
        return <Spinner />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      {renderLoader()}
      {text && (
        <motion.p
          className={cn('text-sm font-medium', colors[color])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export { ModernLoading };
