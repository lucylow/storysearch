import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Link, ShoppingBag, Play, Music, Star, Megaphone, ListMusic } from 'lucide-react';
import { crossContentConnections } from '@/data/mockData';

const CrossContentRecommendations: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const getContentTypeIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      product: ShoppingBag,
      video: Play,
      music_release: Music,
      campaign: Megaphone,
      brand_endorsement: Star,
      music_playlist: ListMusic
    };
    const Icon = iconMap[type] || ShoppingBag;
    return <Icon className="w-4 h-4" />;
  };

  const getContentTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      product: 'bg-blue-100 text-blue-800',
      video: 'bg-red-100 text-red-800',
      music_release: 'bg-purple-100 text-purple-800',
      campaign: 'bg-green-100 text-green-800',
      brand_endorsement: 'bg-yellow-100 text-yellow-800',
      music_playlist: 'bg-pink-100 text-pink-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  const handleContentSelect = (contentId: string) => {
    const content = crossContentConnections[contentId as keyof typeof crossContentConnections];
    setSelectedContent(content);
  };

  const demoContentItems = [
    {
      id: "nike-air-zoom-pegasus",
      title: "Nike Air Zoom Pegasus 40",
      type: "product",
      description: "Running shoe product",
      brand: "Nike",
      engagement: 95
    },
    {
      id: "ishowspeed-fifa-gameplay", 
      title: "iShowSpeed FIFA 25 Gameplay",
      type: "video",
      description: "Gaming video content",
      brand: "iShowSpeed",
      engagement: 89
    },
    {
      id: "blackpink-born-pink",
      title: "BLACKPINK BORN PINK Album",
      type: "music_release",
      description: "K-pop music release",
      brand: "BLACKPINK",
      engagement: 96
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI-Powered Cross-Content Discovery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Discover unexpected connections between brands, influencers, and music content using advanced AI analysis. 
            Our system identifies semantic relationships, shared concepts, and cross-entity patterns to surface relevant recommendations.
          </p>
          
          {/* Content Selection */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium">Select Content to Explore Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoContentItems.map((item) => (
                <Button 
                  key={item.id}
                  variant="outline" 
                  onClick={() => handleContentSelect(item.id)}
                  className="h-auto p-4 text-left justify-start"
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${getContentTypeColor(item.type)}`}>
                      {getContentTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{item.brand}</Badge>
                        <span className="text-xs text-green-600 font-medium">{item.engagement}% engagement</span>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Content & Recommendations */}
          {selectedContent && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getContentTypeColor(selectedContent.type)}`}>
                    {getContentTypeIcon(selectedContent.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">Selected: {selectedContent.title}</h3>
                    <Badge variant="outline" className="mt-1">{selectedContent.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Link className="w-4 h-4" />
                  <span>AI-Discovered Cross-Content Connections</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  {selectedContent.recommendations.map((rec: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`p-2 rounded-lg ${getContentTypeColor(rec.type)}`}>
                              {getContentTypeIcon(rec.type)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{rec.title}</div>
                              <Badge variant="outline" className="mt-1 capitalize">
                                {rec.type.replace('_', ' ')}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-2">{rec.connection}</p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-green-600">{rec.relevanceScore}%</div>
                            <div className="text-xs text-gray-500">Relevance</div>
                          </div>
                        </div>
                        <Button size="sm" className="mt-3">
                          Explore Connection <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* AI Analysis Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Analysis Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedContent.recommendations.length}
                      </div>
                      <div className="text-sm text-gray-600">Connections Found</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(selectedContent.recommendations.reduce((acc: number, rec: any) => acc + rec.relevanceScore, 0) / selectedContent.recommendations.length)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Relevance</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">4</div>
                      <div className="text-sm text-gray-600">Entity Types</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* How It Works */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">How Cross-Content Discovery Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Semantic Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Our AI analyzes content meaning, themes, and context to identify conceptual relationships 
                    beyond simple keyword matching.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Entity Recognition</h4>
                  <p className="text-sm text-gray-600">
                    Advanced NLP extracts brands, people, products, and concepts to understand 
                    cross-entity connections and influences.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Behavioral Patterns</h4>
                  <p className="text-sm text-gray-600">
                    User interaction data reveals which content types and topics are frequently 
                    explored together, informing recommendations.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cultural Context</h4>
                  <p className="text-sm text-gray-600">
                    Understanding cultural trends and zeitgeist helps surface connections 
                    that reflect current interests and emerging patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossContentRecommendations;
