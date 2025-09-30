import { Request, Response, NextFunction } from 'express';
import * as service from '../services/school-class.service';
import { CreateSchoolClassDTO } from '../types/schoolClass.types';

export async function createSchoolClass(req: Request, res: Response, next: NextFunction) {
  try {
    const dto: CreateSchoolClassDTO = { ...req.body, creatorId: req.user?.sub! };
    const result = await service.createSchoolClass(dto);
    res.status(201).json(result);
  } catch (err: any) {
    next(err);
  }
};

export async function listSchoolClasses(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.listSchoolClasses();
    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export async function getSchoolClass(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.getSchoolClass(req.params.id);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export async function updateSchoolClass(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.updateSchoolClass(req.params.id, req.body);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export async function deleteSchoolClass(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteSchoolClass(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    next(err);
  }
};
