import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Eye, 
  Download, 
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader,
  TrendingUp,
  Activity,
  Zap,
  BarChart3,
  Users,
  Target,
  Calendar,
  ArrowRight,
  MoreVertical,
  Settings,
  Bell,
  BellOff,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { aiWorkflowService, type WorkflowExecution, type WorkflowConfiguration, type WorkflowAnalytics } from '@/services/aiWorkflowService';

interface WorkflowMonitorProps {
  workflowId?: string;
  className?: string;
}

const WorkflowMonitor: React.FC<WorkflowMonitorProps> = ({ workflowId, className }) => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowConfiguration[]>([]);
  const [analytics, setAnalytics] = useState<Map<string, WorkflowAnalytics>>(new Map());
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [activeTab, setActiveTab] = useState('executions');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    workflow: 'all',
    dateRange: '24h'
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [workflowId, filter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load workflows
      const workflowList = await aiWorkflowService.listWorkflows();
      setWorkflows(workflowList);

      // Load executions
      const executionList = await aiWorkflowService.listExecutions(workflowId);
      setExecutions(executionList);

      // Load analytics for each workflow
      const analyticsMap = new Map<string, WorkflowAnalytics>();
      for (const workflow of workflowList) {
        const workflowAnalytics = await aiWorkflowService.getWorkflowAnalytics(workflow.id);
        if (workflowAnalytics) {
          analyticsMap.set(workflow.id, workflowAnalytics);
        }
      }
      setAnalytics(analyticsMap);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecutionAction = async (executionId: string, action: 'cancel' | 'pause' | 'resume') => {
    try {
      switch (action) {
        case 'cancel':
          await aiWorkflowService.cancelExecution(executionId);
          break;
        case 'pause':
          // Implement pause logic
          break;
        case 'resume':
          // Implement resume logic
          break;
      }
      await loadData();
    } catch (error) {
      console.error(`Failed to ${action} execution:`, error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'running':
        return <Loader className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-orange-600" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(timestamp));
  };

  const filteredExecutions = executions.filter(execution => {
    if (filter.status !== 'all' && execution.status !== filter.status) return false;
    if (filter.workflow !== 'all' && execution.workflowId !== filter.workflow) return false;
    
    if (filter.dateRange !== 'all') {
      const now = new Date();
      const executionTime = new Date(execution.startedAt);
      const hoursAgo = filter.dateRange === '24h' ? 24 : filter.dateRange === '7d' ? 168 : 720;
      const cutoffTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      if (executionTime < cutoffTime) return false;
    }
    
    return true;
  });

  const getOverallStats = () => {
    const total = executions.length;
    const completed = executions.filter(e => e.status === 'completed').length;
    const failed = executions.filter(e => e.status === 'failed').length;
    const running = executions.filter(e => e.status === 'running').length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, failed, running, successRate };
  };

  const stats = getOverallStats();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Monitor</h1>
          <p className="text-muted-foreground">
            Monitor and manage workflow executions in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Loader className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.running}</div>
            <p className="text-xs text-muted-foreground">
              Currently executing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}% failure rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={filter.workflow}
                  onChange={(e) => setFilter(prev => ({ ...prev, workflow: e.target.value }))}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Workflows</option>
                  {workflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.dateRange}
                  onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Executions List */}
          <div className="space-y-4">
            {filteredExecutions.map(execution => (
              <Card key={execution.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(execution.status)}
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="font-medium">
                          {workflows.find(w => w.id === execution.workflowId)?.name || 'Unknown Workflow'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {execution.id.slice(-8)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimestamp(execution.startedAt)}</span>
                        </div>
                        
                        {execution.duration && (
                          <div className="flex items-center space-x-1">
                            <Zap className="h-4 w-4" />
                            <span>{formatDuration(execution.duration)}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>{Math.round(execution.progress)}%</span>
                        </div>

                        <Badge variant="outline" className={getPriorityColor(execution.metadata.priority)}>
                          {execution.metadata.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {execution.status === 'running' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExecutionAction(execution.id, 'pause');
                            }}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExecutionAction(execution.id, 'cancel');
                            }}
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {execution.status === 'paused' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecutionAction(execution.id, 'resume');
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExecution(execution);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {execution.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center space-x-2 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Errors:</span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {execution.errors.slice(0, 2).map((error, index) => (
                          <div key={index} className="text-sm text-red-700">
                            {error.step}: {error.error}
                          </div>
                        ))}
                        {execution.errors.length > 2 && (
                          <div className="text-sm text-red-600">
                            +{execution.errors.length - 2} more errors
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredExecutions.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Executions Found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    No workflow executions match your current filters. Try adjusting your filter criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(analytics.entries()).map(([workflowId, workflowAnalytics]) => {
              const workflow = workflows.find(w => w.id === workflowId);
              return (
                <Card key={workflowId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{workflow?.name || 'Unknown Workflow'}</CardTitle>
                    <CardDescription>{workflow?.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Executions:</span>
                        <span className="font-bold">{workflowAnalytics.executionCount}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Success Rate:</span>
                        <span className="font-bold text-green-600">
                          {Math.round(workflowAnalytics.successRate * 100)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Avg Duration:</span>
                        <span className="font-bold">
                          {formatDuration(workflowAnalytics.averageDuration)}
                        </span>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="text-sm font-medium mb-2">Performance:</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Total:</span>
                            <span>{workflowAnalytics.performanceMetrics.totalExecutions}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Successful:</span>
                            <span className="text-green-600">
                              {workflowAnalytics.performanceMetrics.successfulExecutions}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Failed:</span>
                            <span className="text-red-600">
                              {workflowAnalytics.performanceMetrics.failedExecutions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map(workflow => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Steps:</span>
                      <span className="font-medium">{workflow.steps.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Triggers:</span>
                      <span className="font-medium">
                        {workflow.triggers.filter(t => t.isActive).length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Parallelism:</span>
                      <Badge variant="outline">
                        {workflow.settings.parallelism}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Error Handling:</span>
                      <Badge variant="outline">
                        {workflow.settings.errorHandling}
                      </Badge>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(workflow.metadata.updatedAt).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Execution Detail Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Execution Details</CardTitle>
                  <CardDescription>
                    {selectedExecution.id} - {selectedExecution.status}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedExecution(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Execution Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(selectedExecution.status)}>
                        {selectedExecution.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Started:</span>
                      <span>{formatTimestamp(selectedExecution.startedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{formatDuration(selectedExecution.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span>{Math.round(selectedExecution.progress)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Metadata</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Priority:</span>
                      <Badge variant="outline" className={getPriorityColor(selectedExecution.metadata.priority)}>
                        {selectedExecution.metadata.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>User ID:</span>
                      <span>{selectedExecution.metadata.userId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session ID:</span>
                      <span>{selectedExecution.metadata.sessionId || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedExecution.errors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Errors</h4>
                  <div className="space-y-2">
                    {selectedExecution.errors.map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-800">{error.step}</span>
                          <span className="text-sm text-red-600">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-red-700">{error.error}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Results</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(selectedExecution.results, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkflowMonitor;
