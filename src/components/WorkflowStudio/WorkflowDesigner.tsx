import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Save, 
  Settings, 
  Plus, 
  Trash2, 
  Copy, 
  Move,
  Zap,
  Bot,
  Search,
  BarChart3,
  GitBranch,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  Edit,
  Download,
  Upload,
  Layers,
  Workflow,
  Target,
  Brain,
  MessageSquare,
  TrendingUp,
  Filter,
  Merge,
  Split
} from 'lucide-react';
import { aiWorkflowService, type WorkflowConfiguration, type WorkflowStep, type WorkflowTemplate } from '@/services/aiWorkflowService';

interface WorkflowDesignerProps {
  workflowId?: string;
  onSave?: (workflow: WorkflowConfiguration) => void;
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

interface WorkflowNode {
  id: string;
  type: 'agent' | 'search' | 'analysis' | 'condition' | 'action' | 'delay' | 'parallel' | 'merge';
  position: NodePosition;
  data: WorkflowStep;
  isSelected: boolean;
  isDragging: boolean;
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  type: 'success' | 'failure' | 'default';
}

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ workflowId, onSave, className }) => {
  const [workflow, setWorkflow] = useState<WorkflowConfiguration | null>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('design');
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const stepTypes = [
    {
      type: 'agent',
      label: 'AI Agent',
      icon: <Bot className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800',
      description: 'Execute AI agent with specific capabilities'
    },
    {
      type: 'search',
      label: 'Search',
      icon: <Search className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800',
      description: 'Perform content search using Algolia'
    },
    {
      type: 'analysis',
      label: 'Analysis',
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-800',
      description: 'Analyze data and extract insights'
    },
    {
      type: 'condition',
      label: 'Condition',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Evaluate conditions and branch workflow'
    },
    {
      type: 'action',
      label: 'Action',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-red-100 text-red-800',
      description: 'Perform specific actions or operations'
    },
    {
      type: 'delay',
      label: 'Delay',
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-gray-100 text-gray-800',
      description: 'Wait for specified duration'
    },
    {
      type: 'parallel',
      label: 'Parallel',
      icon: <Split className="h-4 w-4" />,
      color: 'bg-indigo-100 text-indigo-800',
      description: 'Execute multiple steps in parallel'
    },
    {
      type: 'merge',
      label: 'Merge',
      icon: <Merge className="h-4 w-4" />,
      color: 'bg-pink-100 text-pink-800',
      description: 'Merge results from multiple steps'
    }
  ];

  useEffect(() => {
    loadTemplates();
    if (workflowId) {
      loadWorkflow(workflowId);
    } else {
      createNewWorkflow();
    }
  }, [workflowId]);

  const loadTemplates = async () => {
    try {
      const templateList = await aiWorkflowService.listTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadWorkflow = async (id: string) => {
    try {
      setIsLoading(true);
      const workflowData = await aiWorkflowService.getWorkflow(id);
      if (workflowData) {
        setWorkflow(workflowData);
        convertStepsToNodes(workflowData.steps);
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewWorkflow = () => {
    const newWorkflow: WorkflowConfiguration = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'A new workflow created in the designer',
      version: '1.0.0',
      isActive: true,
      steps: [],
      triggers: [],
      variables: {},
      settings: {
        timeout: 300000,
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5000,
          backoffMultiplier: 2
        },
        errorHandling: 'retry',
        parallelism: 'sequential',
        logging: {
          level: 'standard',
          retention: 30
        }
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user',
        category: 'custom',
        tags: []
      }
    };
    setWorkflow(newWorkflow);
  };

  const convertStepsToNodes = (steps: WorkflowStep[]) => {
    const newNodes: WorkflowNode[] = steps.map((step, index) => ({
      id: step.id,
      type: step.type,
      position: { x: 100 + index * 200, y: 100 },
      data: step,
      isSelected: false,
      isDragging: false
    }));
    setNodes(newNodes);
  };

  const convertNodesToSteps = (nodeList: WorkflowNode[]): WorkflowStep[] => {
    return nodeList.map(node => node.data);
  };

  const addNode = (type: string) => {
    if (!workflow) return;

    const newNode: WorkflowNode = {
      id: `step-${Date.now()}`,
      type: type as any,
      position: { x: 100 + nodes.length * 200, y: 100 },
      data: {
        id: `step-${Date.now()}`,
        name: `New ${type} Step`,
        type: type as any,
        configuration: {},
        inputs: [],
        outputs: [],
        metadata: {
          description: `A new ${type} step`,
          estimatedDuration: 30,
          complexity: 'low',
          category: type
        }
      },
      isSelected: false,
      isDragging: false
    };

    setNodes(prev => [...prev, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => conn.source !== nodeId && conn.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates });
    }
  };

  const selectNode = (nodeId: string) => {
    setNodes(prev => prev.map(node => ({
      ...node,
      isSelected: node.id === nodeId
    })));
    
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(node || null);
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offset = {
      x: e.clientX - rect.left - node.position.x,
      y: e.clientY - rect.top - node.position.y
    };

    setDragOffset(offset);
    setIsDragging(true);
    
    updateNode(nodeId, { isDragging: true });
    selectNode(nodeId);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedNode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newPosition = {
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    };

    updateNode(selectedNode.id, { position: newPosition });
  }, [isDragging, selectedNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (selectedNode) {
      updateNode(selectedNode.id, { isDragging: false });
    }
    setIsDragging(false);
  }, [selectedNode]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const saveWorkflow = async () => {
    if (!workflow) return;

    try {
      setIsLoading(true);
      const updatedWorkflow = {
        ...workflow,
        steps: convertNodesToSteps(nodes),
        metadata: {
          ...workflow.metadata,
          updatedAt: new Date()
        }
      };

      let savedWorkflow;
      if (workflowId) {
        savedWorkflow = await aiWorkflowService.updateWorkflow(workflowId, updatedWorkflow);
      } else {
        savedWorkflow = await aiWorkflowService.createWorkflow(updatedWorkflow);
      }

      setWorkflow(savedWorkflow);
      onSave?.(savedWorkflow);
    } catch (error) {
      console.error('Failed to save workflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFromTemplate = async (templateId: string) => {
    try {
      setIsLoading(true);
      const newWorkflow = await aiWorkflowService.createWorkflowFromTemplate(
        templateId,
        `Workflow from ${templates.find(t => t.id === templateId)?.name}`
      );
      setWorkflow(newWorkflow);
      convertStepsToNodes(newWorkflow.steps);
    } catch (error) {
      console.error('Failed to create from template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTypeInfo = (type: string) => {
    return stepTypes.find(s => s.type === type) || stepTypes[0];
  };

  const getNodeIcon = (type: string) => {
    const stepType = getStepTypeInfo(type);
    return stepType.icon;
  };

  const getNodeColor = (type: string) => {
    const stepType = getStepTypeInfo(type);
    return stepType.color;
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Workflow Designer</h1>
          <p className="text-sm text-muted-foreground">
            {workflow?.name || 'Create and configure intelligent workflows'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={saveWorkflow} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Workflow'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Step Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  {stepTypes.map(type => (
                    <Button
                      key={type.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addNode(type.type)}
                      className="h-auto p-3 flex flex-col items-center space-y-1"
                    >
                      {type.icon}
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Workflow Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Steps:</span>
                    <span className="font-medium">{nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span className="font-medium">{connections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={workflow?.isActive ? "default" : "secondary"}>
                      {workflow?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Test Workflow
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4 mr-2" />
                  Zoom: 100%
                </Button>
                <Button variant="outline" size="sm">
                  <Move className="h-4 w-4 mr-2" />
                  Pan
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Snap to Grid
                </Button>
              </div>
            </div>

            <div 
              ref={canvasRef}
              className="flex-1 relative bg-white overflow-hidden"
              style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            >
              {/* Nodes */}
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`absolute cursor-move select-none transition-all ${
                    node.isSelected ? 'ring-2 ring-blue-500' : ''
                  } ${node.isDragging ? 'z-50' : 'z-10'}`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    transform: node.isDragging ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <Card className={`w-48 ${getNodeColor(node.type)} border-2 hover:shadow-lg transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getNodeIcon(node.type)}
                          <CardTitle className="text-sm">{node.data.name}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNode(node.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs">
                        {node.data.metadata.description}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {node.type}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{node.data.metadata.estimatedDuration}s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Connections */}
              {connections.map(connection => (
                <svg
                  key={connection.id}
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 5 }}
                >
                  <path
                    d={`M ${100} ${100} Q ${200} ${50} ${300} ${100}`}
                    stroke={connection.type === 'success' ? '#10B981' : connection.type === 'failure' ? '#EF4444' : '#6B7280'}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={connection.type === 'failure' ? '5,5' : '0'}
                  />
                </svg>
              ))}

              {/* Empty State */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Workflow className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Steps Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add steps from the sidebar to start building your workflow
                    </p>
                    <Button onClick={() => addNode('agent')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Step
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Workflow Templates</h3>
              <div className="flex space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="content-discovery">Content Discovery</SelectItem>
                    <SelectItem value="content-creation">Content Creation</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.complexity}</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Steps:</span>
                        <span className="font-medium">{template.steps.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Duration:</span>
                        <span className="font-medium">{template.estimatedDuration}s</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Rating:</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{template.rating}</span>
                          <span className="text-yellow-500">⭐</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => createFromTemplate(template.id)}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="flex-1 p-4">
          {selectedNode ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Step Properties</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stepName">Step Name</Label>
                    <Input
                      id="stepName"
                      value={selectedNode.data.name}
                      onChange={(e) => {
                        const updatedData = { ...selectedNode.data, name: e.target.value };
                        updateNode(selectedNode.id, { data: updatedData });
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="stepDescription">Description</Label>
                    <Textarea
                      id="stepDescription"
                      value={selectedNode.data.metadata.description}
                      onChange={(e) => {
                        const updatedData = {
                          ...selectedNode.data,
                          metadata: {
                            ...selectedNode.data.metadata,
                            description: e.target.value
                          }
                        };
                        updateNode(selectedNode.id, { data: updatedData });
                      }}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="stepType">Step Type</Label>
                    <Select 
                      value={selectedNode.type}
                      onValueChange={(value) => {
                        updateNode(selectedNode.id, { 
                          type: value as any,
                          data: { ...selectedNode.data, type: value as any }
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stepTypes.map(type => (
                          <SelectItem key={type.type} value={type.type}>
                            <div className="flex items-center space-x-2">
                              {type.icon}
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimatedDuration">Estimated Duration (seconds)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      value={selectedNode.data.metadata.estimatedDuration}
                      onChange={(e) => {
                        const updatedData = {
                          ...selectedNode.data,
                          metadata: {
                            ...selectedNode.data.metadata,
                            estimatedDuration: parseInt(e.target.value) || 0
                          }
                        };
                        updateNode(selectedNode.id, { data: updatedData });
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="complexity">Complexity</Label>
                    <Select 
                      value={selectedNode.data.metadata.complexity}
                      onValueChange={(value) => {
                        const updatedData = {
                          ...selectedNode.data,
                          metadata: {
                            ...selectedNode.data.metadata,
                            complexity: value as any
                          }
                        };
                        updateNode(selectedNode.id, { data: updatedData });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Step Selected</h3>
                <p className="text-muted-foreground">
                  Select a step in the designer to view and edit its properties
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Workflow Preview</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visual View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Code View
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{workflow?.name || 'Untitled Workflow'}</CardTitle>
                <CardDescription>{workflow?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
                      <div className="text-sm text-muted-foreground">Total Steps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {nodes.reduce((sum, node) => sum + node.data.metadata.estimatedDuration, 0)}s
                      </div>
                      <div className="text-sm text-muted-foreground">Estimated Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {workflow?.settings.parallelism || 'sequential'}
                      </div>
                      <div className="text-sm text-muted-foreground">Execution Mode</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Workflow Steps</h4>
                    <div className="space-y-2">
                      {nodes.map((node, index) => (
                        <div key={node.id} className="flex items-center space-x-3 p-2 border rounded">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-shrink-0">
                            {getNodeIcon(node.type)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{node.data.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {node.data.metadata.description}
                            </div>
                          </div>
                          <Badge variant="outline" className={getNodeColor(node.type)}>
                            {node.type}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {node.data.metadata.estimatedDuration}s
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowDesigner;
