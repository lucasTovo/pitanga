// Payload para criar turma
export interface CreateSchoolClassDTO {
  name: string;
  description?: string;
  creatorId: string;
}

// Payload para atualizar turma
export interface UpdateSchoolClassDTO {
  name?: string;
  description?: string;
}

// Resposta de turma
export interface SchoolClassResponse {
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
