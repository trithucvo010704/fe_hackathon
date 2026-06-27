export interface Agent {
  id: string;
  name: string;
  model: string;
  status: 'idle' | 'working' | 'error' | 'paused';
  task?: string;
  performance: number;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedAgentId?: string;
  deadline: string;
}

export interface Stats {
  activeAgents: number;
  ongoingTasks: number;
  successRate: number;
  creditsUsed: number;
  lastUpdate: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  leaderId?: string;
  category?: string;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  key: string;
  description: string;
  leaderId?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  key?: string;
  leaderId?: string;
  category?: string;
  status?: 'ACTIVE' | 'PENDING' | 'CLOSED';
}

export interface ApiResponse<T> {
  status: number; // 1 for success, 0 for failure
  data: T | null;
  message: string;
  payload?: {
    error_code?: number;
    [key: string]: any;
  };
}

export interface Epic {
  id: string;
  projectId: string;
  key: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  deadline?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface Story {
  id: string;
  projectId: string;
  epicId?: string;
  key: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  deadline?: string;
}

export interface BitbucketRepository {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  workspace: string;
  url: string;
  fullName?: string;
  description?: string;
  isPrivate?: boolean;
  language?: string;
  commitCount?: number;
  prCount?: number;
  updatedAt?: string;
  bitbucketPayload?: any;
}

export interface ProjectRepository {
  id: string;
  projectId: string;
  name: string;
  language: string;
  framework: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEpicInput {
  projectId: string;
  key?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline?: string;
}

export interface CreateStoryInput {
  projectId: string;
  epicId?: string;
  key?: string;
  title: string;
  description: string;
  priority: string;
  deadline?: string;
}

export interface AddRepoInput {
  projectId: string;
  name: string;
  language: string;
  framework: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  goal?: string;
}

export interface CreateSprintInput {
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[];
  isActive: boolean;
}

export interface AiModel {
  id: string;
  name: string;
  provider: 'GOOGLE' | 'OPENAI' | 'ANTHROPIC' | 'CUSTOM' | string;
  displayName: string;
  active?: boolean;
  baseUrl?: string;
  apiKey?: string;
  createdAt: string;
}

export interface AiEnv {
  id: string;
  name: string;
  provider: 'GOOGLE' | 'OPENAI' | 'ANTHROPIC' | 'CUSTOM' | string;
  productionMode: boolean;
  baseUrl?: string;
  apiKey?: string;
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  storyId?: string;
  key: string;
  title: string;
  description?: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'NEED_FIX' | 'DONE' | 'CANCELLED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  storyPoint?: number;
  assigneeId?: string;
  assignee?: string;
  deadline?: string;
  category?: 'API' | 'SERVICE' | 'FUNCTION' | 'FE' | 'MOBILE' | 'DESIGN' | 'DOC' | 'UNKNOWN';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  projectId: string;
  storyId?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  storyPoint?: number;
  assigneeId?: string;
  deadline?: string;
  category?: string;
}


export interface ProjectMember extends User {
  role?: string;
  joinedAt?: string;
}
export interface ProjectDocument {
  id: string;
  name: string;
  content: string;
  refType: 'PROJECT' | 'EPIC' | 'STORY' | 'TASK';
  refId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLog {
  id: string;
  taskId: string;
  storyId?: string;
  userId: string;
  username: string;
  timeSpentHours: number;
  progressPercent: number;
  comment: string;
  loggingAt: string;
}

export interface CreateWorkLogInput {
  taskId: string;
  storyId?: string;
  timeSpentHours: number;
  progressPercent: number;
  comment: string;
  resolved?: boolean;
}

export interface GuidelineDoc {
  id: string;
  level: string;
  name: string;
  description: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuidelineInput {
  level: string;
  name: string;
  description: string;
  content: string;
}

export interface AgentBrain {
  id: string;
  name: string;
  modelId: string;
  envId: string;
  systemInstruction?: string;
  temperature?: number;
  thinkingLevel?: string;
  mcpServerIds?: string[];
  googleSearch?: boolean;
  includeThoughts?: boolean;
}

export interface Conversation {
  id: string; // Internal compatibility
  conversation_id: string; // From backend
  title: string;
  owner_id: string;
  lastMessage?: string;
  lastActive?: string;
  participants?: string[];
  agentBrainId?: string;
  messages?: Message[] | null;
}

export interface ChatMessagePayload {
  type: 'TEXT' | 'IMAGE' | 'MARKDOWN' | 'JSON' | 'MIXED';
  content: string;
  text?: string; // For compatibility with some API versions
  parts?: ChatMessagePayload[];
}

export interface Message {
  id: string;
  conversation_id: string;
  conversationId?: string; // Fallback for camelCase
  senderId: string;
  sender?: string; // From ChatMessageDto
  recipient?: string; // From ChatMessageDto
  senderName?: string;
  role: string;
  content: string;
  payload?: ChatMessagePayload;
  type?: 'TEXT' | 'IMAGE' | 'MARKDOWN' | 'JSON' | 'MIXED';
  createdAt: string;
}

export interface ChatMessageDto {
  sender: string;
  recipient: string;
  role: string;
  conversation_id: string;
  payload: ChatMessagePayload;
}

export interface CreateConversationInput {
  title: string;
  agentBrainId?: string;
  project_id?: string;
}

export interface CreateAgentConversationInput {
  brain_id: string;
  project_id: string;
}

export interface ReviewRequest {
  id: string;
  requester: string;
  key: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNKNOWN' | string;
  reviewer: string;
  refId: string;
  refType: string;
  refKey: string;
  comment: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSpec {
  id: string;
  projectId: string;
  storyId?: string;
  taskId?: string;
  key: string;
  storyKey?: string;
  name: string;
  endpoint: string;
  content: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbTableSpec {
  id: string;
  projectId: string;
  projectKey: string;
  tableName: string;
  content: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewComment {
  id: string;
  key: string;
  ownerId: string;
  reviewer: string;
  refId: string;
  refType: 'EPIC' | 'STORY';
  refKey: string;
  title: string;
  comment: string;
  status: 'APPROVED' | 'REJECTED' | 'UNKNOWN' | string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
