import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Search, 
  MessageSquare, 
  Settings, 
  Brain,
  Zap,
  TrendingUp,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import AgentStudio from '@/components/AgentStudio/AgentStudio';
import DiscoveryDashboard from '@/components/AgentStudio/DiscoveryDashboard';
import AskAIInterface from '@/components/AgentStudio/AskAIInterface';
import AgentDashboard from '@/components/AgentStudio/AgentDashboard';

const AgentStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Agent Creation",
      description: "Create custom AI agents with specialized capabilities and personalities",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Content Discovery",
      description: "Intelligent content exploration with pattern recognition and insights",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "AskAI Assistant",
      description: "Conversational AI that understands context and provides accurate answers",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Agent Studio",
      description: "Advanced agent management with configuration and optimization tools",
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const stats = [
    {
      label: "Active Agents",
      value: "3",
      description: "Currently deployed",
      icon: <Bot className="h-4 w-4" />
    },
    {
      label: "Discovery Insights",
      value: "47",
      description: "Generated this week",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      label: "AskAI Sessions",
      value: "1,234",
      description: "Conversations completed",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      label: "Content Analyzed",
      value: "2.5K",
      description: "Articles processed",
      icon: <Brain className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">AI Agent Studio</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Create, configure, and manage intelligent AI agents for content discovery and assistance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Bot className="h-4 w-4 mr-2" />
                New Agent
              </Button>
            </div>
          </div>

          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
            <TabsTrigger value="askai">AskAI</TabsTrigger>
            <TabsTrigger value="studio">Studio</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Capabilities</CardTitle>
                <CardDescription>
                  Comprehensive AI agent system with advanced discovery and assistance features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Start Discovery</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore content insights and patterns
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('discovery')}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Launch Discovery
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Ask AI</h3>
                      <p className="text-sm text-muted-foreground">
                        Get intelligent answers to your questions
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('askai')}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Bot className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create Agent</h3>
                      <p className="text-sm text-muted-foreground">
                        Build custom AI agents with specific capabilities
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('studio')}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Open Studio
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions and insights from your AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Content Discovery completed</p>
                      <p className="text-sm text-muted-foreground">
                        Found 12 insights for "headless CMS optimization"
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2 minutes ago
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">AskAI session completed</p>
                      <p className="text-sm text-muted-foreground">
                        Answered question about Storyblok API integration
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      5 minutes ago
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">New agent created</p>
                      <p className="text-sm text-muted-foreground">
                        "Content Strategy Specialist" with 5 capabilities
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      1 hour ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <AgentDashboard />
          </TabsContent>

          <TabsContent value="discovery" className="space-y-6">
            <DiscoveryDashboard />
          </TabsContent>

          <TabsContent value="askai" className="space-y-6">
            <div className="h-[800px]">
              <AskAIInterface />
            </div>
          </TabsContent>

          <TabsContent value="studio" className="space-y-6">
            <AgentStudio />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentStudioPage;
