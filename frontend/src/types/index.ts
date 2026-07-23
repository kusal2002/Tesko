export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId?: number | null;
}

export interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface TaskFilterParams {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: "newest" | "oldest" | "dueDate";
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: string;
}
