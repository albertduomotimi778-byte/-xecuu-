export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface AIError {
  message: string;
}

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}