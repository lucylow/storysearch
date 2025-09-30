export type AgentIntent = 'find_content' | 'ask_question' | 'get_recommendation' | 'compare_options';

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  intent?: AgentIntent;
}

export interface AgentAction {
  id: string;
  label: string;
  description: string;
}
