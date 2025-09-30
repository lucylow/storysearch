import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BarChart3, Users, Sparkles } from 'lucide-react';
import EnhancedSearch from './EnhancedSearch';
import BrandDashboard from './BrandDashboard';
import CrossContentRecommendations from './CrossContentRecommendations';

const StorySearchEnhanced: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StorySearch AI
              </Link>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Link>
                <Link to="/brands" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Brands</span>
                </Link>
                <Link to="/connections" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Connections</span>
                </Link>
                <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-purple-100">
                  Hackathon 2025
                </Badge>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<EnhancedSearch />} />
            <Route path="/brands" element={
              <div className="max-w-6xl mx-auto px-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">Brand Discovery Dashboard</h1>
                  <p className="text-gray-600">
                    Explore detailed insights and analytics for Nike, iShowSpeed, and BLACKPINK content.
                  </p>
                </div>
                <Tabs defaultValue="nike" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="nike" className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Nike</span>
                    </TabsTrigger>
                    <TabsTrigger value="ishowspeed" className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>iShowSpeed</span>
                    </TabsTrigger>
                    <TabsTrigger value="blackpink" className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>BLACKPINK</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="nike">
                    <BrandDashboard brand="Nike" />
                  </TabsContent>
                  <TabsContent value="ishowspeed">
                    <BrandDashboard brand="iShowSpeed" />
                  </TabsContent>
                  <TabsContent value="blackpink">
                    <BrandDashboard brand="BLACKPINK" />
                  </TabsContent>
                </Tabs>
              </div>
            } />
            <Route path="/connections" element={
              <div className="max-w-6xl mx-auto px-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">AI-Powered Content Connections</h1>
                  <p className="text-gray-600">
                    Discover unexpected relationships between brands, influencers, and music content using advanced AI analysis.
                  </p>
                </div>
                <CrossContentRecommendations />
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">StorySearch AI</h3>
                <p className="text-gray-600 text-sm">
                  Next-generation content discovery platform combining Storyblok CMS with Algolia AI.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• AI-powered search</li>
                  <li>• Cross-content recommendations</li>
                  <li>• Brand analytics</li>
                  <li>• Content insights</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Hackathon</h3>
                <p className="text-sm text-gray-600">
                  Built for the Storyblok x Code & Coffee Hackathon 2025
                </p>
                <div className="mt-2 flex space-x-2">
                  <Badge variant="outline">Storyblok</Badge>
                  <Badge variant="outline">Algolia AI</Badge>
                </div>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
              <p>© 2025 StorySearch AI. Made with ❤️ for the hackathon.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default StorySearchEnhanced;
