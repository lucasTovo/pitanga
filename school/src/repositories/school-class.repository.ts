
import { prisma } from '../shared/prisma-client';
import { SchoolClass } from '@prisma/client';

export async function createSchoolClass(data: Omit<SchoolClass, 'id' | 'createdAt' | 'updatedAt'>) {
return prisma.schoolClass.create({ data });
}

export async function findAllSchoolClasses() {
return prisma.schoolClass.findMany();
}

export async function findSchoolClassById(id: string) {
return prisma.schoolClass.findUnique({ where: { id } });
}

export async function updateSchoolClass(id: string, data: Partial<SchoolClass>) {
return prisma.schoolClass.update({ where: { id }, data });
}

export async function deleteSchoolClass(id: string) {
return prisma.schoolClass.delete({ where: { id } });
}
