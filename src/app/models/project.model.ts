export interface ProjectSummary {
  projectId: number;
  projectName: string;
  projectDescription: string;
  role: string;
}

export interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  creator: {
    id: number;
    username: string;
    email: string;
  };
  members: {
    id: number;
    role: Role;
    user: {
      id: number;
      username: string;
      email: string;
    };
  }[];
  tasks: {
    id: number;
    name: string;
    description: string;
    priority: string;
    status: string;
    assignedUser?: {
      id: number;
      username: string;
    };
  }[];
}

export interface NewProject {
  name: string;
  description: string;
}

export interface UpdateProject {
  name?: string;
  description?: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VISITOR = 'VISITOR',
}
export interface AddMember {
  userId: number;
  role: Role;
  projectId: number;
  projectAdminId: number;
}

export interface ProjectMember {
  id: number;
  role: Role;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
