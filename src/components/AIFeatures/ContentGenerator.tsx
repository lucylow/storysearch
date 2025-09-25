import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  Lightbulb,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  BookOpen,
  Users,
  Globe,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storyblokService } from '../../services/storyblokService';

interface ContentSuggestion {
  type: 'seo' | 'readability' | 'engagement' | 'structure';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestion?: string;
}

interface GeneratedContent {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  seoScore: number;
  readabilityScore: number;
  wordCount: number;
  estimatedReadTime: number;
  suggestions: ContentSuggestion[];
}

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('article');
  const [tone, setTone] = useState('professional');
  const [targetAudience, setTargetAudience] = useState('developers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<ContentSuggestion[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const contentTypes = [
    { value: 'article', label: 'Article', icon: FileText },
    { value: 'tutorial', label: 'Tutorial', icon: BookOpen },
    { value: 'guide', label: 'Guide', icon: Target },
    { value: 'case-study', label: 'Case Study', icon: BarChart3 },
    { value: 'blog-post', label: 'Blog Post', icon: TrendingUp },
    { value: 'documentation', label: 'Documentation', icon: FileText }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'technical', label: 'Technical' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'authoritative', label: 'Authoritative' }
  ];

  const audiences = [
    { value: 'developers', label: 'Developers' },
    { value: 'designers', label: 'Designers' },
    { value: 'marketers', label: 'Marketers' },
    { value: 'business', label: 'Business Users' },
    { value: 'general', label: 'General Audience' }
  ];

  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Enhanced prompt with context
      const enhancedPrompt = `Create a ${contentType} about "${prompt}" with a ${tone} tone for ${targetAudience}. Include:
      - Engaging title
      - Well-structured content
      - Key takeaways
      - Relevant tags
      - SEO optimization
      - Clear readability`;

      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockGeneratedContent: GeneratedContent = {
        title: `Complete Guide to ${prompt}`,
        content: `# ${prompt}: A Comprehensive ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}

## Introduction
${prompt} is a crucial topic that every ${targetAudience} should understand. In this comprehensive guide, we'll explore the key concepts, best practices, and practical applications.

## Key Concepts

### Understanding the Basics
The foundation of ${prompt} lies in understanding its core principles. This includes:

- **Fundamental Concepts**: The building blocks that make ${prompt} work
- **Best Practices**: Proven strategies that lead to success
- **Common Pitfalls**: Mistakes to avoid and how to prevent them

### Advanced Techniques
Once you've mastered the basics, you can move on to more advanced techniques:

1. **Optimization Strategies**: How to improve performance and efficiency
2. **Integration Methods**: Connecting ${prompt} with other systems
3. **Scaling Solutions**: Growing your implementation as needs evolve

## Practical Implementation

### Step-by-Step Guide
Here's how to implement ${prompt} in your project:

\`\`\`javascript
// Example implementation
const example = {
  name: '${prompt}',
  implementation: 'best-practices',
  audience: '${targetAudience}'
};
\`\`\`

### Real-World Examples
Let's look at some real-world applications:

- **Case Study 1**: How Company X implemented ${prompt}
- **Case Study 2**: The impact of ${prompt} on Project Y
- **Case Study 3**: Lessons learned from ${prompt} deployment

## Best Practices

### Do's and Don'ts
**Do:**
- Follow established patterns
- Test thoroughly
- Document your implementation
- Consider scalability

**Don't:**
- Skip testing
- Ignore performance implications
- Overcomplicate simple solutions
- Forget about maintenance

## Conclusion
${prompt} is an essential skill for ${targetAudience}. By following the guidelines in this ${contentType}, you'll be well-equipped to implement ${prompt} effectively in your projects.

## Key Takeaways
- Understanding the fundamentals is crucial
- Practice with real-world examples
- Always consider scalability and maintenance
- Stay updated with latest best practices`,
        summary: `A comprehensive ${contentType} covering ${prompt} fundamentals, best practices, and practical implementation for ${targetAudience}.`,
        tags: [prompt.toLowerCase(), contentType, targetAudience, 'guide', 'tutorial'],
        seoScore: 85,
        readabilityScore: 78,
        wordCount: 450,
        estimatedReadTime: 3,
        suggestions: []
      };

      setGeneratedContent(mockGeneratedContent);

      // Generate optimization suggestions
      const suggestions = await storyblokService.generateContentSuggestions(
        mockGeneratedContent.content,
        contentType
      );
      setOptimizationSuggestions(suggestions.suggestions);
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizeContent = async () => {
    if (!generatedContent) return;

    setIsOptimizing(true);
    try {
      const suggestions = await storyblokService.generateContentSuggestions(
        generatedContent.content,
        contentType
      );
      setOptimizationSuggestions(suggestions.suggestions);
    } catch (error) {
      console.error('Content optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seo': return <Target className="w-4 h-4" />;
      case 'readability': return <BookOpen className="w-4 h-4" />;
      case 'engagement': return <Users className="w-4 h-4" />;
      case 'structure': return <BarChart3 className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Wand2 className="w-8 h-8 text-purple-600" />
          AI Content Generator
        </h1>
        <p className="text-muted-foreground">
          Generate high-quality content optimized for Storyblok with AI-powered suggestions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Generation Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Generate Content
              </CardTitle>
              <CardDescription>
                Create optimized content for your Storyblok space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Content Topic</Label>
                <Input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="What would you like to write about?"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((toneOption) => (
                        <SelectItem key={toneOption.value} value={toneOption.value}>
                          {toneOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerateContent}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Generated Content
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyContent}
                      className="text-xs"
                    >
                      {copiedContent ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOptimizeContent}
                      disabled={isOptimizing}
                      className="text-xs"
                    >
                      {isOptimizing ? (
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Zap className="w-3 h-3 mr-1" />
                      )}
                      Optimize
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {generatedContent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{generatedContent.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {generatedContent.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{generatedContent.seoScore}</div>
                        <div className="text-xs text-muted-foreground">SEO Score</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{generatedContent.readabilityScore}</div>
                        <div className="text-xs text-muted-foreground">Readability</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{generatedContent.wordCount}</div>
                        <div className="text-xs text-muted-foreground">Words</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{generatedContent.estimatedReadTime}m</div>
                        <div className="text-xs text-muted-foreground">Read Time</div>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      <Textarea
                        value={generatedContent.content}
                        readOnly
                        className="min-h-64 text-sm"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generate content to see it here</p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Optimization Suggestions */}
      {optimizationSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                AI Optimization Suggestions
              </CardTitle>
              <CardDescription>
                AI-powered recommendations to improve your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {optimizationSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 glass rounded-lg border border-border/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getTypeIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{suggestion.title}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {suggestion.description}
                        </p>
                        {suggestion.suggestion && (
                          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              <strong>Suggestion:</strong> {suggestion.suggestion}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ContentGenerator;
