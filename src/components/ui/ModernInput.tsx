import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'outlined';
}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    icon, 
    iconPosition = 'left',
    variant = 'default',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    const baseClasses = "flex w-full transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
    
    const variants = {
      default: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
      filled: "rounded-lg border-0 bg-slate-100 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20",
      outlined: "rounded-lg border-2 border-slate-200 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    };

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            className={cn(
              "text-sm font-medium text-slate-700",
              error && "text-red-600"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          
          <motion.input
            ref={ref}
            type={inputType}
            className={cn(
              baseClasses,
              variants[variant],
              icon && iconPosition === 'left' && "pl-10",
              icon && iconPosition === 'right' && "pr-10",
              type === 'password' && "pr-20",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {type === 'password' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {icon && iconPosition === 'right' && type !== 'password' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          
          {/* Focus ring animation */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-lg ring-2 ring-blue-500/20 pointer-events-none"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
        
        {error && (
          <motion.p
            className="text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

ModernInput.displayName = "ModernInput";

export { ModernInput };
