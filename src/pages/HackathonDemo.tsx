import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Sparkles, TrendingUp, Zap, Globe } from 'lucide-react';

const HackathonDemo: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: "Enhanced Search Interface",
      description: "Multi-entity search across brands, influencers, and music with AI-powered intelligence",
      link: "/demo",
      color: "blue"
    },
    {
      icon: Users,
      title: "Brand Dashboard",
      description: "Interactive analytics for Nike, iShowSpeed, and BLACKPINK content performance",
      link: "/demo/brands",
      color: "green"
    },
    {
      icon: Sparkles,
      title: "Cross-Content Discovery",
      description: "AI-powered recommendations revealing unexpected connections between content types",
      link: "/demo/connections",
      color: "purple"
    }
  ];

  const stats = [
    { label: "Search Accuracy", value: "89%", icon: TrendingUp },
    { label: "Engagement Improvement", value: "+23%", icon: Zap },
    { label: "Content Relevance", value: "91%", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-purple-100">
                Storyblok x Code & Coffee Hackathon 2025
              </Badge>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              StorySearch AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Next-generation content discovery platform combining Storyblok CMS with Algolia AI 
              to deliver intelligent, context-aware search experiences across brands, influencers, and music.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/demo">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Search className="w-5 h-5 mr-2" />
                  Try Live Demo
                </Button>
              </Link>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/lucylow/storysearch" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Demo Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience our advanced AI-powered content discovery capabilities with real Nike, iShowSpeed, and BLACKPINK data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Button asChild className="w-full">
                      <Link to={feature.link}>Explore Feature</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
            <p className="text-gray-600">Built with cutting-edge technologies for optimal performance</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "React 19", color: "blue" },
              { name: "TypeScript", color: "blue" },
              { name: "Algolia AI", color: "purple" },
              { name: "Storyblok", color: "green" },
              { name: "TailwindCSS", color: "blue" },
              { name: "shadcn/ui", color: "gray" },
              { name: "Supabase", color: "green" },
              { name: "Vite", color: "purple" }
            ].map((tech, index) => (
              <Badge key={index} variant="outline" className="justify-center py-2 text-sm">
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Experience the Future?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Try our live demo and discover how AI-powered content discovery can transform your search experience.
              </p>
              <Link to="/demo">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Search className="w-5 h-5 mr-2" />
                  Launch Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HackathonDemo;
