export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  important: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export type FilterType = 'all' | 'today' | 'important' | 'completed';

export interface AppState {
  tasks: Task[];
  filter: FilterType;
  searchQuery: string;
}
