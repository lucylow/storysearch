import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  animated?: boolean;
}

const ModernBadge = React.forwardRef<HTMLDivElement, ModernBadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    children, 
    icon, 
    animated = false,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center font-medium transition-all duration-300";
    
    const variants = {
      default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      success: "bg-green-100 text-green-700 hover:bg-green-200",
      warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      error: "bg-red-100 text-red-700 hover:bg-red-200",
      info: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
    };
    
    const sizes = {
      sm: "px-2 py-1 text-xs rounded-md",
      md: "px-3 py-1 text-sm rounded-lg",
      lg: "px-4 py-2 text-base rounded-lg"
    };

    const BadgeContent = (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && (
          <motion.span
            className="mr-1.5"
            animate={animated ? { rotate: [0, 360] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </div>
    );

    if (animated) {
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {BadgeContent}
        </motion.div>
      );
    }

    return BadgeContent;
  }
);

ModernBadge.displayName = "ModernBadge";

export { ModernBadge };
