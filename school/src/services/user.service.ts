import * as userRepo from "../repositories/user.repository";
import { CreateUserDTO, UpdateUserDTO, UserResponse } from "../types/user.types";

export const createUser = async (data: CreateUserDTO): Promise<UserResponse> => {
  try {
    return userRepo.createUser(data);
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
};

export const getLoggedUser = async (id: string): Promise<UserResponse | null> => {
  try {
    const user = await userRepo.getUserById(id);
    return user;
  } catch (err: any) {
    throw new Error(`Failed to get logged user: ${err.message}`);
  }
};

export const getUser = async (id: string): Promise<UserResponse | null> => {
  try {
    const user = await userRepo.getUserById(id);
    return user;
  } catch (err: any) {
    throw new Error(`Failed to get user: ${err.message}`);
  }
};

export const listUsers = async (): Promise<UserResponse[]> => {
  try {
    return userRepo.findAllUsers();
  } catch (err: any) {
    throw new Error(`Failed to list users: ${err.message}`);
  }
};

export const updateUser = async (id: string, data: UpdateUserDTO) => {
  try {
    const userExists = await userRepo.getUserById(id);

    if (userExists) {
      await userRepo.updateUser(id, data);
    } else {
      await userRepo.createUser({ id, ...data } as CreateUserDTO);
    }

  } catch (err: any) {
    throw new Error(`Failed to update user: ${err.message}`);
  }
}

export const deleteUser = async (id: string) => {
  try {
    return userRepo.deleteUser(id);
  } catch (err: any) {
    throw new Error(`Failed to delete user: ${err.message}`);
  }
};
