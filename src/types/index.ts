export interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  experience: string;
  education: string;
  careerGoals: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: string;
  growth: string;
  demandLevel: 'High' | 'Medium' | 'Low';
}

export interface JobMarketTrend {
  role: string;
  demand: number;
  averageSalary: number;
  growth: number;
}

export interface LearningResource {
  title: string;
  type: 'Course' | 'Certification' | 'Book' | 'Video';
  provider: string;
  duration: string;
  url: string;
  rating: number;
}

export interface Roadmap {
  phase: string;
  duration: string;
  skills: string[];
  resources: LearningResource[];
  milestones: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}