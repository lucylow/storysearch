import React, { useState, useEffect } from 'react';
import { SearchProvider } from '../contexts/SearchContext';
import Header from './UI/Header';
import SearchInterface from './Search/SearchInterface';
import ResultsGrid from './Results/ResultsGrid';
import AISidebar from './AIFeatures/AISidebar';
import SearchAnalytics from './AIFeatures/SearchAnalytics';
import Onboarding, { QuickTips } from './UI/Onboarding';
import { useSearchShortcuts, KeyboardShortcutsHelp } from '../hooks/useKeyboardShortcuts';
import { Toast } from './UI/Skeleton';

const StorySearchApp: React.FC = () => {
  const [isAISidebarOpen, setAISidebarOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'standard' | 'ai-chat'>('standard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('storysearch_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Keyboard shortcuts
  useSearchShortcuts({
    focusSearch: () => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      searchInput?.focus();
    },
    clearSearch: () => {
      // Clear search functionality
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    toggleFilters: () => {
      const filterButton = document.querySelector('[data-testid="filter-button"]') as HTMLButtonElement;
      filterButton?.click();
    },
    toggleViewMode: () => {
      const viewModeButton = document.querySelector('[data-testid="view-mode-button"]') as HTMLButtonElement;
      viewModeButton?.click();
    },
    openAIChat: () => setAISidebarOpen(true),
    toggleVoiceSearch: () => {
      const voiceButton = document.querySelector('[data-testid="voice-button"]') as HTMLButtonElement;
      voiceButton?.click();
    }
  });

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
        />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Search & Results Area */}
            <div className={`flex-1 transition-all duration-300 ${
              isAISidebarOpen ? 'lg:mr-80' : ''
            }`}>
              {/* Search Interface */}
              <SearchInterface mode={searchMode} />
              
              {/* Results Area */}
              <div className="mt-8">
                <ResultsGrid />
              </div>
              
              {/* Search Analytics */}
              <SearchAnalytics />
            </div>
            
            {/* AI Sidebar */}
            <AISidebar 
              isOpen={isAISidebarOpen}
              onClose={() => setAISidebarOpen(false)}
            />
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