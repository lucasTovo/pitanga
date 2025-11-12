
import { prisma } from '../shared/prisma-client';
import { CreateUserDTO, UpdateUserDTO, UserResponse } from '../types/user.types';

export const createUser = async (data: CreateUserDTO): Promise<UserResponse> => {
  return prisma.user.create({ data });
};

export const getUserById = async (id: string): Promise<UserResponse | null> => {
  return prisma.user.findUnique({
    where: { id },
    omit: { createdAt:true, updatedAt:true}
  });
};

export const getUserByEmail = async (email: string): Promise<UserResponse | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findAllUsers = async (): Promise<UserResponse[]> => {
  return prisma.user.findMany();
};

export const updateUser = async (id: string, data: Partial<UpdateUserDTO>): Promise<UserResponse> => {
  return prisma.user.update({
    where: { id },
    omit: { createdAt:true, updatedAt:true},
    data,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
