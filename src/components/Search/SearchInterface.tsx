import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Camera, 
  Sparkles, 
  MessageCircle, 
  Brain, 
  Zap, 
  TrendingUp, 
  Lightbulb, 
  ArrowRight, 
  Target,
  Clock,
  History,
  Star,
  Filter,
  X,
  ChevronDown,
  Bookmark,
  Eye,
  Upload,
  Image,
  FileText,
  Video,
  Music,
  Wand2,
  Scan,
  Palette,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearch } from '../../hooks/useSearch';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { storyblokService, SearchEnhancement } from '../../services/storyblokService';
import { algoliaService } from '../../services/algoliaService';
import AIChatInterface from './AIChatInterface';

interface SearchInterfaceProps {
  mode: 'standard' | 'ai-chat';
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ mode }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [enhancement, setEnhancement] = useState<SearchEnhancement | null>(null);
  const [showEnhancement, setShowEnhancement] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    suggestions: string[];
    popular: string[];
    trending: string[];
    categories: Array<{ name: string; count: number }>;
  }>({
    suggestions: [],
    popular: [],
    trending: [],
    categories: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Multi-modal search state
  const [searchMode, setSearchMode] = useState<'text' | 'voice' | 'image' | 'video' | 'audio'>('text');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileAnalysis, setFileAnalysis] = useState<{
    type: string;
    description: string;
    tags: string[];
    confidence: number;
  } | null>(null);
  
  // Enhanced UI/UX state
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const { search, isLoading, suggestions: hookSuggestions, searchHistory: hookHistory } = useSearch();
  const { isListening, startListening, stopListening, error: voiceError, transcript, clearError } = useVoiceSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load suggestions and history
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const suggestionsData = await algoliaService.getSuggestions(query);
        setSuggestions(suggestionsData);
        setSearchHistory(hookHistory);
      } catch (error) {
        console.error('Failed to load suggestions:', error);
      }
    };

    if (query.length > 0) {
      loadSuggestions();
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, hookHistory]);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const allSuggestions = [
      ...suggestions.suggestions,
      ...suggestions.popular,
      ...suggestions.trending
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && allSuggestions[selectedSuggestionIndex]) {
          const selectedQuery = allSuggestions[selectedSuggestionIndex];
          setQuery(selectedQuery);
          handleSearch(selectedQuery);
          setShowSuggestions(false);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      await search(searchQuery);
    }
  };

  const handleVoiceSearch = async () => {
    if (isListening) {
      stopListening();
    } else {
      clearError();
      const result = await startListening();
      if (result) {
        setQuery(result);
        handleSearch(result);
      }
    }
  };

  // Enhanced multi-modal search functions
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessingFile(true);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Create preview for images/videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const preview = URL.createObjectURL(file);
        setFilePreview(preview);
      }
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Analyze file with AI
      const analysis = await analyzeFileWithAI(file);
      setFileAnalysis(analysis);
      
      // Complete progress
      setAnalysisProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 500);
      
      // Generate search query from file analysis
      const searchQuery = generateSearchQueryFromFile(analysis);
      setQuery(searchQuery);
      
    } catch (error) {
      console.error('File analysis failed:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const analyzeFileWithAI = async (file: File) => {
    // Simulate AI file analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fileType = file.type.split('/')[0];
    let analysis;
    
    switch (fileType) {
      case 'image':
        analysis = {
          type: 'image',
          description: 'A modern website design with clean layout and professional styling',
          tags: ['web-design', 'modern', 'clean', 'professional', 'layout'],
          confidence: 0.92
        };
        break;
      case 'video':
        analysis = {
          type: 'video',
          description: 'Tutorial video showing Storyblok CMS setup and configuration',
          tags: ['tutorial', 'storyblok', 'setup', 'configuration', 'cms'],
          confidence: 0.88
        };
        break;
      case 'audio':
        analysis = {
          type: 'audio',
          description: 'Podcast episode discussing headless CMS benefits and implementation',
          tags: ['podcast', 'headless-cms', 'benefits', 'implementation', 'discussion'],
          confidence: 0.85
        };
        break;
      default:
        analysis = {
          type: 'document',
          description: 'Technical documentation about content management systems',
          tags: ['documentation', 'cms', 'technical', 'content-management'],
          confidence: 0.78
        };
    }
    
    return analysis;
  };

  const generateSearchQueryFromFile = (analysis: any) => {
    const primaryTags = analysis.tags.slice(0, 2).join(' ');
    return `${analysis.description} ${primaryTags}`;
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setFileAnalysis(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
  };

  const getSearchModeIcon = () => {
    switch (searchMode) {
      case 'voice': return <Mic className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <Type className="w-5 h-5" />;
    }
  };

  const getSearchModeColor = () => {
    switch (searchMode) {
      case 'voice': return 'text-blue-600';
      case 'image': return 'text-green-600';
      case 'video': return 'text-purple-600';
      case 'audio': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const quickQueries = [
    "How to set up Storyblok with Next.js?",
    "Best practices for headless CMS",
    "Content modeling examples",
    "API integration tutorials",
    "SEO optimization strategies",
    "Performance optimization techniques",
    "Multilingual content management",
    "Webhook implementation guide"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    handleSearch(historyItem);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Search Input Area */}
      <AnimatePresence mode="wait">
        {mode === 'standard' ? (
          <motion.div
            key="standard-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <motion.div 
              className="relative"
              animate={{ 
                scale: isFocused ? 1.02 : 1,
                y: isFocused ? -2 : 0
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Drag and Drop Overlay */}
              <AnimatePresence>
                {isDragOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl border-2 border-dashed border-primary/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto mb-2 text-primary animate-bounce" />
                        <p className="text-lg font-medium text-primary">Drop your file here</p>
                        <p className="text-sm text-muted-foreground">Images, videos, audio, or documents</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Multi-Modal Search Mode Indicator */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <motion.div
                  className={`p-2 rounded-lg transition-all duration-300 ${getSearchModeColor()}`}
                  animate={{ scale: isFocused ? 1.1 : 1 }}
                >
                  {getSearchModeIcon()}
                </motion.div>
                <AnimatePresence>
                  {isFocused && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium text-muted-foreground capitalize"
                    >
                      {searchMode} search
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  if (query.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={
                  searchMode === 'voice' ? "Click mic to start voice search..." :
                  searchMode === 'image' ? "Upload an image or drag & drop..." :
                  searchMode === 'video' ? "Upload a video or drag & drop..." :
                  searchMode === 'audio' ? "Upload audio or drag & drop..." :
                  "Ask anything about your Storyblok content..."
                }
                className="w-full pl-20 pr-32 py-6 text-xl glass rounded-3xl border-2 border-border focus:border-primary focus:outline-none focus:shadow-[0_0_40px_hsl(var(--primary)/0.3)] transition-all duration-500 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-xl"
              />
              
              {/* Multi-Modal Search Mode Selector */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {/* Mode Selector Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowModeSelector(!showModeSelector)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      showModeSelector 
                        ? 'bg-primary/20 text-primary' 
                        : 'glass text-muted-foreground hover:text-foreground hover:bg-primary/10'
                    }`}
                    title="Search Mode"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  <AnimatePresence>
                    {showModeSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-border/50 backdrop-blur-xl z-50"
                      >
                        <div className="p-2 space-y-1">
                          {[
                            { mode: 'text', icon: Type, label: 'Text Search', color: 'text-gray-600' },
                            { mode: 'voice', icon: Mic, label: 'Voice Search', color: 'text-blue-600' },
                            { mode: 'image', icon: Image, label: 'Image Search', color: 'text-green-600' },
                            { mode: 'video', icon: Video, label: 'Video Search', color: 'text-purple-600' },
                            { mode: 'audio', icon: Music, label: 'Audio Search', color: 'text-orange-600' }
                          ].map(({ mode, icon: Icon, label, color }) => (
                            <motion.button
                              key={mode}
                              onClick={() => {
                                setSearchMode(mode as any);
                                setShowModeSelector(false);
                              }}
                              whileHover={{ x: 4 }}
                              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                                searchMode === mode 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${color}`} />
                              <span className="text-sm font-medium">{label}</span>
                              {searchMode === mode && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto w-2 h-2 bg-primary rounded-full"
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* File Upload Button */}
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 glass text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)] transition-all duration-300"
                  title="Upload File for Analysis"
                >
                  <Upload className="w-6 h-6" />
                </motion.button>

                {/* Voice Search Button */}
                <motion.button
                  onClick={handleVoiceSearch}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-destructive/20 text-destructive animate-pulse-glow shadow-[0_0_20px_hsl(var(--destructive)/0.4)]' 
                      : 'glass text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice search"}
                  data-testid="voice-button"
                >
                  <Mic className="w-6 h-6" />
                </motion.button>
                
                {/* Search Button */}
                <motion.button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.1 }}
                  whileTap={{ scale: isLoading ? 1 : 0.9 }}
                  className="p-3 bg-ai-gradient text-white rounded-full hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] disabled:opacity-50 transition-all duration-300"
                  title="Search"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-6 h-6" />
                  )}
                </motion.button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </motion.div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (query.length > 0 || searchHistory.length > 0) && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 z-50"
                >
                  <Card className="border-2 shadow-2xl backdrop-blur-xl bg-background/95">
                    <CardContent className="p-0">
                      {/* Search History */}
                      {searchHistory.length > 0 && query.length === 0 && (
                        <div className="p-4 border-b border-border/50">
                          <div className="flex items-center space-x-2 mb-3">
                            <History className="w-4 h-4 text-muted-foreground" />
                            <h4 className="font-medium text-sm text-muted-foreground">Recent Searches</h4>
                          </div>
                          <div className="space-y-1">
                            {searchHistory.slice(0, 5).map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleHistoryClick(item)}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                              >
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span>{item}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {query.length > 0 && (
                        <div className="p-4">
                          {/* AI Suggestions */}
                          {suggestions.suggestions.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <h4 className="font-medium text-sm">AI Suggestions</h4>
                              </div>
                              <div className="space-y-1">
                                {suggestions.suggestions.slice(0, 4).map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                      selectedSuggestionIndex === index 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'hover:bg-muted/50'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <Lightbulb className="w-3 h-3 text-muted-foreground" />
                                      <span>{suggestion}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Popular Searches */}
                          {suggestions.popular.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <h4 className="font-medium text-sm">Popular</h4>
                              </div>
                              <div className="space-y-1">
                                {suggestions.popular.slice(0, 3).map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                      selectedSuggestionIndex === suggestions.suggestions.length + index 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'hover:bg-muted/50'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <Star className="w-3 h-3 text-yellow-500" />
                                      <span>{suggestion}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Trending Searches */}
                          {suggestions.trending.length > 0 && (
                            <div>
                              <div className="flex items-center space-x-2 mb-3">
                                <Zap className="w-4 h-4 text-orange-600" />
                                <h4 className="font-medium text-sm">Trending</h4>
                              </div>
                              <div className="space-y-1">
                                {suggestions.trending.slice(0, 3).map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                      selectedSuggestionIndex === suggestions.suggestions.length + suggestions.popular.length + index 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'hover:bg-muted/50'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <Target className="w-3 h-3 text-orange-500" />
                                      <span>{suggestion}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced File Analysis Display */}
            <AnimatePresence>
              {(uploadedFile || isAnalyzing) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 p-6 glass rounded-2xl border border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: isAnalyzing ? 360 : 0 }}
                        transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
                        className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      >
                        <Wand2 className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-foreground">AI File Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          {isAnalyzing ? 'Analyzing your file...' : 'Analysis complete'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearUploadedFile}
                      className="text-xs h-8 px-3"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Processing...</span>
                        <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Preview */}
                    {filePreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                      >
                        <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          File Preview
                        </h5>
                        <div className="relative group">
                          {uploadedFile?.type.startsWith('image/') ? (
                            <img
                              src={filePreview}
                              alt="Uploaded file preview"
                              className="w-full h-48 object-cover rounded-xl border border-border/50 group-hover:border-primary/50 transition-colors"
                            />
                          ) : uploadedFile?.type.startsWith('video/') ? (
                            <video
                              src={filePreview}
                              className="w-full h-48 object-cover rounded-xl border border-border/50 group-hover:border-primary/50 transition-colors"
                              controls
                            />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-border/50 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                              <div className="text-center">
                                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">
                              {uploadedFile?.type.split('/')[0]}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Analysis Results */}
                    {fileAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          AI Analysis Results
                        </h5>
                        
                        <div className="space-y-3">
                          <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                              {fileAnalysis.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                                {fileAnalysis.type}
                              </Badge>
                              <span className="text-xs text-green-700 dark:text-green-300">
                                Confidence: {Math.round(fileAnalysis.confidence * 100)}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <h6 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              Detected Tags
                            </h6>
                            <div className="flex flex-wrap gap-1">
                              {fileAnalysis.tags.map((tag, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <Badge variant="secondary" className="text-xs hover:bg-primary/10 transition-colors cursor-pointer">
                                    {tag}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice Search Feedback */}
            <AnimatePresence>
              {(isListening || transcript || voiceError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-border z-50"
                >
                  <div className="p-4">
                    {isListening && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-sm text-primary font-medium">Listening... Speak now</span>
                      </div>
                    )}
                    
                    {transcript && !isListening && (
                      <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Mic className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Voice Input</span>
                        </div>
                        <p className="text-sm text-foreground">{transcript}</p>
                      </div>
                    )}
                    
                    {voiceError && (
                      <div className="mb-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mic className="w-4 h-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">Voice Search Error</span>
                          </div>
                          <button
                            onClick={clearError}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-destructive mt-1">{voiceError}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Enhancement Suggestions */}
            <AnimatePresence>
              {isFocused && query && enhancement && showEnhancement && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-border z-50"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Brain className="w-4 h-4 text-purple-600" />
                        AI Enhanced Search
                      </div>
                      <button
                        onClick={() => setShowEnhancement(false)}
                        className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Enhanced Query */}
                    {enhancement.enhancedQuery !== enhancement.originalQuery && (
                      <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Enhanced Query</span>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">{enhancement.enhancedQuery}</p>
                        <button
                          onClick={() => {
                            setQuery(enhancement.enhancedQuery);
                            handleSearch(enhancement.enhancedQuery);
                          }}
                          className="h-7 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                        >
                          Use Enhanced Query
                        </button>
                      </div>
                    )}

                    {/* Intent Classification */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-foreground">Search Intent</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                        {enhancement.intent}
                      </span>
            </div>

                    {/* Suggestions */}
                    {enhancement.suggestions.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-foreground">Suggestions</span>
                        </div>
                        <div className="space-y-1">
                          {enhancement.suggestions.slice(0, 3).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(suggestion);
                                handleSearch(suggestion);
                              }}
                              className="w-full text-left p-2 text-sm rounded-lg hover:bg-primary/5 transition-colors text-foreground hover:text-primary flex items-center gap-2"
                            >
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Queries */}
                    {enhancement.relatedQueries.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-foreground">Related Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {enhancement.relatedQueries.slice(0, 4).map((relatedQuery, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(relatedQuery);
                                handleSearch(relatedQuery);
                              }}
                              className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                            >
                              {relatedQuery}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Suggestions */}
            <AnimatePresence>
              {isFocused && !query && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-border z-50"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4" />
                      Try these quick searches
                    </div>
                    <div className="space-y-2">
                      {quickQueries.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(suggestion);
                            handleSearch(suggestion);
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-primary/5 transition-colors text-foreground hover:text-primary"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <AIChatInterface />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInterface;