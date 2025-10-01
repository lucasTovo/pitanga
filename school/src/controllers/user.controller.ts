import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";

import * as userService from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.types";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CreateUserDTO = {
      id: req.user.sub,
      name: req.user.name,
      email: req.user.email,
      role: req.user.realm_access.roles.includes(UserRole.TEACHER.toLowerCase()) ? UserRole.TEACHER : UserRole.STUDENT
    };

    const user = await userService.createUser(dto);

    res.status(201).json(user);
  } catch (err: any) {
    next(err);
  }
};

export const getLoggedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getLoggedUser(req.user.sub);
    res.json(user);
  } catch (err: any) {
    next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.json(user);
  } catch (err: any) {
    next(err);
  }
};

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err: any) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userBody: UpdateUserDTO = {
      name: req.user.name,
      email: req.user.email,
      role: req.user.realm_access.roles.includes(UserRole.TEACHER.toLowerCase()) ? UserRole.TEACHER : UserRole.STUDENT
    };

    const user = await userService.updateUser(req.user.sub, userBody);

    res.json(user);
  } catch (err: any) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    next(err);
  }
};
