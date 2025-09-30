import React, { useState, useEffect } from 'react';
import { SearchProvider } from '../contexts/SearchContext';
import Header from './ui/Header';
import SearchInterface from './Search/SearchInterface';
import MobileSearchInterface from './Search/MobileSearchInterface';
import ResultsGrid from './Results/ResultsGrid';
import AISidebar from './AIFeatures/AISidebar';
import SearchAnalytics from './AIFeatures/SearchAnalytics';
import Onboarding, { QuickTips } from './ui/Onboarding';
import MobileNavigation from './ui/MobileNavigation';
import CrawlerDashboard from './WebCrawler/CrawlerDashboard';
import { useKeyboardShortcuts, defaultShortcuts } from '../hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from './UI/KeyboardShortcutsHelp';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorBoundary from './ui/ErrorBoundary';
import { useMobile } from '../hooks/useMobile';
import { Toast } from './ui/Skeleton';
import PredictiveSurfacing from './AIFeatures/PredictiveSurfacing';
import BrandSwitcher from './BrandSwitcher';
import { useBrandSearch } from '../hooks/useBrandSearch';

const StorySearchApp: React.FC = () => {
  const [isAISidebarOpen, setAISidebarOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'standard' | 'ai-chat'>('standard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCrawlerDashboard, setShowCrawlerDashboard] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);
  
  // Mobile detection
  const { isMobile, isTablet } = useMobile();
  
  // Brand search integration
  useBrandSearch();

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('storysearch_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Keyboard shortcuts
  const shortcuts = [
    ...defaultShortcuts,
    {
      key: '?',
      action: () => setShowKeyboardHelp(true),
      description: 'Show keyboard shortcuts',
      category: 'Help'
    },
    {
      key: 'c',
      ctrl: true,
      action: () => setShowCrawlerDashboard(true),
      description: 'Open crawler dashboard',
      category: 'Tools'
    },
    {
      key: 'a',
      ctrl: true,
      action: () => setAISidebarOpen(!isAISidebarOpen),
      description: 'Toggle AI assistant',
      category: 'AI'
    }
  ];
  
  useKeyboardShortcuts(shortcuts);

  // Add toast notification
  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // Remove toast notification
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem('storysearch_onboarding_completed', 'true');
    addToast('Welcome to StorySearch AI! 🎉', 'success');
  };

  return (
    <SearchProvider>
      <div className="min-h-screen bg-hero-gradient">
        {/* Header */}
        <Header 
          onAIToggle={() => setAISidebarOpen(!isAISidebarOpen)}
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          onShowTips={() => setShowQuickTips(true)}
          onShowHelp={() => setShowKeyboardHelp(true)}
          onShowCrawler={() => setShowCrawlerDashboard(true)}
        />

        {/* Mobile Navigation */}
        {isMobile && (
          <MobileNavigation
            onSearchFocus={() => setShowMobileSearch(true)}
            onAIChatOpen={() => setAISidebarOpen(true)}
            onAnalyticsOpen={() => {}}
            currentPage={searchMode}
          />
        )}
        
        {/* Mobile Search Overlay */}
        {isMobile && showMobileSearch && (
          <div className="fixed inset-0 z-50 bg-background">
            <MobileSearchInterface 
              isFullscreen={true}
              onBack={() => setShowMobileSearch(false)}
            />
          </div>
        )}

        {/* Web Crawler Dashboard */}
        {showCrawlerDashboard && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl">
            <CrawlerDashboard onClose={() => setShowCrawlerDashboard(false)} />
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-4 sm:py-8">
          {/* Brand Switcher - Demo Feature */}
          <div className="mb-6 flex justify-end">
            <BrandSwitcher />
          </div>
          
          <div className={`${isMobile ? 'block' : 'flex gap-8'}`}>
            {/* Search & Results Area */}
            <div className={`${isMobile ? 'w-full' : 'flex-1 transition-all duration-300'} ${
              !isMobile && isAISidebarOpen ? 'lg:mr-80' : ''
            }`}>
              {isMobile ? (
                <div className="space-y-6">
                  <MobileSearchInterface />
                  <ResultsGrid />
                </div>
              ) : (
                <>
                  {/* Search Interface */}
                  <SearchInterface mode={searchMode} />
                  
                  {/* Predictive Surfacing */}
                  <div className="mt-8">
                    <PredictiveSurfacing onContentClick={(contentId) => console.log('Content clicked:', contentId)} />
                  </div>
                  
                  {/* Results Area */}
                  <div className="mt-8">
                    <ResultsGrid />
                  </div>
                  
                  {/* Search Analytics */}
                  <SearchAnalytics />
                </>
              )}
            </div>
            
            {/* AI Sidebar - Desktop Only */}
            {!isMobile && (
              <AISidebar 
                isOpen={isAISidebarOpen}
                onClose={() => setAISidebarOpen(false)}
              />
            )}
          </div>
        </div>

        {/* UX Enhancements */}
        <Onboarding 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
        
        <QuickTips 
          isOpen={showQuickTips}
          onClose={() => setShowQuickTips(false)}
        />
        
        <KeyboardShortcutsHelp 
          isOpen={showKeyboardHelp}
          onClose={() => setShowKeyboardHelp(false)}
        />

        {/* Toast Notifications */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </SearchProvider>
  );
};

export default StorySearchApp;