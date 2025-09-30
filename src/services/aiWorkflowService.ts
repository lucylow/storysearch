// AI Workflow Service - Advanced workflow orchestration and automation
import { aiAgentService, type AgentConfiguration, type AgentResponse } from './aiAgentService';
import { algoliaService } from './algoliaService';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'agent' | 'search' | 'analysis' | 'condition' | 'action' | 'delay' | 'parallel' | 'merge';
  agentId?: string;
  configuration: Record<string, unknown>;
  inputs: string[];
  outputs: string[];
  conditions?: WorkflowCondition[];
  timeout?: number;
  retryCount?: number;
  onSuccess?: string[];
  onFailure?: string[];
  metadata: {
    description: string;
    estimatedDuration: number;
    complexity: 'low' | 'medium' | 'high';
    category: string;
  };
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'regex';
  value: unknown;
  logic: 'and' | 'or';
}

export interface WorkflowTrigger {
  id: string;
  type: 'manual' | 'schedule' | 'webhook' | 'event' | 'condition';
  configuration: Record<string, unknown>;
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  currentStep?: string;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  context: Record<string, unknown>;
  results: Record<string, unknown>;
  errors: Array<{
    step: string;
    error: string;
    timestamp: Date;
    retryCount: number;
  }>;
  metadata: {
    userId?: string;
    sessionId?: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    tags: string[];
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'content-discovery' | 'content-creation' | 'analysis' | 'automation' | 'integration';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  inputs: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  outputs: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  tags: string[];
  usageCount: number;
  rating: number;
  author: string;
  createdAt: Date;
}

export interface WorkflowConfiguration {
  id: string;
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  variables: Record<string, unknown>;
  settings: {
    timeout: number;
    retryPolicy: {
      maxRetries: number;
      retryDelay: number;
      backoffMultiplier: number;
    };
    errorHandling: 'stop' | 'continue' | 'retry' | 'skip';
    parallelism: 'sequential' | 'parallel' | 'mixed';
    logging: {
      level: 'minimal' | 'standard' | 'detailed';
      retention: number;
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    category: string;
    tags: string[];
  };
}

export interface WorkflowAnalytics {
  executionCount: number;
  successRate: number;
  averageDuration: number;
  failureRate: number;
  mostUsedSteps: Array<{
    stepId: string;
    name: string;
    usageCount: number;
    successRate: number;
  }>;
  performanceMetrics: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageStepDuration: number;
    bottleneckSteps: string[];
  };
  usagePatterns: {
    peakHours: number[];
    popularTriggers: string[];
    commonFailurePoints: string[];
  };
}

class AIWorkflowService {
  private workflows: Map<string, WorkflowConfiguration> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private templates: Map<string, WorkflowTemplate> = new Map();
  private analytics: Map<string, WorkflowAnalytics> = new Map();
  private executionQueue: WorkflowExecution[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeDefaultTemplates();
    this.startExecutionProcessor();
  }

  // ===== WORKFLOW MANAGEMENT =====

  async createWorkflow(config: Omit<WorkflowConfiguration, 'id' | 'metadata'>): Promise<WorkflowConfiguration> {
    const workflow: WorkflowConfiguration = {
      ...config,
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        ...config.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    await this.validateWorkflow(workflow);
    this.workflows.set(workflow.id, workflow);
    
    // Initialize analytics
    this.analytics.set(workflow.id, {
      executionCount: 0,
      successRate: 0,
      averageDuration: 0,
      failureRate: 0,
      mostUsedSteps: [],
      performanceMetrics: {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        averageStepDuration: 0,
        bottleneckSteps: []
      },
      usagePatterns: {
        peakHours: [],
        popularTriggers: [],
        commonFailurePoints: []
      }
    });

    return workflow;
  }

  async updateWorkflow(id: string, updates: Partial<WorkflowConfiguration>): Promise<WorkflowConfiguration> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      metadata: {
        ...workflow.metadata,
        ...updates.metadata,
        updatedAt: new Date()
      }
    };

    await this.validateWorkflow(updatedWorkflow);
    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const deleted = this.workflows.delete(id);
    if (deleted) {
      this.analytics.delete(id);
      // Cancel any running executions
      for (const [executionId, execution] of this.executions) {
        if (execution.workflowId === id && execution.status === 'running') {
          execution.status = 'cancelled';
        }
      }
    }
    return deleted;
  }

  async getWorkflow(id: string): Promise<WorkflowConfiguration | null> {
    return this.workflows.get(id) || null;
  }

  async listWorkflows(): Promise<WorkflowConfiguration[]> {
    return Array.from(this.workflows.values());
  }

  // ===== WORKFLOW EXECUTION =====

  async executeWorkflow(
    workflowId: string, 
    inputs: Record<string, unknown> = {},
    options: {
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      userId?: string;
      sessionId?: string;
      tags?: string[];
    } = {}
  ): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (!workflow.isActive) {
      throw new Error(`Workflow ${workflowId} is not active`);
    }

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      status: 'pending',
      progress: 0,
      startedAt: new Date(),
      context: { ...workflow.variables, ...inputs },
      results: {},
      errors: [],
      metadata: {
        priority: options.priority || 'normal',
        userId: options.userId,
        sessionId: options.sessionId,
        tags: options.tags || []
      }
    };

    this.executions.set(execution.id, execution);
    this.executionQueue.push(execution);
    
    // Update analytics
    const analytics = this.analytics.get(workflowId);
    if (analytics) {
      analytics.executionCount++;
      analytics.performanceMetrics.totalExecutions++;
    }

    return execution;
  }

  async getExecution(id: string): Promise<WorkflowExecution | null> {
    return this.executions.get(id) || null;
  }

  async listExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    const executions = Array.from(this.executions.values());
    return workflowId ? executions.filter(e => e.workflowId === workflowId) : executions;
  }

  async cancelExecution(id: string): Promise<boolean> {
    const execution = this.executions.get(id);
    if (!execution) return false;

    if (execution.status === 'running' || execution.status === 'pending') {
      execution.status = 'cancelled';
      execution.completedAt = new Date();
      execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime();
      return true;
    }

    return false;
  }

  // ===== WORKFLOW TEMPLATES =====

  private initializeDefaultTemplates(): void {
    const templates: WorkflowTemplate[] = [
      {
        id: 'content-discovery-workflow',
        name: 'Intelligent Content Discovery',
        description: 'Automatically discover content patterns, trends, and opportunities',
        category: 'content-discovery',
        complexity: 'intermediate',
        estimatedDuration: 300,
        steps: [
          {
            id: 'search-content',
            name: 'Search Content',
            type: 'search',
            configuration: { query: '{{searchQuery}}', limit: 50 },
            inputs: ['searchQuery'],
            outputs: ['searchResults'],
            metadata: {
              description: 'Search for content based on query',
              estimatedDuration: 30,
              complexity: 'low',
              category: 'search'
            }
          },
          {
            id: 'analyze-patterns',
            name: 'Analyze Patterns',
            type: 'analysis',
            configuration: { analysisType: 'pattern', depth: 'deep' },
            inputs: ['searchResults'],
            outputs: ['patterns'],
            metadata: {
              description: 'Analyze patterns in search results',
              estimatedDuration: 60,
              complexity: 'medium',
              category: 'analysis'
            }
          },
          {
            id: 'generate-insights',
            name: 'Generate Insights',
            type: 'agent',
            agentId: 'discovery-agent',
            configuration: { insightType: 'comprehensive' },
            inputs: ['patterns'],
            outputs: ['insights'],
            metadata: {
              description: 'Generate actionable insights',
              estimatedDuration: 90,
              complexity: 'high',
              category: 'agent'
            }
          },
          {
            id: 'create-recommendations',
            name: 'Create Recommendations',
            type: 'agent',
            agentId: 'discovery-agent',
            configuration: { recommendationType: 'actionable' },
            inputs: ['insights'],
            outputs: ['recommendations'],
            metadata: {
              description: 'Create actionable recommendations',
              estimatedDuration: 60,
              complexity: 'medium',
              category: 'agent'
            }
          }
        ],
        triggers: [
          {
            id: 'manual-trigger',
            type: 'manual',
            configuration: {},
            isActive: true,
            triggerCount: 0
          }
        ],
        inputs: [
          {
            name: 'searchQuery',
            type: 'string',
            required: true,
            description: 'The search query for content discovery'
          }
        ],
        outputs: [
          {
            name: 'insights',
            type: 'array',
            description: 'Generated insights and patterns'
          },
          {
            name: 'recommendations',
            type: 'array',
            description: 'Actionable recommendations'
          }
        ],
        tags: ['content', 'discovery', 'analysis', 'insights'],
        usageCount: 0,
        rating: 4.8,
        author: 'StorySearch AI',
        createdAt: new Date()
      },
      {
        id: 'content-creation-workflow',
        name: 'AI-Powered Content Creation',
        description: 'Automated content creation with AI assistance',
        category: 'content-creation',
        complexity: 'advanced',
        estimatedDuration: 600,
        steps: [
          {
            id: 'research-topic',
            name: 'Research Topic',
            type: 'agent',
            agentId: 'askai-agent',
            configuration: { researchDepth: 'comprehensive' },
            inputs: ['topic'],
            outputs: ['research'],
            metadata: {
              description: 'Research the topic thoroughly',
              estimatedDuration: 120,
              complexity: 'high',
              category: 'agent'
            }
          },
          {
            id: 'generate-outline',
            name: 'Generate Outline',
            type: 'agent',
            agentId: 'studio-agent',
            configuration: { structure: 'hierarchical' },
            inputs: ['research'],
            outputs: ['outline'],
            metadata: {
              description: 'Create content outline',
              estimatedDuration: 60,
              complexity: 'medium',
              category: 'agent'
            }
          },
          {
            id: 'write-content',
            name: 'Write Content',
            type: 'agent',
            agentId: 'studio-agent',
            configuration: { style: 'professional', length: 'comprehensive' },
            inputs: ['outline', 'research'],
            outputs: ['content'],
            metadata: {
              description: 'Generate the main content',
              estimatedDuration: 240,
              complexity: 'high',
              category: 'agent'
            }
          },
          {
            id: 'optimize-seo',
            name: 'Optimize SEO',
            type: 'action',
            configuration: { optimizationType: 'comprehensive' },
            inputs: ['content'],
            outputs: ['optimizedContent'],
            metadata: {
              description: 'Optimize content for SEO',
              estimatedDuration: 90,
              complexity: 'medium',
              category: 'optimization'
            }
          },
          {
            id: 'quality-check',
            name: 'Quality Check',
            type: 'condition',
            configuration: { checkType: 'comprehensive' },
            inputs: ['optimizedContent'],
            outputs: ['qualityScore'],
            conditions: [
              {
                id: 'quality-threshold',
                field: 'qualityScore',
                operator: 'greater_than',
                value: 0.8,
                logic: 'and'
              }
            ],
            metadata: {
              description: 'Check content quality',
              estimatedDuration: 60,
              complexity: 'medium',
              category: 'quality'
            }
          }
        ],
        triggers: [
          {
            id: 'schedule-trigger',
            type: 'schedule',
            configuration: { schedule: '0 9 * * 1-5' }, // Weekdays at 9 AM
            isActive: true,
            triggerCount: 0
          }
        ],
        inputs: [
          {
            name: 'topic',
            type: 'string',
            required: true,
            description: 'The topic for content creation'
          }
        ],
        outputs: [
          {
            name: 'optimizedContent',
            type: 'string',
            description: 'SEO-optimized content ready for publication'
          }
        ],
        tags: ['content', 'creation', 'ai', 'seo', 'automation'],
        usageCount: 0,
        rating: 4.6,
        author: 'StorySearch AI',
        createdAt: new Date()
      },
      {
        id: 'multi-agent-analysis',
        name: 'Multi-Agent Content Analysis',
        description: 'Comprehensive content analysis using multiple specialized agents',
        category: 'analysis',
        complexity: 'advanced',
        estimatedDuration: 450,
        steps: [
          {
            id: 'parallel-analysis',
            name: 'Parallel Analysis',
            type: 'parallel',
            configuration: { parallelSteps: ['semantic-analysis', 'sentiment-analysis', 'trend-analysis'] },
            inputs: ['content'],
            outputs: ['analysisResults'],
            metadata: {
              description: 'Run multiple analyses in parallel',
              estimatedDuration: 120,
              complexity: 'high',
              category: 'parallel'
            }
          },
          {
            id: 'semantic-analysis',
            name: 'Semantic Analysis',
            type: 'agent',
            agentId: 'discovery-agent',
            configuration: { analysisType: 'semantic' },
            inputs: ['content'],
            outputs: ['semanticResults'],
            metadata: {
              description: 'Perform semantic analysis',
              estimatedDuration: 90,
              complexity: 'medium',
              category: 'agent'
            }
          },
          {
            id: 'sentiment-analysis',
            name: 'Sentiment Analysis',
            type: 'agent',
            agentId: 'askai-agent',
            configuration: { analysisType: 'sentiment' },
            inputs: ['content'],
            outputs: ['sentimentResults'],
            metadata: {
              description: 'Analyze content sentiment',
              estimatedDuration: 60,
              complexity: 'low',
              category: 'agent'
            }
          },
          {
            id: 'trend-analysis',
            name: 'Trend Analysis',
            type: 'agent',
            agentId: 'discovery-agent',
            configuration: { analysisType: 'trend' },
            inputs: ['content'],
            outputs: ['trendResults'],
            metadata: {
              description: 'Analyze content trends',
              estimatedDuration: 90,
              complexity: 'medium',
              category: 'agent'
            }
          },
          {
            id: 'merge-results',
            name: 'Merge Results',
            type: 'merge',
            configuration: { mergeStrategy: 'weighted' },
            inputs: ['semanticResults', 'sentimentResults', 'trendResults'],
            outputs: ['finalAnalysis'],
            metadata: {
              description: 'Merge all analysis results',
              estimatedDuration: 30,
              complexity: 'low',
              category: 'merge'
            }
          }
        ],
        triggers: [
          {
            id: 'webhook-trigger',
            type: 'webhook',
            configuration: { endpoint: '/api/webhook/content-analysis' },
            isActive: true,
            triggerCount: 0
          }
        ],
        inputs: [
          {
            name: 'content',
            type: 'string',
            required: true,
            description: 'The content to analyze'
          }
        ],
        outputs: [
          {
            name: 'finalAnalysis',
            type: 'object',
            description: 'Comprehensive analysis results'
          }
        ],
        tags: ['analysis', 'multi-agent', 'semantic', 'sentiment', 'trends'],
        usageCount: 0,
        rating: 4.9,
        author: 'StorySearch AI',
        createdAt: new Date()
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  async getTemplate(id: string): Promise<WorkflowTemplate | null> {
    return this.templates.get(id) || null;
  }

  async listTemplates(category?: string): Promise<WorkflowTemplate[]> {
    const templates = Array.from(this.templates.values());
    return category ? templates.filter(t => t.category === category) : templates;
  }

  async createWorkflowFromTemplate(
    templateId: string, 
    name: string, 
    customizations: Record<string, unknown> = {}
  ): Promise<WorkflowConfiguration> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const workflow = await this.createWorkflow({
      name,
      description: template.description,
      version: '1.0.0',
      isActive: true,
      steps: template.steps.map(step => ({
        ...step,
        id: `${step.id}-${Date.now()}`
      })),
      triggers: template.triggers.map(trigger => ({
        ...trigger,
        id: `${trigger.id}-${Date.now()}`,
        triggerCount: 0
      })),
      variables: customizations,
      settings: {
        timeout: template.estimatedDuration * 2,
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5000,
          backoffMultiplier: 2
        },
        errorHandling: 'retry',
        parallelism: 'mixed',
        logging: {
          level: 'standard',
          retention: 30
        }
      },
      metadata: {
        createdBy: 'user',
        category: template.category,
        tags: template.tags
      }
    });

    // Update template usage count
    template.usageCount++;

    return workflow;
  }

  // ===== WORKFLOW EXECUTION PROCESSOR =====

  private async startExecutionProcessor(): Promise<void> {
    setInterval(async () => {
      if (!this.isProcessing && this.executionQueue.length > 0) {
        await this.processExecutionQueue();
      }
    }, 1000);
  }

  private async processExecutionQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.executionQueue.length > 0) {
      const execution = this.executionQueue.shift();
      if (!execution) break;

      try {
        await this.executeWorkflowSteps(execution);
      } catch (error) {
        console.error('Execution failed:', error);
        execution.status = 'failed';
        execution.errors.push({
          step: 'system',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
          retryCount: 0
        });
      }
    }

    this.isProcessing = false;
  }

  private async executeWorkflowSteps(execution: WorkflowExecution): Promise<void> {
    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${execution.workflowId} not found`);
    }

    execution.status = 'running';
    const startTime = Date.now();

    try {
      for (const step of workflow.steps) {
        execution.currentStep = step.id;
        execution.progress = (workflow.steps.indexOf(step) / workflow.steps.length) * 100;

        try {
          const result = await this.executeStep(step, execution.context);
          execution.results[step.id] = result;
          execution.context = { ...execution.context, ...result };
        } catch (error) {
          const errorInfo = {
            step: step.id,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date(),
            retryCount: 0
          };

          execution.errors.push(errorInfo);

          // Handle error based on workflow settings
          switch (workflow.settings.errorHandling) {
            case 'stop':
              throw error;
            case 'continue':
              continue;
            case 'retry':
              // Implement retry logic
              break;
            case 'skip':
              continue;
          }
        }
      }

      execution.status = 'completed';
      execution.progress = 100;
    } catch (error) {
      execution.status = 'failed';
    } finally {
      execution.completedAt = new Date();
      execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime();
    }
  }

  private async executeStep(step: WorkflowStep, context: Record<string, unknown>): Promise<Record<string, unknown>> {
    switch (step.type) {
      case 'agent':
        if (!step.agentId) throw new Error('Agent ID required for agent step');
        
        const query = this.interpolateVariables(step.configuration.query as string, context);
        const response = await aiAgentService.askAI(query, step.agentId, context);
        
        return {
          [step.outputs[0]]: response.content,
          confidence: response.confidence,
          sources: response.sources
        };

      case 'search':
        const searchQuery = this.interpolateVariables(step.configuration.query as string, context);
        const searchResults = await algoliaService.search(searchQuery, step.configuration);
        
        return {
          [step.outputs[0]]: searchResults
        };

      case 'analysis':
        const analysisData = context[step.inputs[0]];
        const analysisResults = await this.performAnalysis(analysisData, step.configuration);
        
        return {
          [step.outputs[0]]: analysisResults
        };

      case 'condition':
        const conditionResult = this.evaluateConditions(step.conditions!, context);
        
        if (conditionResult) {
          return { [step.outputs[0]]: conditionResult };
        } else {
          throw new Error('Condition not met');
        }

      case 'delay':
        const delayMs = step.configuration.duration as number || 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return {};

      case 'parallel':
        const parallelSteps = step.configuration.parallelSteps as string[];
        const parallelResults = await Promise.all(
          parallelSteps.map(stepId => this.executeStep(step, context))
        );
        
        return {
          [step.outputs[0]]: parallelResults
        };

      case 'merge':
        const mergeData = step.inputs.map(input => context[input]);
        const mergedResult = this.mergeData(mergeData, step.configuration);
        
        return {
          [step.outputs[0]]: mergedResult
        };

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  // ===== UTILITY METHODS =====

  private interpolateVariables(template: string, context: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return String(context[key] || match);
    });
  }

  private evaluateConditions(conditions: WorkflowCondition[], context: Record<string, unknown>): boolean {
    return conditions.every(condition => {
      const value = context[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'greater_than':
          return Number(value) > Number(condition.value);
        case 'less_than':
          return Number(value) < Number(condition.value);
        case 'exists':
          return value !== undefined && value !== null;
        case 'regex':
          return new RegExp(String(condition.value)).test(String(value));
        default:
          return false;
      }
    });
  }

  private async performAnalysis(data: unknown, configuration: Record<string, unknown>): Promise<unknown> {
    // Implement analysis logic based on configuration
    const analysisType = configuration.analysisType as string;
    
    switch (analysisType) {
      case 'pattern':
        return this.analyzePatterns(data);
      case 'semantic':
        return this.analyzeSemantics(data);
      case 'trend':
        return this.analyzeTrends(data);
      default:
        return data;
    }
  }

  private analyzePatterns(data: unknown): unknown {
    // Implement pattern analysis
    return { patterns: ['pattern1', 'pattern2'], confidence: 0.85 };
  }

  private analyzeSemantics(data: unknown): unknown {
    // Implement semantic analysis
    return { semantics: ['concept1', 'concept2'], relevance: 0.92 };
  }

  private analyzeTrends(data: unknown): unknown {
    // Implement trend analysis
    return { trends: ['trend1', 'trend2'], direction: 'upward' };
  }

  private mergeData(data: unknown[], configuration: Record<string, unknown>): unknown {
    const strategy = configuration.mergeStrategy as string || 'concat';
    
    switch (strategy) {
      case 'concat':
        return data.flat();
      case 'weighted':
        // Implement weighted merging
        return data;
      default:
        return data;
    }
  }

  private async validateWorkflow(workflow: WorkflowConfiguration): Promise<void> {
    // Validate workflow structure
    if (!workflow.steps || workflow.steps.length === 0) {
      throw new Error('Workflow must have at least one step');
    }

    // Validate step dependencies
    for (const step of workflow.steps) {
      for (const input of step.inputs) {
        const hasInput = workflow.steps.some(s => s.outputs.includes(input));
        if (!hasInput && !workflow.variables[input]) {
          throw new Error(`Step ${step.id} references undefined input: ${input}`);
        }
      }
    }
  }

  // ===== ANALYTICS =====

  async getWorkflowAnalytics(workflowId: string): Promise<WorkflowAnalytics | null> {
    return this.analytics.get(workflowId) || null;
  }

  async getExecutionHistory(workflowId: string, limit = 50): Promise<WorkflowExecution[]> {
    const executions = Array.from(this.executions.values())
      .filter(e => e.workflowId === workflowId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);

    return executions;
  }

  async getPerformanceMetrics(workflowId: string): Promise<{
    averageExecutionTime: number;
    successRate: number;
    failureRate: number;
    mostCommonErrors: Array<{ error: string; count: number }>;
    peakUsageHours: number[];
  }> {
    const executions = Array.from(this.executions.values())
      .filter(e => e.workflowId === workflowId);

    const completedExecutions = executions.filter(e => e.status === 'completed');
    const failedExecutions = executions.filter(e => e.status === 'failed');

    const averageExecutionTime = completedExecutions.reduce((sum, e) => 
      sum + (e.duration || 0), 0) / completedExecutions.length || 0;

    const successRate = completedExecutions.length / executions.length || 0;
    const failureRate = failedExecutions.length / executions.length || 0;

    // Count common errors
    const errorCounts = new Map<string, number>();
    failedExecutions.forEach(e => {
      e.errors.forEach(err => {
        const count = errorCounts.get(err.error) || 0;
        errorCounts.set(err.error, count + 1);
      });
    });

    const mostCommonErrors = Array.from(errorCounts.entries())
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Analyze peak usage hours
    const hourCounts = new Map<number, number>();
    executions.forEach(e => {
      const hour = e.startedAt.getHours();
      const count = hourCounts.get(hour) || 0;
      hourCounts.set(hour, count + 1);
    });

    const peakUsageHours = Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => hour);

    return {
      averageExecutionTime,
      successRate,
      failureRate,
      mostCommonErrors,
      peakUsageHours
    };
  }
}

export const aiWorkflowService = new AIWorkflowService();
