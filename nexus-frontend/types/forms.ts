/**
 * Form input validation types
 */

import { ProjectStatus, TaskStatus, TaskPriority } from './models';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
}
