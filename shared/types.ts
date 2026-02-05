export type NodeType = 'SYSTEM' | 'MODULE' | 'FILE' | 'CLASS' | 'INTERFACE' | 'FUNCTION' | 'METHOD' | 'VARIABLE';

export interface CodeNode {
  id: string; // Unique identifier (usually path or symbol signature)
  type: NodeType;
  label: string; // Display name
  path?: string; // File path
  line?: number; // Start line number
  metadata?: Record<string, any>; // Language-specific metadata (e.g. modifiers, returnType)
}

export interface CodeEdge {
  source: string;
  target: string;
  relation: 'IMPORTS' | 'CALLS' | 'INHERITS' | 'IMPLEMENTS' | 'CONTAINS';
  weight?: number;
}

export interface GraphData {
  nodes: CodeNode[];
  edges: CodeEdge[];
}

export interface ProjectStats {
  files: number;
  classes: number;
  functions: number;
  linesOfCode: number;
}

export interface GovernanceIssue {
  type: 'CIRCULAR_DEPENDENCY' | 'COMPLEXITY_ISSUE' | 'VIOLATION';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  description: string;
  relatedNodes: string[]; // IDs of nodes involved
}

export interface AnalysisResult {
  projectId: string;
  timestamp: number;
  stats: ProjectStats;
  graph: GraphData;
  issues?: GovernanceIssue[];
  impactNodes?: string[]; // IDs of nodes affected by changes
}
