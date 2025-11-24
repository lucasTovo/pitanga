import { Router } from 'express';

import * as controller from '../controllers/school-class.controller';

export const schoolClassRouter = Router();

schoolClassRouter.post('/', controller.createSchoolClass);
schoolClassRouter.post('/:id/students', controller.addStudentToSchoolClass);
schoolClassRouter.post('/:id/challenges', controller.addChallengeToSchoolClass);
schoolClassRouter.get('/', controller.listSchoolClasses);
schoolClassRouter.get('/:id', controller.getSchoolClassById);
schoolClassRouter.put('/:id', controller.updateSchoolClass);
schoolClassRouter.delete('/:id', controller.deleteSchoolClass);
schoolClassRouter.delete('/challenges/:challengeId', controller.removeChallengeFromAllClasses);
