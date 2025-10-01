import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Bot, 
  Zap, 
  Shield, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
  MessageCircle,
  Users,
  Rocket,
  Menu,
  X,
  Mic,
  Brain,
  TrendingUp,
  Lightbulb,
  Target,
  Globe,
  Clock,
  Percent,
  ChevronRight
} from 'lucide-react';
import AuthModal from './auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

const StorySearchLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      {/* Enhanced Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/15 to-blue-500/15 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <motion.div 
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              StorySearch AI
            </span>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#problem" 
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group"
              whileHover={{ y: -2 }}
            >
              The Problem
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
            </motion.a>
            <motion.a 
              href="#solution" 
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group"
              whileHover={{ y: -2 }}
            >
              Our Solution
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
            </motion.a>
            <motion.a 
              href="#capabilities" 
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group"
              whileHover={{ y: -2 }}
            >
              Capabilities
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
            </motion.a>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/app" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.button 
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors font-medium rounded-lg hover:bg-blue-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button 
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden mt-4 p-6 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl"
          >
            <div className="space-y-4">
              <motion.a 
                href="#problem" 
                className="block text-slate-700 hover:text-blue-600 font-medium transition-colors"
                whileHover={{ x: 5 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                The Problem
              </motion.a>
              <motion.a 
                href="#solution" 
                className="block text-slate-700 hover:text-blue-600 font-medium transition-colors"
                whileHover={{ x: 5 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Solution
              </motion.a>
              <motion.a 
                href="#capabilities" 
                className="block text-slate-700 hover:text-blue-600 font-medium transition-colors"
                whileHover={{ x: 5 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Capabilities
              </motion.a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section - The Problem */}
      <section id="problem" className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Problem Statement */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-red-50 border border-red-200 rounded-full mb-8"
            >
              <span className="text-sm font-semibold text-red-700">42% of searches end in frustration</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="block text-slate-900 mb-4">
                Finding the right information
              </span>
              <span className="block bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                feels impossible
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              You want to learn about Nike's latest innovations. Research Tesla's new models. Compare tech companies. But traditional search? It buries you in thousands of generic links.
            </motion.p>

            {/* Problem Visualization */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
            >
              {problemSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="p-6 bg-white/60 backdrop-blur-sm border border-red-200 rounded-2xl"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-red-600">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-2xl md:text-3xl text-slate-800 font-semibold mb-12"
            >
              <span className="text-red-600">What if there was a better way?</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="px-6 py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-8"
            >
              <span className="block text-slate-900 mb-4">Meet</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                StorySearch AI
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              We built something revolutionary: an AI that doesn't just search, it understands. It answers questions. It guides discovery. It thinks like you do.
            </motion.p>

            {/* Tech Stack */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-8 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <tech.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tech.name}</h3>
                  <p className="text-slate-600">{tech.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Powered by <span className="font-semibold text-blue-600">GPT-4</span>, <span className="font-semibold text-purple-600">Algolia's AskAI</span>, and <span className="font-semibold text-indigo-600">autonomous agent technology</span>, we've created an intelligent discovery platform that works with any online content.
            </motion.p>

            {/* Demo Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Mic className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold text-slate-900">Voice Search Demo</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-700 italic">"Tell me about Nike's sustainability initiatives"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">Nike's Move to Zero</h4>
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">92%</span>
                    </div>
                    <p className="text-green-700 text-sm">Carbon neutral by 2025, 75% renewable energy in manufacturing</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">Circular Design</h4>
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">88%</span>
                    </div>
                    <p className="text-green-700 text-sm">Recycled materials in Air Max and Space Hippie collections</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Three Breakthrough Capabilities */}
      <section id="capabilities" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="block text-slate-900 mb-4">StorySearch AI has three</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                breakthrough capabilities
              </span>
            </h2>
          </motion.div>

          <div className="space-y-20">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}
              >
                <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <capability.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">{capability.title}</h3>
                      <p className="text-blue-600 font-semibold">{capability.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 mb-6 leading-relaxed">{capability.description}</p>
                  
                  {capability.example && (
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-3">{capability.example.title}</h4>
                      <p className="text-slate-700 italic mb-3">"{capability.example.query}"</p>
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <p className="text-slate-700">{capability.example.response}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={index % 2 === 1 ? 'md:col-start-1' : ''}>
                  <div className="relative">
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-2xl">
                      <capability.demoComponent />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              This isn't search.
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-8">
              This is intelligent discovery.
            </h3>
            
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              StorySearch AI represents the future of how we find information online. Voice-powered. Conversational. Predictive. Intelligent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/app'}
              >
                <Rocket className="w-6 h-6" />
                <span>Start Discovering Now</span>
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </motion.button>
            </div>
            
            <p className="text-blue-200 text-lg font-semibold">
              Ask anything. Discover everything.
            </p>
            <p className="text-blue-300 text-sm mt-2">
              This is the future of discovery, and it's available now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">StorySearch AI</span>
            </div>
            <p className="text-slate-400">&copy; 2024 StorySearch AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authMode}
      />
    </div>
  );
};

// Data arrays
const problemSteps = [
  {
    title: "You Click",
    description: "Open twenty tabs searching for information"
  },
  {
    title: "You Scroll", 
    description: "Endless scrolling through generic results"
  },
  {
    title: "You're Lost",
    description: "Still not sure you found what you needed"
  }
];

const techStack = [
  {
    icon: Brain,
    name: "GPT-4",
    description: "Advanced language understanding and generation"
  },
  {
    icon: Search,
    name: "Algolia AskAI",
    description: "Intelligent search and question answering"
  },
  {
    icon: Bot,
    name: "Autonomous Agents",
    description: "AI that guides your discovery journey"
  }
];

const AskAIDemo = () => (
  <div>
    <div className="flex items-center space-x-2 mb-4">
      <Search className="w-5 h-5 text-blue-600" />
      <span className="font-semibold text-slate-900">AskAI</span>
    </div>
    <div className="bg-slate-50 rounded-lg p-4 mb-4">
      <p className="text-slate-700 text-sm">"What are Tesla's latest models?"</p>
    </div>
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-semibold text-blue-800 text-sm">Model 3</h4>
        <p className="text-blue-700 text-xs">Starting at $38,990</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-semibold text-blue-800 text-sm">Model Y</h4>
        <p className="text-blue-700 text-xs">Starting at $47,740</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-semibold text-blue-800 text-sm">Cybertruck</h4>
        <p className="text-blue-700 text-xs">Starting at $60,990</p>
      </div>
    </div>
  </div>
);

const AgenticDemo = () => (
  <div>
    <div className="flex items-center space-x-2 mb-4">
      <Bot className="w-5 h-5 text-purple-600" />
      <span className="font-semibold text-slate-900">Agentic Discovery</span>
    </div>
    <div className="space-y-3">
      <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
        <span className="text-sm text-purple-800">Understanding fundamentals</span>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
        <span className="text-sm text-purple-800">Comparing options</span>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
        <span className="text-sm text-purple-800">Analyzing features</span>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
        <span className="text-sm text-purple-800">Making decisions</span>
      </div>
    </div>
  </div>
);

const PredictiveDemo = () => (
  <div>
    <div className="flex items-center space-x-2 mb-4">
      <TrendingUp className="w-5 h-5 text-indigo-600" />
      <span className="font-semibold text-slate-900">Predictive Surfacing</span>
    </div>
    <div className="bg-slate-50 rounded-lg p-4 mb-4">
      <p className="text-slate-700 text-sm">Searched for: Nike</p>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
        <span className="text-sm text-indigo-800">Adidas innovations</span>
        <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">85%</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
        <span className="text-sm text-indigo-800">Under Armour technology</span>
        <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">78%</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
        <span className="text-sm text-indigo-800">Puma sustainability</span>
        <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">82%</span>
      </div>
    </div>
  </div>
);

const capabilities = [
  {
    icon: Search,
    title: "AskAI",
    subtitle: "Get exact answers, not search results",
    description: "Ask 'What are Tesla's latest models?' and get a precise answer with sources. No more scrolling through pages of links.",
    example: {
      title: "Example:",
      query: "What are Tesla's latest models?",
      response: "Model 3, Model Y, Cybertruck, with full specifications and pricing."
    },
    demoComponent: AskAIDemo
  },
  {
    icon: Bot,
    title: "Agentic Discovery",
    subtitle: "Our AI creates multi-step journeys",
    description: "Learning about electric vehicles? The agent guides you through fundamentals, then comparisons, then implementation, automatically understanding your learning path.",
    example: {
      title: "Learning Journey:",
      query: "Tell me about electric vehicles",
      response: "Step 1: Understanding. Step 2: Comparing. Step 3: Analyzing. Step 4: Deciding."
    },
    demoComponent: AgenticDemo
  },
  {
    icon: TrendingUp,
    title: "Predictive Surfacing",
    subtitle: "The more you search, the smarter it gets",
    description: "It anticipates what you need next and proactively recommends content. Search for Nike once, and it understands you're interested in athletic brands.",
    example: {
      title: "Smart Recommendations:",
      query: "Nike sustainability",
      response: "Suggests Adidas innovations, Under Armour technology, Puma sustainability with confidence scores."
    },
    demoComponent: PredictiveDemo
  }
];

export default StorySearchLanding;