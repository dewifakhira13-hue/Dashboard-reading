export type PerformanceCategory = 'Excellent' | 'Good' | 'Fair' | 'Needs Support';
export type TextType = 'Narrative' | 'Expository' | 'Descriptive' | 'Report' | 'Argumentative';
export type TextLevel = 'A1' | 'A2' | 'A2+' | 'B1' | 'B1+' | 'B2';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type DecisionStatus = 'Pending' | 'Accept' | 'Modify' | 'Reject';

export interface Student {
  id: string; // e.g. EXP-5001 or STU-001
  date: string; // e.g. 2026-09-24 (Student input / test date)
  name: string;
  school: string;
  class: string;
  grade: string;
  teacherName: string;
  active: boolean;
  avatar?: string;
  // Current snapshot metrics (from latest session)
  readingScore: number;
  mainIdea: number;
  specificInfo: number;
  inference: number;
  vocabulary: number;
  engagement: number;
  confidence: number;
  anxiety: number;
  motivation: number;
  level: PerformanceCategory;
}

export interface ReadingSessionRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  session: string; // 'Session 1', 'Session 2', etc.
  readingTextId: string;
  readingTextTitle: string;
  textType: TextType;
  textLevel: TextLevel;
  readingScore: number; // 0-100
  mainIdeaScore: number; // 0-100
  specificInformationScore: number; // 0-100
  inferenceScore: number; // 0-100
  vocabularyScore: number; // 0-100
  taskCompletionPercent: number; // 0-100
  responseTimeSeconds: number; // seconds
  engagement: number; // 1-5
  confidence: number; // 1-5
  readingAnxiety: number; // 1-5 (higher = greater concern)
  motivation: number; // 1-5
  performanceLevel: PerformanceCategory;
  date?: string;
}

export interface AIInsightRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  session: string;
  priority: PriorityLevel;
  detectedPattern: string;
  evidence: string;
  aiInsight: string;
  suggestedActions: string[];
  teacherDecision: DecisionStatus;
  teacherComment: string;
  modifiedAction?: string;
  updatedAt?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'ai' | 'recommendation' | 'upload' | 'view' | 'engagement' | 'decision';
}

export interface ClassFilterState {
  school: string;
  class: string;
  grade?: string;
  readingText: string;
  session: string;
  date?: string;
  activeStatus?: 'all' | 'active' | 'inactive';
}
