import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn-ai-primary"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;