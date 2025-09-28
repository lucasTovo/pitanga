import { Router } from 'express';
import * as controller from '../controllers/school-class.controller';

export const schoolClassRouter = Router();

schoolClassRouter.post('/', controller.createSchoolClass);
schoolClassRouter.get('/', controller.listSchoolClasses);
schoolClassRouter.get('/:id', controller.getSchoolClass);
schoolClassRouter.put('/:id', controller.updateSchoolClass);
schoolClassRouter.delete('/:id', controller.deleteSchoolClass);
