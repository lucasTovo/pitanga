import * as repo from '../repositories/school-class.repository';

export const createSchoolClass = (data: { name: string; description: string, creatorId: string }) => {
    return repo.createSchoolClass(data);
}

export const listSchoolClasses = () => {
    return repo.findAllSchoolClasses();
}

export const getSchoolClass = (id: string) => {
    return repo.findSchoolClassById(id);
}

export const updateSchoolClass = (id: string, data: { name?: string; description?: string }) => {
    return repo.updateSchoolClass(id, data);
}

export const deleteSchoolClass = (id: string) => {
    return repo.deleteSchoolClass(id);
}
