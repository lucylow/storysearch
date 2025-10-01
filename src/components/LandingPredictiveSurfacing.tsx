import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Star, ArrowRight, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  category: string;
  reason: string;
  imageUrl?: string;
}

interface SearchHistory {
  query: string;
  timestamp: Date;
  category: string;
}

const LandingPredictiveSurfacing = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([
    { query: 'Nike sustainability', timestamp: new Date(Date.now() - 300000), category: 'sustainability' },
    { query: 'Athletic wear trends', timestamp: new Date(Date.now() - 600000), category: 'fashion' },
  ]);
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Adidas innovations',
      description: 'Latest sustainable technology and eco-friendly product lines',
      confidence: 85,
      category: 'Sustainability',
      reason: 'Based on your interest in Nike sustainability',
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Under Armour technology',
      description: 'Performance fabrics and smart athletic wear developments',
      confidence: 78,
      category: 'Innovation',
      reason: 'Related to athletic wear trends search',
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Puma sustainability',
      description: 'Environmental initiatives and circular economy practices',
      confidence: 82,
      category: 'Sustainability',
      reason: 'Similar sustainability focus as previous searches',
      imageUrl: '/api/placeholder/300/200'
    }
  ];

  const simulateNewSearch = (query: string) => {
    const newSearch: SearchHistory = {
      query,
      timestamp: new Date(),
      category: query.toLowerCase().includes('sustainability') ? 'sustainability' : 'general'
    };
    
    setSearchHistory(prev => [newSearch, ...prev.slice(0, 4)]);
    generateRecommendations();
  };

  const generateRecommendations = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    // Generate initial recommendations
    generateRecommendations();
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl">Predictive Surfacing</h2>
              <p className="text-sm text-muted-foreground font-normal">
                The more you search, the smarter it gets
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our AI analyzes your search patterns to proactively recommend relevant content 
            before you even know you need it.
          </p>
          
          {/* Demo Search Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateNewSearch('Nike sustainability')}
            >
              Search: "Nike sustainability"
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateNewSearch('Tesla Model Y review')}
            >
              Search: "Tesla Model Y review"
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateNewSearch('BLACKPINK fashion collaborations')}
            >
              Search: "BLACKPINK fashion"
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Search History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {searchHistory.map((search, index) => (
                <motion.div
                  key={`${search.query}-${search.timestamp.getTime()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{search.query}</p>
                    <Badge variant="secondary" className="text-xs">
                      {search.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {search.timestamp.toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>AI Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="text-sm text-muted-foreground ml-2">Analyzing patterns...</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Interest Profile</h4>
                  <p className="text-xs text-blue-700">Sustainability-focused, athletic brands</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-900 mb-1">Confidence Level</h4>
                  <p className="text-xs text-green-700">High accuracy predictions (85%+)</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-medium text-purple-900 mb-1">Next Likely Search</h4>
                  <p className="text-xs text-purple-700">"Sustainable fashion trends"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Smart Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4 last:mb-0"
                >
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getConfidenceColor(rec.confidence)}`}
                      >
                        {rec.confidence}%
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {rec.category}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {rec.reason}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingPredictiveSurfacing;
