import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const ToastNotification: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      color: 'from-green-500 to-green-700',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500/30',
      text: 'text-green-700 dark:text-green-300'
    },
    error: {
      icon: XCircle,
      color: 'from-red-500 to-red-700',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500/30',
      text: 'text-red-700 dark:text-red-300'
    },
    warning: {
      icon: AlertTriangle,
      color: 'from-yellow-500 to-yellow-700',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-700 dark:text-yellow-300'
    },
    info: {
      icon: Info,
      color: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500/30',
      text: 'text-blue-700 dark:text-blue-300'
    }
  };

  const { icon: Icon, color, bg, border, text } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`flex items-center space-x-3 ${bg} border ${border} rounded-xl p-4 shadow-lg backdrop-blur-sm min-w-[320px] max-w-md`}
    >
      <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>

      <p className={`flex-1 text-sm font-medium ${text}`}>
        {message}
      </p>

      <button
        onClick={onClose}
        className={`p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors`}
      >
        <X className={`w-4 h-4 ${text}`} />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} rounded-bl-xl`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
