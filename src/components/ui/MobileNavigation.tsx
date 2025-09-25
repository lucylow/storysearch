import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Bot, 
  BarChart3, 
  Settings, 
  User,
  Home,
  Filter,
  Bookmark,
  History
} from 'lucide-react';

interface MobileNavigationProps {
  onSearchFocus?: () => void;
  onAIChatOpen?: () => void;
  onAnalyticsOpen?: () => void;
  currentPage?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onSearchFocus,
  onAIChatOpen,
  onAnalyticsOpen,
  currentPage = 'search'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'search', label: 'Search', icon: Search, action: onSearchFocus },
    { id: 'ai-chat', label: 'AI Chat', icon: Bot, action: onAIChatOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, action: onAnalyticsOpen },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, action: () => {} },
    { id: 'history', label: 'History', icon: History, action: () => {} },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => {} }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl border-r border-border z-50 md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">StorySearch AI</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.action?.();
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* User Section */}
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Welcome back!
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Ready to discover content
                      </p>
                    </div>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
