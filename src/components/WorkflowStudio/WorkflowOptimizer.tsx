import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Brain, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Activity,
  Clock,
  ArrowRight,
  Lightbulb,
  Star,
  Award,
  Gauge,
  Layers,
  GitBranch,
  Filter,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { aiWorkflowService, type WorkflowConfiguration, type WorkflowExecution, type WorkflowAnalytics } from '@/services/aiWorkflowService';

interface WorkflowOptimizerProps {
  workflowId?: string;
  className?: string;
}

interface OptimizationSuggestion {
  id: string;
  type: 'performance' | 'cost' | 'reliability' | 'scalability' | 'maintainability';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  estimatedImprovement: string;
  category: string;
  tags: string[];
  isApplied: boolean;
  details: {
    before: any;
    after: any;
    reasoning: string;
    implementation: string;
  };
}

interface PerformanceMetrics {
  executionTime: {
    current: number;
    optimized: number;
    improvement: number;
  };
  resourceUsage: {
    memory: number;
    cpu: number;
    network: number;
  };
  successRate: {
    current: number;
    optimized: number;
    improvement: number;
  };
  cost: {
    current: number;
    optimized: number;
    savings: number;
  };
}

const WorkflowOptimizer: React.FC<WorkflowOptimizerProps> = ({ workflowId, className }) => {
  const [workflow, setWorkflow] = useState<WorkflowConfiguration | null>(null);
  const [analytics, setAnalytics] = useState<WorkflowAnalytics | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (workflowId) {
      loadWorkflowData();
    }
  }, [workflowId]);

  const loadWorkflowData = async () => {
    if (!workflowId) return;

    try {
      setIsAnalyzing(true);
      
      // Load workflow
      const workflowData = await aiWorkflowService.getWorkflow(workflowId);
      setWorkflow(workflowData);

      // Load analytics
      const analyticsData = await aiWorkflowService.getWorkflowAnalytics(workflowId);
      setAnalytics(analyticsData);

      // Load execution history
      const executionHistory = await aiWorkflowService.getExecutionHistory(workflowId, 100);
      setExecutions(executionHistory);

      // Generate optimization suggestions
      await generateOptimizationSuggestions(workflowData, analyticsData, executionHistory);

      // Calculate performance metrics
      calculatePerformanceMetrics(workflowData, analyticsData, executionHistory);
    } catch (error) {
      console.error('Failed to load workflow data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateOptimizationSuggestions = async (
    workflow: WorkflowConfiguration,
    analytics: WorkflowAnalytics | null,
    executions: WorkflowExecution[]
  ) => {
    const newSuggestions: OptimizationSuggestion[] = [];

    // Analyze workflow structure for optimization opportunities
    if (workflow.settings.parallelism === 'sequential') {
      const parallelizableSteps = identifyParallelizableSteps(workflow.steps);
      if (parallelizableSteps.length > 0) {
        newSuggestions.push({
          id: 'parallel-execution',
          type: 'performance',
          title: 'Enable Parallel Execution',
          description: 'Convert sequential steps to parallel execution for improved performance',
          impact: 'high',
          effort: 'medium',
          estimatedImprovement: `${Math.round((1 - 1/parallelizableSteps.length) * 100)}% faster execution`,
          category: 'Execution Strategy',
          tags: ['parallel', 'performance', 'concurrency'],
          isApplied: false,
          details: {
            before: { parallelism: 'sequential' },
            after: { parallelism: 'mixed' },
            reasoning: 'Steps that don\'t depend on each other can be executed in parallel',
            implementation: 'Configure workflow to use mixed parallelism mode'
          }
        });
      }
    }

    // Analyze timeout settings
    const avgExecutionTime = analytics?.averageDuration || 0;
    if (workflow.settings.timeout < avgExecutionTime * 2) {
      newSuggestions.push({
        id: 'timeout-optimization',
        type: 'reliability',
        title: 'Optimize Timeout Settings',
        description: 'Increase timeout to prevent premature execution failures',
        impact: 'medium',
        effort: 'low',
        estimatedImprovement: 'Reduce timeout-related failures by 60%',
        category: 'Configuration',
        tags: ['timeout', 'reliability', 'configuration'],
        isApplied: false,
        details: {
          before: { timeout: workflow.settings.timeout },
          after: { timeout: avgExecutionTime * 3 },
          reasoning: 'Current timeout is too restrictive for average execution time',
          implementation: 'Update workflow timeout configuration'
        }
      });
    }

    // Analyze retry policy
    if (workflow.settings.retryPolicy.maxRetries < 3) {
      newSuggestions.push({
        id: 'retry-policy',
        type: 'reliability',
        title: 'Improve Retry Policy',
        description: 'Increase retry attempts for better fault tolerance',
        impact: 'medium',
        effort: 'low',
        estimatedImprovement: 'Improve success rate by 15%',
        category: 'Error Handling',
        tags: ['retry', 'reliability', 'fault-tolerance'],
        isApplied: false,
        details: {
          before: { maxRetries: workflow.settings.retryPolicy.maxRetries },
          after: { maxRetries: 3 },
          reasoning: 'More retries can handle transient failures better',
          implementation: 'Update retry policy configuration'
        }
      });
    }

    // Analyze step efficiency
    const inefficientSteps = identifyInefficientSteps(workflow.steps, executions);
    inefficientSteps.forEach(step => {
      newSuggestions.push({
        id: `optimize-step-${step.id}`,
        type: 'performance',
        title: `Optimize ${step.name}`,
        description: `Improve performance of ${step.name} step`,
        impact: 'medium',
        effort: 'high',
        estimatedImprovement: 'Reduce execution time by 30%',
        category: 'Step Optimization',
        tags: ['step-optimization', 'performance'],
        isApplied: false,
        details: {
          before: { configuration: step.configuration },
          after: { configuration: optimizeStepConfiguration(step) },
          reasoning: 'Step configuration can be optimized for better performance',
          implementation: 'Update step configuration and implementation'
        }
      });
    });

    // Analyze resource usage
    if (hasHighResourceUsage(executions)) {
      newSuggestions.push({
        id: 'resource-optimization',
        type: 'cost',
        title: 'Optimize Resource Usage',
        description: 'Reduce memory and CPU usage for cost efficiency',
        impact: 'high',
        effort: 'medium',
        estimatedImprovement: 'Reduce costs by 25%',
        category: 'Resource Management',
        tags: ['resources', 'cost', 'efficiency'],
        isApplied: false,
        details: {
          before: { resourceUsage: 'high' },
          after: { resourceUsage: 'optimized' },
          reasoning: 'Current resource usage is inefficient',
          implementation: 'Implement resource optimization strategies'
        }
      });
    }

    setSuggestions(newSuggestions);
  };

  const calculatePerformanceMetrics = (
    workflow: WorkflowConfiguration,
    analytics: WorkflowAnalytics | null,
    executions: WorkflowExecution[]
  ) => {
    const currentMetrics = {
      executionTime: {
        current: analytics?.averageDuration || 0,
        optimized: 0,
        improvement: 0
      },
      resourceUsage: {
        memory: 85, // Mock data
        cpu: 70,
        network: 45
      },
      successRate: {
        current: analytics?.successRate || 0,
        optimized: 0,
        improvement: 0
      },
      cost: {
        current: 100, // Mock data
        optimized: 0,
        savings: 0
      }
    };

    // Calculate optimized metrics based on suggestions
    const appliedSuggestions = suggestions.filter(s => s.isApplied);
    let timeImprovement = 0;
    let successImprovement = 0;
    let costSavings = 0;

    appliedSuggestions.forEach(suggestion => {
      switch (suggestion.type) {
        case 'performance':
          timeImprovement += 30; // Assume 30% improvement per performance suggestion
          break;
        case 'reliability':
          successImprovement += 15; // Assume 15% improvement per reliability suggestion
          break;
        case 'cost':
          costSavings += 25; // Assume 25% cost savings per cost suggestion
          break;
      }
    });

    currentMetrics.executionTime.optimized = currentMetrics.executionTime.current * (1 - timeImprovement / 100);
    currentMetrics.executionTime.improvement = timeImprovement;
    
    currentMetrics.successRate.optimized = Math.min(1, currentMetrics.successRate.current + successImprovement / 100);
    currentMetrics.successRate.improvement = successImprovement;
    
    currentMetrics.cost.optimized = currentMetrics.cost.current * (1 - costSavings / 100);
    currentMetrics.cost.savings = costSavings;

    setPerformanceMetrics(currentMetrics);
  };

  const identifyParallelizableSteps = (steps: any[]) => {
    // Simple heuristic: steps that don't have dependencies can run in parallel
    return steps.filter(step => step.inputs.length === 0 || step.inputs.every((input: string) => 
      !steps.some(s => s.outputs.includes(input))
    ));
  };

  const identifyInefficientSteps = (steps: any[], executions: WorkflowExecution[]) => {
    // Find steps that take longer than expected
    return steps.filter(step => {
      const stepExecutions = executions.filter(e => e.results[step.id]);
      const avgStepTime = stepExecutions.reduce((sum, e) => sum + (e.duration || 0), 0) / stepExecutions.length;
      return avgStepTime > step.metadata.estimatedDuration * 1000 * 2; // 2x estimated time
    });
  };

  const hasHighResourceUsage = (executions: WorkflowExecution[]) => {
    // Mock check for high resource usage
    return executions.some(e => e.duration && e.duration > 300000); // 5 minutes
  };

  const optimizeStepConfiguration = (step: any) => {
    // Return optimized configuration
    return {
      ...step.configuration,
      optimized: true,
      batchSize: step.configuration.batchSize ? step.configuration.batchSize * 2 : 10,
      timeout: step.configuration.timeout ? step.configuration.timeout * 1.5 : 60000
    };
  };

  const applySuggestion = async (suggestionId: string) => {
    if (!workflow) return;

    try {
      setIsOptimizing(true);
      const suggestion = suggestions.find(s => s.id === suggestionId);
      if (!suggestion) return;

      // Apply the optimization
      const updatedWorkflow = { ...workflow };
      
      switch (suggestionId) {
        case 'parallel-execution':
          updatedWorkflow.settings.parallelism = 'mixed';
          break;
        case 'timeout-optimization':
          updatedWorkflow.settings.timeout = suggestion.details.after.timeout;
          break;
        case 'retry-policy':
          updatedWorkflow.settings.retryPolicy.maxRetries = suggestion.details.after.maxRetries;
          break;
        default:
          // Handle other suggestions
          break;
      }

      await aiWorkflowService.updateWorkflow(workflow.id, updatedWorkflow);
      setWorkflow(updatedWorkflow);

      // Mark suggestion as applied
      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, isApplied: true } : s
      ));

      // Recalculate metrics
      calculatePerformanceMetrics(updatedWorkflow, analytics, executions);
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Zap className="h-4 w-4" />;
      case 'cost':
        return <Target className="h-4 w-4" />;
      case 'reliability':
        return <CheckCircle className="h-4 w-4" />;
      case 'scalability':
        return <TrendingUp className="h-4 w-4" />;
      case 'maintainability':
        return <Settings className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Optimizer</h1>
          <p className="text-muted-foreground">
            Analyze and optimize workflow performance, cost, and reliability
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadWorkflowData}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
          <Button size="sm" disabled={suggestions.filter(s => s.isApplied).length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Apply All
          </Button>
        </div>
      </div>

      {!workflow && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Workflow Selected</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select a workflow to analyze and optimize its performance.
            </p>
          </CardContent>
        </Card>
      )}

      {workflow && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="metrics">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((suggestions.filter(s => s.isApplied).length / suggestions.length) * 100) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {suggestions.filter(s => s.isApplied).length} of {suggestions.length} applied
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance Gain</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {performanceMetrics?.executionTime.improvement || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Execution time improvement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {performanceMetrics?.cost.savings || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estimated cost reduction
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reliability</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((performanceMetrics?.successRate.optimized || 0) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Success rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common optimization tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Zap className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Performance Boost</div>
                      <div className="text-xs text-muted-foreground">Enable parallel execution</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Target className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Cost Optimization</div>
                      <div className="text-xs text-muted-foreground">Reduce resource usage</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <CheckCircle className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Reliability</div>
                      <div className="text-xs text-muted-foreground">Improve error handling</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="space-y-4">
              {suggestions.map(suggestion => (
                <Card key={suggestion.id} className={`${suggestion.isApplied ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(suggestion.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{suggestion.title}</h3>
                            {suggestion.isApplied && (
                              <Badge className="bg-green-100 text-green-800">
                                Applied
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <span>Impact:</span>
                              <Badge className={getImpactColor(suggestion.impact)}>
                                {suggestion.impact}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>Effort:</span>
                              <Badge className={getEffortColor(suggestion.effort)}>
                                {suggestion.effort}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Lightbulb className="h-4 w-4 text-yellow-600" />
                              <span className="font-medium text-green-600">
                                {suggestion.estimatedImprovement}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {suggestion.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!suggestion.isApplied && (
                          <Button
                            size="sm"
                            onClick={() => applySuggestion(suggestion.id)}
                            disabled={isOptimizing}
                          >
                            {isOptimizing ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Apply
                              </>
                            )}
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {suggestions.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Award className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Optimizations Needed</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Your workflow is already well-optimized! Great job on following best practices.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            {performanceMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Execution Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Current:</span>
                        <span className="font-medium">
                          {Math.round(performanceMetrics.executionTime.current / 1000)}s
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Optimized:</span>
                        <span className="font-medium text-green-600">
                          {Math.round(performanceMetrics.executionTime.optimized / 1000)}s
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Improvement:</span>
                        <span className="font-medium text-green-600">
                          +{performanceMetrics.executionTime.improvement}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Success Rate</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Current:</span>
                        <span className="font-medium">
                          {Math.round(performanceMetrics.successRate.current * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Optimized:</span>
                        <span className="font-medium text-green-600">
                          {Math.round(performanceMetrics.successRate.optimized * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Improvement:</span>
                        <span className="font-medium text-green-600">
                          +{performanceMetrics.successRate.improvement}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Resource Usage</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Memory:</span>
                        <span className="font-medium">{performanceMetrics.resourceUsage.memory}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CPU:</span>
                        <span className="font-medium">{performanceMetrics.resourceUsage.cpu}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Network:</span>
                        <span className="font-medium">{performanceMetrics.resourceUsage.network}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Cost Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Current Cost:</span>
                        <span className="font-medium">${performanceMetrics.cost.current}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Optimized Cost:</span>
                        <span className="font-medium text-green-600">
                          ${performanceMetrics.cost.optimized}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Savings:</span>
                        <span className="font-medium text-green-600">
                          {performanceMetrics.cost.savings}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>
                  Comprehensive analysis of workflow performance and optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Workflow Structure Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-blue-600">{workflow?.steps.length || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Steps</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {workflow?.settings.parallelism || 'sequential'}
                        </div>
                        <div className="text-sm text-muted-foreground">Execution Mode</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(workflow?.settings.timeout / 1000 || 0)}s
                        </div>
                        <div className="text-sm text-muted-foreground">Timeout</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Performance Bottlenecks</h4>
                    <div className="space-y-2">
                      {analytics?.performanceMetrics.bottleneckSteps.map((stepId, index) => {
                        const step = workflow?.steps.find(s => s.id === stepId);
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="font-medium">{step?.name || stepId}</span>
                            </div>
                            <Badge variant="outline" className="text-red-600">
                              Bottleneck
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Optimization Recommendations</h4>
                    <div className="space-y-3">
                      {suggestions.filter(s => s.impact === 'high' || s.impact === 'critical').map(suggestion => (
                        <div key={suggestion.id} className="p-3 border rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(suggestion.type)}
                            <span className="font-medium">{suggestion.title}</span>
                            <Badge className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.details.reasoning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WorkflowOptimizer;
