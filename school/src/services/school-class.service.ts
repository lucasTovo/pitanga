import { AuthUser } from '../middlewares/auth.middleware';
import * as repo from '../repositories/school-class.repository';
import { CreateSchoolClassDTO, SchoolClassResponse, UpdateSchoolClassDTO } from '../types/schoolClass.types';

export const createSchoolClass = async (data: CreateSchoolClassDTO): Promise<SchoolClassResponse> => {
    try {
        return await repo.createSchoolClass(data);
    } catch (err: any) {
        throw new Error(`Failed to create school class: ${err.message}`);
    }
}

export const addStudentToSchoolClass = async (schoolClassId: string, studentId: string) => {
  try {
    return await repo.addStudentToSchoolClass(schoolClassId, studentId);
  } catch (err: any) {
    throw new Error(`Failed to add student to school class: ${err.message}`);
  }
};

export const addChallengeToSchoolClass = async (schoolClassId: string, challengeId: string) => {
  try {
    return await repo.addChallengeToSchoolClass(schoolClassId, challengeId);
  } catch (err: any) {
    throw new Error(`Failed to add challenge to school class: ${err.message}`);
  }
};

export const listSchoolClasses = async (user: AuthUser): Promise<SchoolClassResponse[]> => {
    try {
        return await repo.findAllSchoolClasses(user);
    } catch (err: any) {
        throw new Error(`Failed to list school classes: ${err.message}`);
    }
}

export const getSchoolClassById = async (id: string): Promise<SchoolClassResponse | null> => {
    try {
        return await repo.findSchoolClassById(id);
    } catch (err: any) {
        throw new Error(`Failed to get school class: ${err.message}`);
    }
}

export const updateSchoolClass = async (id: string, data: Partial<UpdateSchoolClassDTO>): Promise<SchoolClassResponse> => {
    try {
        return await repo.updateSchoolClass(id, data);
    } catch (err: any) {
        throw new Error(`Failed to update school class: ${err.message}`);
    }
}

export const deleteSchoolClass = async (id: string): Promise<void> => {
    try {
        await repo.deleteSchoolClass(id);
    } catch (err: any) {
        throw new Error(`Failed to delete school class: ${err.message}`);
    }
}

export const removeChallengeFromAllClasses = async (
  user: AuthUser,
  challengeId: string
) => {
  const classes = await repo.findAllSchoolClasses(user);

  for (const schoolClass of classes) {
    if (schoolClass.challenges.includes(challengeId)) {
      await repo.removeChallengeRelation(schoolClass.id, challengeId);
    }
  }
};

export const removeChallengeFromSchoolClass = async (
  schoolClassId: string,
  challengeId: string
) => {
  try {
    return await repo.removeChallengeFromSpecificClass(schoolClassId, challengeId);
  } catch (err: any) {
    throw new Error(`Failed to remove challenge from school class: ${err.message}`);
  }
};

