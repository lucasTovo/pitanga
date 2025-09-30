import { UserRole } from "@prisma/client";

// Payload para criar usuário
export interface CreateUserDTO {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
}

// Payload para atualizar usuário
export interface UpdateUserDTO {
    name?: string;
    email?: string;
    role?: UserRole;
}

// Resposta básica de usuário
export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}
