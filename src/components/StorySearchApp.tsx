import React, { useState } from 'react';
import { SearchProvider } from '../contexts/SearchContext';
import { AIContextProvider } from '../contexts/AIContext';
import Header from './UI/Header';
import SearchInterface from './Search/SearchInterface';
import ResultsGrid from './Results/ResultsGrid';
import AISidebar from './AIFeatures/AISidebar';
import SearchAnalytics from './AIFeatures/SearchAnalytics';

const StorySearchApp: React.FC = () => {
  const [isAISidebarOpen, setAISidebarOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'standard' | 'ai-chat'>('standard');

  return (
    <SearchProvider>
      <AIContextProvider>
        <div className="min-h-screen bg-hero-gradient">
          {/* Header */}
          <Header 
            onAIToggle={() => setAISidebarOpen(!isAISidebarOpen)}
            searchMode={searchMode}
            onSearchModeChange={setSearchMode}
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
        </div>
      </AIContextProvider>
    </SearchProvider>
  );
};

export default StorySearchApp;