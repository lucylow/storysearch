import React from 'react';
import { Search, Bot, MessageCircle, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAIToggle: () => void;
  searchMode: 'standard' | 'ai-chat';
  onSearchModeChange: (mode: 'standard' | 'ai-chat') => void;
}

const Header: React.FC<HeaderProps> = ({ onAIToggle, searchMode, onSearchModeChange }) => {
  return (
    <header className="glass border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-ai-gradient rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-hero">StorySearch AI</h1>
              <p className="text-xs text-muted-foreground">Intelligent Content Discovery</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => onSearchModeChange('standard')}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button 
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => onSearchModeChange('ai-chat')}
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Chat</span>
            </button>
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onAIToggle}
              className="p-2 glass rounded-xl hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all"
              title="Toggle AI Assistant"
            >
              <Bot className="w-5 h-5 text-primary" />
            </button>
            <button className="p-2 glass rounded-xl hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;