import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Copy, 
  Brain, 
  MessageSquare, 
  Search,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { aiAgentService, type AgentConfiguration, type AgentCapability, type AgentPersonality } from '@/services/aiAgentService';

interface AgentStudioProps {
  className?: string;
}

const AgentStudio: React.FC<AgentStudioProps> = ({ className }) => {
  const [agents, setAgents] = useState<AgentConfiguration[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfiguration | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states for creating/editing agents
  const [agentForm, setAgentForm] = useState({
    name: '',
    description: '',
    tone: 'professional' as const,
    responseStyle: 'detailed' as const,
    confidence: 'balanced' as const,
    maxTokens: 1500,
    temperature: 0.7,
    customPrompt: '',
    capabilities: [] as string[]
  });

  const availableCapabilities: AgentCapability[] = [
    {
      id: 'semantic-search',
      name: 'Semantic Search',
      description: 'Understands context and meaning behind queries',
      type: 'search',
      isEnabled: true,
      configuration: { depth: 'deep', context: true }
    },
    {
      id: 'trend-analysis',
      name: 'Trend Analysis',
      description: 'Identifies trending topics and patterns',
      type: 'analysis',
      isEnabled: true,
      configuration: { timeframe: '30d', sensitivity: 'medium' }
    },
    {
      id: 'content-recommendation',
      name: 'Content Recommendation',
      description: 'Provides personalized content suggestions',
      type: 'recommendation',
      isEnabled: true,
      configuration: { personalization: true, diversity: 0.3 }
    },
    {
      id: 'natural-language-processing',
      name: 'Natural Language Processing',
      description: 'Understands and processes natural language queries',
      type: 'conversation',
      isEnabled: true,
      configuration: { intent: true, entities: true }
    },
    {
      id: 'content-analysis',
      name: 'Content Analysis',
      description: 'Analyzes and synthesizes information from multiple sources',
      type: 'analysis',
      isEnabled: true,
      configuration: { synthesis: true, citation: true }
    },
    {
      id: 'question-answering',
      name: 'Question Answering',
      description: 'Provides accurate answers with source attribution',
      type: 'conversation',
      isEnabled: true,
      configuration: { confidence: true, sources: true }
    },
    {
      id: 'agent-creation',
      name: 'Agent Creation',
      description: 'Creates new AI agents with custom configurations',
      type: 'automation',
      isEnabled: true,
      configuration: { templates: true, validation: true }
    },
    {
      id: 'capability-management',
      name: 'Capability Management',
      description: 'Manages and configures agent capabilities',
      type: 'automation',
      isEnabled: true,
      configuration: { dynamic: true, testing: true }
    },
    {
      id: 'performance-optimization',
      name: 'Performance Optimization',
      description: 'Optimizes agent performance and efficiency',
      type: 'analysis',
      isEnabled: true,
      configuration: { metrics: true, tuning: true }
    }
  ];

  const personalityTones = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'technical', label: 'Technical', description: 'Detailed and precise' },
    { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
    { value: 'expert', label: 'Expert', description: 'Authoritative and knowledgeable' }
  ];

  const responseStyles = [
    { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough' },
    { value: 'conversational', label: 'Conversational', description: 'Natural dialogue style' },
    { value: 'analytical', label: 'Analytical', description: 'Data-driven and structured' }
  ];

  const confidenceLevels = [
    { value: 'conservative', label: 'Conservative', description: 'Cautious and measured' },
    { value: 'balanced', label: 'Balanced', description: 'Moderate confidence' },
    { value: 'assertive', label: 'Assertive', description: 'Confident and direct' }
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const agentList = await aiAgentService.listAgents();
      setAgents(agentList);
      if (agentList.length > 0 && !selectedAgent) {
        setSelectedAgent(agentList[0]);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    try {
      setIsLoading(true);
      
      const personality: AgentPersonality = {
        id: `personality-${Date.now()}`,
        name: agentForm.name,
        description: `Custom personality for ${agentForm.name}`,
        tone: agentForm.tone,
        expertise: ['content-management', 'headless-cms', 'storyblok'],
        responseStyle: agentForm.responseStyle,
        confidence: agentForm.confidence,
        customPrompt: agentForm.customPrompt || undefined
      };

      const selectedCapabilities = availableCapabilities.filter(cap => 
        agentForm.capabilities.includes(cap.id)
      );

      const newAgent = await aiAgentService.createAgent({
        name: agentForm.name,
        description: agentForm.description,
        personality,
        capabilities: selectedCapabilities,
        knowledgeBase: ['content-management', 'headless-cms', 'storyblok'],
        contextWindow: 4000,
        maxTokens: agentForm.maxTokens,
        temperature: agentForm.temperature,
        isActive: true
      });

      setAgents(prev => [...prev, newAgent]);
      setSelectedAgent(newAgent);
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      await aiAgentService.deleteAgent(agentId);
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(agents.length > 1 ? agents[1] : null);
      }
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  const handleToggleAgent = async (agentId: string, isActive: boolean) => {
    try {
      const updatedAgent = await aiAgentService.updateAgent(agentId, { isActive });
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? updatedAgent : agent
      ));
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(updatedAgent);
      }
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  const resetForm = () => {
    setAgentForm({
      name: '',
      description: '',
      tone: 'professional',
      responseStyle: 'detailed',
      confidence: 'balanced',
      maxTokens: 1500,
      temperature: 0.7,
      customPrompt: '',
      capabilities: []
    });
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
          <h1 className="text-3xl font-bold tracking-tight">Agent Studio</h1>
          <p className="text-muted-foreground">
            Create, configure, and manage custom AI agents with specialized capabilities
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">My Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {agents.filter(a => a.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capabilities</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableCapabilities.length}</div>
                <p className="text-xs text-muted-foreground">
                  Available features
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Active conversations
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>
                Get started with creating your first AI agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Choose a Template</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with a pre-configured agent template or create from scratch
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Configure Capabilities</h4>
                    <p className="text-sm text-muted-foreground">
                      Select the AI capabilities your agent needs
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Customize Personality</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the tone, style, and expertise of your agent
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Test & Deploy</h4>
                    <p className="text-sm text-muted-foreground">
                      Test your agent and deploy it for use
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          {isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Agent</CardTitle>
                <CardDescription>
                  Configure your custom AI agent with specific capabilities and personality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Content Discovery Specialist"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Personality Tone</Label>
                    <Select value={agentForm.tone} onValueChange={(value: any) => setAgentForm(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {personalityTones.map(tone => (
                          <SelectItem key={tone.value} value={tone.value}>
                            <div>
                              <div className="font-medium">{tone.label}</div>
                              <div className="text-xs text-muted-foreground">{tone.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={agentForm.description}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this agent does and its purpose..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responseStyle">Response Style</Label>
                    <Select value={agentForm.responseStyle} onValueChange={(value: any) => setAgentForm(prev => ({ ...prev, responseStyle: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {responseStyles.map(style => (
                          <SelectItem key={style.value} value={style.value}>
                            <div>
                              <div className="font-medium">{style.label}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confidence">Confidence Level</Label>
                    <Select value={agentForm.confidence} onValueChange={(value: any) => setAgentForm(prev => ({ ...prev, confidence: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {confidenceLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-muted-foreground">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={agentForm.maxTokens}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      min={100}
                      max={10000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={agentForm.temperature}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      min={0}
                      max={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Capabilities</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableCapabilities.map(capability => (
                      <div key={capability.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={capability.id}
                          checked={agentForm.capabilities.includes(capability.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAgentForm(prev => ({
                                ...prev,
                                capabilities: [...prev.capabilities, capability.id]
                              }));
                            } else {
                              setAgentForm(prev => ({
                                ...prev,
                                capabilities: prev.capabilities.filter(id => id !== capability.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={capability.id} className="flex items-center space-x-2 cursor-pointer">
                          {getCapabilityIcon(capability.type)}
                          <span className="text-sm">{capability.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customPrompt">Custom Prompt (Optional)</Label>
                  <Textarea
                    id="customPrompt"
                    value={agentForm.customPrompt}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, customPrompt: e.target.value }))}
                    placeholder="Add custom instructions for your agent..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAgent} disabled={isLoading || !agentForm.name}>
                    {isLoading ? 'Creating...' : 'Create Agent'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map(agent => (
                <Card key={agent.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAgent(agent.id, !agent.isActive)}
                        >
                          {agent.isActive ? (
                            <Play className="h-4 w-4 text-green-600" />
                          ) : (
                            <Pause className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {agent.capabilities.length} capabilities
                      </span>
                    </div>

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
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Templates</CardTitle>
              <CardDescription>
                Pre-configured agent templates to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      <span>Content Discovery</span>
                    </CardTitle>
                    <CardDescription>
                      Specialized in finding and recommending relevant content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Semantic Search</Badge>
                        <Badge variant="outline" className="text-xs">Trend Analysis</Badge>
                        <Badge variant="outline" className="text-xs">Recommendations</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <span>AskAI Assistant</span>
                    </CardTitle>
                    <CardDescription>
                      Conversational AI for answering questions and providing help
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">NLP</Badge>
                        <Badge variant="outline" className="text-xs">Q&A</Badge>
                        <Badge variant="outline" className="text-xs">Analysis</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <span>Automation Agent</span>
                    </CardTitle>
                    <CardDescription>
                      Handles repetitive tasks and workflow automation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Automation</Badge>
                        <Badge variant="outline" className="text-xs">Management</Badge>
                        <Badge variant="outline" className="text-xs">Optimization</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Analytics</CardTitle>
              <CardDescription>
                Performance metrics and insights for your AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics data will be available once agents are deployed and used.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentStudio;
