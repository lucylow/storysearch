import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  Brain,
  BarChart3,
  FileText,
  Settings,
  BookOpen,
  Zap,
  Menu,
  X,
  Library,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  {
    name: 'Home',
    path: '/',
    icon: Home,
    description: 'Welcome to StorySearch AI',
    badge: null
  },
  {
    name: 'Search App',
    path: '/app',
    icon: Search,
    description: 'Main search interface',
    badge: null
  },
  {
    name: 'AI Search',
    path: '/hackathon',
    icon: Brain,
    description: 'Advanced Algolia AI features',
    badge: { text: 'New', variant: 'success' as const }
  },
  {
    name: 'AI Agents',
    path: '/ai-agents',
    icon: Zap,
    description: 'Intelligent AI agents dashboard',
    badge: { text: 'AI', variant: 'primary' as const }
  },
  {
    name: 'Analytics',
    path: '/reports',
    icon: BarChart3,
    description: 'AI-powered analytics & insights',
    badge: null
  },
  {
    name: 'Content Library',
    path: '/content',
    icon: Library,
    description: 'Browse all content',
    badge: null
  },
  {
    name: 'Documentation',
    path: '/docs',
    icon: BookOpen,
    description: 'API docs & guides',
    badge: null
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'Configure preferences',
    badge: null
  }
];

const MainNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                StorySearch AI
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.slice(0, 6).map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge.variant === 'success' ? 'default' : 'secondary'}
                          className="text-xs py-0 px-1 h-4"
                        >
                          {item.badge.text}
                        </Badge>
                      )}
                    </motion.div>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-background border-l border-border z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-bold">Menu</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const active = isActive(item.path);
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                            active
                              ? 'bg-gradient-to-r from-primary/20 to-purple-600/20 border-2 border-primary/50 shadow-lg'
                              : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              active
                                ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                                : 'bg-background'
                            }`}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm">{item.name}</span>
                                {item.badge && (
                                  <Badge 
                                    variant={item.badge.variant === 'success' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {item.badge.text}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${
                            active ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Footer */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    StorySearch AI v1.0
                    <br />
                    Powered by Algolia & OpenAI
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainNavigation;

