import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Search, 
  MessageSquare, 
  Settings, 
  Brain,
  Zap,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Play,
  Pause,
  Activity,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Sparkles
} from 'lucide-react';
import { useAgent } from '@/contexts/AgentContext';
import { aiAgentService, type DiscoveryInsight } from '@/services/aiAgentService';

interface AgentDashboardProps {
  className?: string;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ className }) => {
  const { 
    agents, 
    selectedAgent, 
    setSelectedAgent, 
    refreshAgents, 
    currentSession,
    conversationHistory,
    isLoading,
    error,
    context,
    updateContext
  } = useAgent();

  const [discoveryInsights, setDiscoveryInsights] = useState<DiscoveryInsight[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [quickQuery, setQuickQuery] = useState('');

  useEffect(() => {
    refreshAgents();
  }, [refreshAgents]);

  const handleQuickDiscovery = async () => {
    if (!quickQuery.trim()) return;
    
    try {
      const insights = await aiAgentService.discoverContent(quickQuery, context);
      setDiscoveryInsights(insights);
    } catch (err) {
      console.error('Discovery failed:', err);
    }
  };

  const getAgentStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const getAgentStatusIcon = (isActive: boolean) => {
    return isActive ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />;
  };

  const getCapabilityIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="h-4 w-4" />;
      case 'analysis': return <TrendingUp className="h-4 w-4" />;
      case 'recommendation': return <Brain className="h-4 w-4" />;
      case 'conversation': return <MessageSquare className="h-4 w-4" />;
      case 'automation': return <Zap className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getCapabilityColor = (type: string) => {
    switch (type) {
      case 'search': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-green-100 text-green-800';
      case 'recommendation': return 'bg-purple-100 text-purple-800';
      case 'conversation': return 'bg-orange-100 text-orange-800';
      case 'automation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your AI agents, discovery insights, and conversations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Bot className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agents.filter(a => a.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {agents.length} total agents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discovery Insights</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{discoveryInsights.length}</div>
                <p className="text-xs text-muted-foreground">
                  insights generated
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversationHistory.length}</div>
                <p className="text-xs text-muted-foreground">
                  messages exchanged
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentSession ? 'Active' : 'Inactive'}
                </div>
                <p className="text-xs text-muted-foreground">
                  current session
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Quick Discovery</span>
                </CardTitle>
                <CardDescription>
                  Discover insights about any topic instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="Enter a topic to discover..."
                    className="flex-1 px-3 py-2 border rounded-md"
                    onKeyPress={(e) => e.key === 'Enter' && handleQuickDiscovery()}
                  />
                  <Button onClick={handleQuickDiscovery} disabled={!quickQuery.trim()}>
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
                {discoveryInsights.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recent Insights:</div>
                    {discoveryInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {insight.title}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Quick Chat</span>
                </CardTitle>
                <CardDescription>
                  Start a conversation with your selected agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {selectedAgent?.name || 'No agent selected'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedAgent?.description || 'Select an agent to start chatting'}
                    </div>
                  </div>
                  <Badge className={getAgentStatusColor(selectedAgent?.isActive || false)}>
                    <div className="flex items-center space-x-1">
                      {getAgentStatusIcon(selectedAgent?.isActive || false)}
                      <span>{selectedAgent?.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </Badge>
                </div>
                <Button 
                  className="w-full" 
                  disabled={!selectedAgent?.isActive}
                  onClick={() => setActiveTab('conversations')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Conversation
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
              {conversationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversationHistory.slice(-5).reverse().map((message, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <Users className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Bot className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {message.role === 'user' ? 'You' : selectedAgent?.name || 'AI Agent'}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {message.content}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <Card key={agent.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    <Badge className={getAgentStatusColor(agent.isActive)}>
                      <div className="flex items-center space-x-1">
                        {getAgentStatusIcon(agent.isActive)}
                        <span>{agent.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </Badge>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Capabilities:</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 3).map(capability => (
                        <Badge
                          key={capability.id}
                          variant="outline"
                          className={`text-xs ${getCapabilityColor(capability.type)}`}
                        >
                          {getCapabilityIcon(capability.type)}
                          <span className="ml-1">{capability.name}</span>
                        </Badge>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.capabilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>Tone: {agent.personality.tone}</div>
                    <div>Style: {agent.personality.responseStyle}</div>
                    <div>Created: {new Date(agent.createdAt).toLocaleDateString()}</div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedAgent(agent)}
                    disabled={agent.id === selectedAgent?.id}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {agent.id === selectedAgent?.id ? 'Selected' : 'Select Agent'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-4">
          {discoveryInsights.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Discovery Insights Yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Use the Quick Discovery feature or run a full discovery query to generate insights.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {discoveryInsights.map(insight => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription>{insight.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Evidence:</h4>
                        <ul className="space-y-1">
                          {insight.evidence.map((evidence, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {insight.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>
                Your conversations with AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversationHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <Users className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Performance metrics and insights for your AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics data will be available once agents are deployed and used.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDashboard;
