import * as repo from '../repositories/school-class.repository';
import { CreateSchoolClassDTO, SchoolClassResponse, UpdateSchoolClassDTO } from '../types/schoolClass.types';

export const createSchoolClass = async (data: CreateSchoolClassDTO): Promise<SchoolClassResponse> => {
    try {
        return await repo.createSchoolClass(data);
    } catch (err: any) {
        throw new Error(`Failed to create school class: ${err.message}`);
    }
}

export const listSchoolClasses = async (): Promise<SchoolClassResponse[]> => {
    try {
        return await repo.findAllSchoolClasses();
    } catch (err: any) {
        throw new Error(`Failed to list school classes: ${err.message}`);
    }
}

export const getSchoolClass = async (id: string): Promise<SchoolClassResponse | null> => {
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
