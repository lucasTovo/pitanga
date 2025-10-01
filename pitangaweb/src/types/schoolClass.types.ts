export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface SchoolClass {
  id: string;
  name: string;
  description: string | null;
  creator: {
    id: string;
    name: string;
  };
  students: string[];
  challenges: string[];
  count: {
    challenges: number;
    students: number;
  };
}
