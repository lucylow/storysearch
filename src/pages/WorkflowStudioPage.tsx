import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  Play, 
  Settings, 
  Plus, 
  BarChart3,
  Brain,
  Zap,
  Target,
  Activity,
  TrendingUp,
  ArrowRight,
  Layers,
  GitBranch,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Star,
  Award,
  Gauge,
  Filter,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Copy,
  Move
} from 'lucide-react';
import WorkflowDesigner from '@/components/WorkflowStudio/WorkflowDesigner';
import WorkflowMonitor from '@/components/WorkflowStudio/WorkflowMonitor';
import WorkflowOptimizer from '@/components/WorkflowStudio/WorkflowOptimizer';

const WorkflowStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const features = [
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Visual Workflow Designer",
      description: "Drag-and-drop interface for creating complex workflows with multiple agents",
      color: "text-blue-600 bg-blue-100",
      category: "Design"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Real-time Monitoring",
      description: "Monitor workflow executions with live updates and detailed analytics",
      color: "text-green-600 bg-green-100",
      category: "Monitoring"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Optimization",
      description: "Intelligent suggestions for improving performance and reducing costs",
      color: "text-purple-600 bg-purple-100",
      category: "Optimization"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automated Triggers",
      description: "Schedule, webhook, and event-based workflow automation",
      color: "text-orange-600 bg-orange-100",
      category: "Automation"
    }
  ];

  const stats = [
    {
      label: "Active Workflows",
      value: "12",
      description: "Currently deployed",
      icon: <Workflow className="h-4 w-4" />,
      trend: "+2 this week"
    },
    {
      label: "Executions Today",
      value: "1,247",
      description: "Completed successfully",
      icon: <Play className="h-4 w-4" />,
      trend: "+15% vs yesterday"
    },
    {
      label: "Success Rate",
      value: "94.2%",
      description: "Average across all workflows",
      icon: <CheckCircle className="h-4 w-4" />,
      trend: "+2.1% improvement"
    },
    {
      label: "Cost Savings",
      value: "23%",
      description: "Through optimization",
      icon: <Target className="h-4 w-4" />,
      trend: "$2,340 saved this month"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'execution',
      title: 'Content Discovery Workflow completed',
      description: 'Generated 15 insights for "headless CMS trends"',
      timestamp: '2 minutes ago',
      status: 'success',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    {
      id: 2,
      type: 'optimization',
      title: 'Performance optimization applied',
      description: 'Workflow "Multi-Agent Analysis" improved by 35%',
      timestamp: '15 minutes ago',
      status: 'info',
      icon: <TrendingUp className="h-4 w-4 text-blue-600" />
    },
    {
      id: 3,
      type: 'creation',
      title: 'New workflow created',
      description: 'AI-Powered Content Creation workflow deployed',
      timestamp: '1 hour ago',
      status: 'info',
      icon: <Plus className="h-4 w-4 text-purple-600" />
    },
    {
      id: 4,
      type: 'error',
      title: 'Workflow execution failed',
      description: 'Content Analysis workflow encountered an error',
      timestamp: '2 hours ago',
      status: 'error',
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  ];

  const quickActions = [
    {
      title: "Create New Workflow",
      description: "Start from scratch or use a template",
      icon: <Plus className="h-8 w-8" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setActiveTab('designer')
    },
    {
      title: "Monitor Executions",
      description: "View real-time workflow performance",
      icon: <Activity className="h-8 w-8" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => setActiveTab('monitor')
    },
    {
      title: "Optimize Performance",
      description: "Get AI-powered optimization suggestions",
      icon: <Brain className="h-8 w-8" />,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => setActiveTab('optimizer')
    },
    {
      title: "Browse Templates",
      description: "Explore pre-built workflow templates",
      icon: <Layers className="h-8 w-8" />,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => setActiveTab('templates')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Workflow Studio</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Design, monitor, and optimize intelligent AI workflows with advanced automation
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" onClick={() => setActiveTab('designer')}>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>

          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="designer">Designer</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
            <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                        <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
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
                <CardTitle>Workflow Studio Capabilities</CardTitle>
                <CardDescription>
                  Comprehensive workflow management with AI-powered intelligence
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
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{feature.title}</h3>
                          <Badge variant="outline">{feature.category}</Badge>
                        </div>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-full ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={action.action}
                          className="w-full"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest workflow executions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 mt-0.5">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>
                    AI-powered recommendations for workflow optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Performance Tip</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Enable parallel execution for your Content Discovery workflow to reduce execution time by 40%.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">Optimization Applied</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Multi-Agent Analysis workflow optimized successfully. 35% performance improvement achieved.
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Attention Needed</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Content Analysis workflow has failed 3 times in the last hour. Review configuration.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="designer" className="space-y-6">
            <div className="h-[800px]">
              <WorkflowDesigner 
                workflowId={selectedWorkflow || undefined}
                onSave={(workflow) => {
                  console.log('Workflow saved:', workflow);
                  setSelectedWorkflow(workflow.id);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-6">
            <WorkflowMonitor workflowId={selectedWorkflow || undefined} />
          </TabsContent>

          <TabsContent value="optimizer" className="space-y-6">
            <WorkflowOptimizer workflowId={selectedWorkflow || undefined} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
                <CardDescription>
                  Pre-built workflow templates to get you started quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <span>Content Discovery</span>
                      </CardTitle>
                      <CardDescription>
                        Intelligent content exploration with pattern recognition
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">AI Agents</Badge>
                          <Badge variant="outline" className="text-xs">Pattern Analysis</Badge>
                          <Badge variant="outline" className="text-xs">Insights</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm text-muted-foreground">4 steps • 5 min</div>
                          <Button size="sm">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-green-600" />
                        <span>Content Creation</span>
                      </CardTitle>
                      <CardDescription>
                        AI-powered content generation and optimization
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">Research</Badge>
                          <Badge variant="outline" className="text-xs">Writing</Badge>
                          <Badge variant="outline" className="text-xs">SEO</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm text-muted-foreground">6 steps • 10 min</div>
                          <Button size="sm">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <span>Multi-Agent Analysis</span>
                      </CardTitle>
                      <CardDescription>
                        Comprehensive analysis using multiple specialized agents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">Parallel</Badge>
                          <Badge variant="outline" className="text-xs">Semantic</Badge>
                          <Badge variant="outline" className="text-xs">Sentiment</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm text-muted-foreground">5 steps • 7 min</div>
                          <Button size="sm">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Analytics</CardTitle>
                <CardDescription>
                  Comprehensive insights into workflow performance and usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Advanced Analytics Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Detailed analytics dashboard with performance metrics, usage patterns, 
                    and optimization recommendations will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkflowStudioPage;
