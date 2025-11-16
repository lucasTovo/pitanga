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

export async function addStudentToSchoolClass(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolClassId = req.params.id;
    const { studentId }: { studentId: string } = req.body;
    const result = await service.addStudentToSchoolClass(schoolClassId, studentId);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
}

export async function addChallengeToSchoolClass(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolClassId = req.params.id;
    const { challengeId }: { challengeId: string } = req.body;
    const result = await service.addChallengeToSchoolClass(schoolClassId, challengeId);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
}

export async function listSchoolClasses(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const result = await service.listSchoolClasses(user);
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

export async function updateChallengesSchoolClass(req: Request, res: Response, next: NextFunction) {
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
