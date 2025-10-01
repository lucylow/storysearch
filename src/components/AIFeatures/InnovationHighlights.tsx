import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search,
  Filter,
  Brain,
  Zap,
  Bot,
  Cpu,
  Network,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
  Target,
  Layers,
  GitBranch,
  Code,
  Image as ImageIcon,
  MessageCircle,
  Lightbulb,
  Settings,
  Database,
  FileText
} from 'lucide-react';

interface TimelineNode {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<Record<string, unknown>>;
  color: string;
  isActive?: boolean;
}

interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  content: {
    headline: string;
    details: string[];
    visuals: React.ReactNode;
    tagline: string;
  };
  theme: string;
}

const InnovationHighlights: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const timelineNodes: TimelineNode[] = [
    {
      year: '2015',
      title: 'Keyword Search',
      description: 'Basic text matching',
      icon: Search,
      color: 'from-gray-400 to-gray-600',
      isActive: currentSlide === 0
    },
    {
      year: '2018',
      title: 'Faceted Search',
      description: 'Filter-based discovery',
      icon: Filter,
      color: 'from-blue-400 to-blue-600',
      isActive: currentSlide === 1
    },
    {
      year: '2023',
      title: 'Semantic AI',
      description: 'Context-aware search',
      icon: Brain,
      color: 'from-purple-400 to-purple-600',
      isActive: currentSlide === 2
    },
    {
      year: '2025',
      title: 'Agentic AI for Storyblok',
      description: 'Intelligent content discovery',
      icon: Bot,
      color: 'from-primary to-secondary',
      isActive: currentSlide >= 3
    }
  ];

  const slides: SlideContent[] = [
    {
      id: 1,
      title: 'Where Storyblok Meets AI Intelligence',
      subtitle: 'Reimagining content discovery at the intersection of structured content and AI agents',
      content: {
        headline: 'The Evolution of Content Discovery',
        details: [
          'From simple keyword matching to intelligent understanding',
          'StorySearch AI represents the next generation of content discovery',
          'Built specifically for Storyblok\'s unique architecture',
          'Powered by cutting-edge AI agents and semantic understanding'
        ],
        visuals: (
          <div className="relative w-full h-64 overflow-hidden rounded-2xl glass border border-border/50">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-8">
                {timelineNodes.map((node, index) => (
                  <motion.div
                    key={node.year}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isInView ? 1 : 0, 
                      scale: isInView ? 1 : 0.8,
                      y: node.isActive ? -10 : 0
                    }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                      node.isActive ? 'bg-primary/20 scale-110' : 'bg-background/50'
                    }`}
                    onMouseEnter={() => setHoveredNode(index)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${node.color} flex items-center justify-center mb-2 animate-glow`}>
                      <node.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-bold text-foreground">{node.year}</div>
                    <div className="text-xs text-center text-muted-foreground mt-1">{node.title}</div>
                    {hoveredNode === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 p-2 bg-background rounded-lg shadow-lg text-xs text-center border border-border z-10"
                      >
                        {node.description}
                      </motion.div>
                    )}
                    {index < timelineNodes.length - 1 && (
                      <div className="absolute top-6 left-full w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ),
        tagline: 'StorySearch AI is not incremental — it\'s the culmination of a decade of evolution in content discovery.'
      },
      theme: 'gradient-primary'
    },
    {
      id: 2,
      title: 'First AI-Native Search for Storyblok',
      subtitle: 'The first search solution engineered specifically for Storyblok',
      content: {
        headline: 'Built for Storyblok, Not Bolt-On',
        details: [
          'Native ingestion of components, stories, and relationships',
          'Semantic clustering at both content and schema levels',
          'AI integrated across the entire pipeline',
          'Deep understanding of Storyblok\'s unique architecture'
        ],
        visuals: (
          <div className="relative w-full h-64">
            <div className="grid grid-cols-3 gap-4 h-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-4 border border-primary/30"
              >
                <div className="w-8 h-8 bg-[#00B3B3] rounded-lg flex items-center justify-center mb-3">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Storyblok</h4>
                <p className="text-xs text-muted-foreground">Structured content with components & stories</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-4 border border-secondary/30 flex flex-col justify-center"
              >
                <div className="w-8 h-8 bg-ai-gradient rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-center text-foreground mb-2">AI Engine</h4>
                <p className="text-xs text-center text-muted-foreground">Native processing & understanding</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-xl p-4 border border-accent/30"
              >
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Discovery</h4>
                <p className="text-xs text-muted-foreground">Intelligent search results & recommendations</p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
              transition={{ delay: 0.8 }}
              className="absolute top-4 right-4 bg-primary/10 border border-primary/30 rounded-lg px-3 py-1"
            >
              <span className="text-xs font-semibold text-primary">Built natively for Storyblok</span>
            </motion.div>
          </div>
        ),
        tagline: 'More than a plugin — an AI-native engine born inside Storyblok\'s ecosystem.'
      },
      theme: 'gradient-secondary'
    },
    {
      id: 3,
      title: 'Agentic Content Discovery',
      subtitle: 'Beyond search — toward agentic discovery',
      content: {
        headline: 'Autonomous AI Agents Interpret Queries as Tasks',
        details: [
          'Conversational discovery with follow-up questions',
          'Proactive recommendations based on browsing context',
          'Journey orchestration across multiple related stories',
          'Task-oriented understanding, not just string matching'
        ],
        visuals: (
          <div className="relative w-full h-64">
            <div className="flex flex-col space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                transition={{ delay: 0.2 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground">U</span>
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-bl-none p-3 max-w-xs">
                  <p className="text-sm">"I'm exploring headless CMS for ecommerce"</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
                transition={{ delay: 0.4 }}
                className="flex items-start space-x-3 justify-end"
              >
                <div className="bg-glass border border-border rounded-2xl rounded-br-none p-3 max-w-xs">
                  <p className="text-sm text-foreground">"Here are 3 migration stories + a pricing comparison. Do you want integration guides too?"</p>
                </div>
                <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center"
              >
                <div className="flex items-center space-x-2 glass rounded-full px-4 py-2 border border-primary/30">
                  <div className="w-6 h-6 bg-ai-gradient rounded-full flex items-center justify-center animate-glow">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                  <span className="text-xs text-foreground font-medium">Multi-step journey</span>
                </div>
              </motion.div>
            </div>
          </div>
        ),
        tagline: 'Not just search results — guided discovery journeys.'
      },
      theme: 'gradient-accent'
    },
    {
      id: 4,
      title: 'Cutting-Edge Algolia AI Features',
      subtitle: 'Powered by AskAI & Agent Studio',
      content: {
        headline: 'Harnessing Algolia\'s Newest AI Modules',
        details: [
          'AskAI: Natural language Q&A with exact answers',
          'Agent Studio: Autonomous conversational flows',
          'Looking Similar: Image-based recommendations',
          'Dynamic re-ranking & personalization'
        ],
        visuals: (
          <div className="relative w-full h-64">
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-4 border border-blue-500/30"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-[#0468FF] rounded flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">AskAI</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground mb-1">Q: "What are CMS benefits?"</div>
                  <div className="text-xs text-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    A: "Here's a comparison of ROI + 40% cost reduction case study"
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-4 border border-purple-500/30"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-[#0468FF] rounded flex items-center justify-center">
                    <Settings className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">Agent Studio</h4>
                </div>
                <div className="flex items-center space-x-2">
                  {['Query', 'Process', 'Respond'].map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex-1 text-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1" />
                        <div className="text-xs text-muted-foreground">{step}</div>
                      </div>
                      {index < 2 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center space-x-2"
            >
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="w-2 h-2 bg-[#0468FF] rounded-full"
                />
              ))}
            </motion.div>
          </div>
        ),
        tagline: 'Harnessing Algolia\'s newest AI modules inside Storyblok\'s ecosystem.'
      },
      theme: 'gradient-algolia'
    },
    {
      id: 5,
      title: 'Component-Aware Intelligence',
      subtitle: 'Deep understanding of Storyblok\'s architecture',
      content: {
        headline: 'Content Intelligence Tuned to Storyblok\'s DNA',
        details: [
          'AI parses content components and multi-reference fields',
          'Precision discovery at micro and macro levels',
          'Relationship mapping across connected components',
          'Optimizes both editor and user experience'
        ],
        visuals: (
          <div className="relative w-full h-64">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
              transition={{ delay: 0.2 }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl" />
              
              {/* Component Network */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { name: 'Article', icon: FileText, color: 'bg-blue-500' },
                    { name: 'Hero', icon: ImageIcon, color: 'bg-purple-500' },
                    { name: 'CTA', icon: Target, color: 'bg-green-500' }
                  ].map((component, index) => (
                    <motion.div
                      key={component.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="relative"
                    >
                      <div className={`w-16 h-16 ${component.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <component.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-xs text-center mt-2 text-foreground font-medium">
                        {component.name}
                      </div>
                      
                      {/* Connection lines */}
                      {index < 2 && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isInView ? 1 : 0 }}
                          transition={{ delay: 0.8 + index * 0.2 }}
                          className="absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-primary to-secondary origin-left"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* Neural Network Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isInView ? 0.3 : 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHN2Zz4K')] opacity-30"
                />
              </div>
              
              {/* AI Analysis Zoom */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
                transition={{ delay: 1.0 }}
                className="absolute bottom-4 right-4 glass rounded-lg p-2 border border-primary/30"
              >
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs text-foreground font-medium">AI Parsing Components</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ),
        tagline: 'Content intelligence tuned to Storyblok\'s unique DNA.'
      },
      theme: 'gradient-component'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section ref={containerRef} className="py-20 px-6 bg-hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gradient-hero mb-4">
            Innovation Highlights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the cutting-edge features that make StorySearch AI the future of content discovery
          </p>
        </motion.div>

        {/* Main Slide Container */}
        <div className="relative">
          {/* Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl border border-border/50 overflow-hidden shadow-2xl backdrop-blur-xl"
            >
              {/* Slide Header */}
              <div className={`p-8 bg-gradient-to-r ${currentSlideData.theme} text-white relative`}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">
                    {currentSlideData.title}
                  </h3>
                  <p className="text-white/90 text-lg italic">
                    {currentSlideData.subtitle}
                  </p>
                </div>
              </div>

              {/* Slide Body */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Content */}
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-6">
                      {currentSlideData.content.headline}
                    </h4>
                    <ul className="space-y-4 mb-8">
                      {currentSlideData.content.details.map((detail, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <p className="text-sm text-primary font-medium italic">
                        "{currentSlideData.content.tagline}"
                      </p>
                    </div>
                  </div>

                  {/* Visuals */}
                  <div className="flex items-center justify-center">
                    {currentSlideData.content.visuals}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Previous/Next Buttons */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 glass rounded-full border border-border hover:border-primary/30 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </motion.button>
              
              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 glass rounded-full border border-border hover:border-primary/30 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </motion.button>

              <motion.button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isAutoPlaying 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'glass text-muted-foreground border border-border hover:border-primary/30'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </motion.button>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center space-x-2">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]' 
                      : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="text-sm text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Voiceover Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-2xl p-8 border border-border/50 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Innovation Story</h4>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              "We're not just improving search — we're reimagining discovery. StorySearch AI is the first 
              AI-native solution built for Storyblok. It understands components, workflows, and relationships 
              natively. It goes beyond keyword matching to agentic discovery powered by Algolia's AskAI and 
              Agent Studio. And it delivers intelligence at both micro and macro levels, guiding users 
              conversationally and proactively. This is the future of content discovery — built directly 
              inside Storyblok."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InnovationHighlights;
