export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface UserDto {
  id: number;
  username: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: Priority | string;
  status: Status | string;
  projectId?: number;
  assignedUser?: UserDto;
  createdBy?: UserDto;
}

export interface CreateTaskRequest {
  name: string;
  description: string;
  priority: Priority;
  assignedProjectMemberId: number;
}
