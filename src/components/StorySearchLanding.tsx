import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  X
} from 'lucide-react';

const StorySearchLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-hero-gradient overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-ai-gradient rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-hero">
              StorySearch AI
            </span>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </button>
            <button className="btn-ai-primary">
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 p-6 glass rounded-2xl"
          >
            <div className="space-y-4">
              <a href="#features" className="block text-foreground hover:text-primary">Features</a>
              <a href="#how-it-works" className="block text-foreground hover:text-primary">How it Works</a>
              <a href="#testimonials" className="block text-foreground hover:text-primary">Testimonials</a>
              <div className="pt-4 border-t border-border space-y-3">
                <button className="w-full px-4 py-2 text-muted-foreground hover:text-foreground">Sign In</button>
                <button className="w-full btn-ai-primary">Get Started Free</button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 glass rounded-full mb-6 hover:scale-105 transition-transform cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm font-medium text-foreground">AI-Powered Content Discovery</span>
              <ArrowRight className="w-4 h-4 ml-2 text-primary" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-gradient-hero">
                Intelligent Content
              </span>
              <br />
              <span className="text-gradient">
                Discovery for Storyblok
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Transform how users discover your Storyblok content with AI-powered search, 
              natural language understanding, and intelligent recommendations powered by Algolia.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button className="group btn-ai-primary flex items-center" onClick={() => window.location.href = '/app'}>
                Start Free Trial
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group btn-ai-ghost flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 glass">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-4">
              AI-Powered Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of content discovery with cutting-edge AI capabilities 
              that understand context, intent, and user behavior.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group p-8 glass rounded-3xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-300"
              >
                <div className="w-14 h-14 bg-ai-gradient rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-glow">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-4">
              How StorySearch AI Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple integration, powerful results. Get started in minutes and transform 
              your content discovery experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-ai-gradient rounded-full opacity-30" />
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative z-10 text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-20 h-20 bg-ai-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-glow"
                >
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-4 shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 glass">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-4">
              Loved by Content Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how StorySearch AI is transforming content discovery for teams worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-8 glass rounded-3xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-ai-gradient rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-6">
              Ready to Transform Your Content Discovery?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of teams using StorySearch AI to make their Storyblok content more discoverable and engaging.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button className="btn-ai-primary" onClick={() => window.location.href = '/app'}>
                Start Your Free Trial
              </button>
              <button className="btn-ai-ghost">
                Schedule a Demo
              </button>
            </div>
            
            <div className="text-sm text-muted-foreground flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
              No credit card required • 14-day free trial • Setup in 5 minutes
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-ai-gradient rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">StorySearch AI</span>
              </div>
              <p className="text-muted-foreground">
                Intelligent content discovery powered by Storyblok and Algolia.
              </p>
            </div>
            
            {footerLinks.map((column, index) => (
              <div key={index}>
                <h4 className="font-semibold text-foreground mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 StorySearch AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Data arrays
const stats = [
  { number: '10x', label: 'Faster Content Discovery' },
  { number: '92%', label: 'Search Accuracy' },
  { number: '85%', label: 'Content Engagement' },
  { number: '24/7', label: 'AI Assistance' }
];

const features = [
  {
    icon: Bot,
    title: "AI-Powered Search",
    description: "Natural language understanding that goes beyond keywords to deliver intelligent, contextual results."
  },
  {
    icon: MessageCircle,
    title: "Conversational AI",
    description: "Chat with your content using our AI assistant that understands complex questions and provides precise answers."
  },
  {
    icon: Zap,
    title: "Real-time Indexing",
    description: "Instant content synchronization with Storyblok webhooks ensuring your search is always up-to-date."
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Gain insights into search behavior, content performance, and user engagement patterns."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with encrypted data, role-based access, and comprehensive audit logs."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share search configurations, analytics insights, and collaborate on content optimization."
  }
];

const steps = [
  {
    icon: Search,
    title: "Connect Storyblok",
    description: "Link your Storyblok space with one-click integration. No coding required."
  },
  {
    icon: Zap,
    title: "AI Learns Your Content",
    description: "Our AI analyzes your content structure and relationships to build intelligent search models."
  },
  {
    icon: Rocket,
    title: "Launch & Optimize",
    description: "Go live in minutes and use our analytics to continuously improve content discovery."
  }
];

const testimonials = [
  {
    quote: "StorySearch AI reduced our content discovery time by 80%. The AI understands what our users are really looking for.",
    author: "Sarah Chen",
    role: "Content Director at TechCorp"
  },
  {
    quote: "The conversational AI feature is a game-changer. Our support team can now instantly find relevant documentation.",
    author: "Mike Rodriguez",
    role: "CTO at StartupXYZ"
  },
  {
    quote: "Implementation took less than an hour, and the results were immediately visible in our user engagement metrics.",
    author: "Emily Watson",
    role: "Product Manager at ScaleUp Inc"
  }
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "API Docs", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" }
    ]
  }
];

export default StorySearchLanding;