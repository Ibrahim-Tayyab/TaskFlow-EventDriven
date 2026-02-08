export interface Task {
  id: string;
  description: string;
  completed: boolean;
  category: string;
  priority: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  due_date?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  next_occurrence?: string;
  notification_sent: boolean;
}

export interface TaskCreate {
  description: string;
  category?: string;
  priority?: string;
  tags?: string[];
  due_date?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
}

export interface TaskUpdate {
  description?: string;
  completed?: boolean;
  category?: string;
  priority?: string;
  tags?: string[];
  due_date?: string | null;
  is_recurring?: boolean;
  recurrence_pattern?: string | null;
}