import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bot, 
  MessageCircle, 
  Settings, 
  User, 
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

interface HeaderProps {
  onAIToggle: () => void;
  searchMode: 'standard' | 'ai-chat';
  onSearchModeChange: (mode: 'standard' | 'ai-chat') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAIToggle, 
  searchMode, 
  onSearchModeChange 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <div className="w-10 h-10 bg-ai-gradient rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-hero">
                StorySearch AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Intelligent Content Discovery
              </p>
            </div>
          </motion.div>

          {/* Search Mode Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="glass rounded-xl p-1 border border-border/50">
              <button
                onClick={() => onSearchModeChange('standard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  searchMode === 'standard'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Search</span>
              </button>
              <button
                onClick={() => onSearchModeChange('ai-chat')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  searchMode === 'ai-chat'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">AI Chat</span>
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* AI Assistant Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAIToggle}
              className="group relative p-3 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
              title="Toggle AI Assistant"
            >
              <Bot className="w-5 h-5 text-primary group-hover:animate-pulse-glow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse-glow" />
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </motion.button>

            {/* User Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
              title="User Profile"
            >
              <User className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: mobileMenuOpen ? 1 : 0, 
            height: mobileMenuOpen ? 'auto' : 0 
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 space-y-3">
            {/* Mobile Search Mode Toggle */}
            <div className="glass rounded-xl p-1 border border-border/50">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    onSearchModeChange('standard');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                    searchMode === 'standard'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm font-medium">Search</span>
                </button>
                <button
                  onClick={() => {
                    onSearchModeChange('ai-chat');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                    searchMode === 'ai-chat'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Chat</span>
                </button>
              </div>
            </div>

            {/* Mobile AI Toggle */}
            <button
              onClick={() => {
                onAIToggle();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <Bot className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Toggle AI Assistant</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
