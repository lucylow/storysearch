import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  children: React.ReactNode;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseClasses = "rounded-xl transition-all duration-300";
    
    const variants = {
      default: "bg-white border border-slate-200 shadow-sm",
      glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg",
      gradient: "bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-md",
      elevated: "bg-white border border-slate-200 shadow-lg hover:shadow-xl"
    };
    
    const hoverClasses = hover ? "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1" : "";

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          hoverClasses,
          className
        )}
        whileHover={hover ? { y: -4, scale: 1.02 } : {}}
        transition={{ duration: 0.3, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ModernCard.displayName = "ModernCard";

// Card sub-components
const ModernCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
ModernCardHeader.displayName = "ModernCardHeader";

const ModernCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
ModernCardTitle.displayName = "ModernCardTitle";

const ModernCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-slate-600", className)}
      {...props}
    />
  )
);
ModernCardDescription.displayName = "ModernCardDescription";

const ModernCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
ModernCardContent.displayName = "ModernCardContent";

const ModernCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
ModernCardFooter.displayName = "ModernCardFooter";

export { 
  ModernCard, 
  ModernCardHeader, 
  ModernCardFooter, 
  ModernCardTitle, 
  ModernCardDescription, 
  ModernCardContent 
};
