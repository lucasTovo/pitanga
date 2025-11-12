import { SchoolClass } from '@prisma/client';

import { prisma } from '../shared/prisma-client';
import { CreateSchoolClassDTO, SchoolClassResponse } from '../types/schoolClass.types';

function mapToSchoolClassResponse(raw: any): SchoolClassResponse {
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        creator: raw.creator,
        students: raw.students.map((s: any) => s.userId),
        challenges: raw.challenges.map((c: any) => c.challengeId),
        count: {
            students: raw._count.students,
            challenges: raw._count.challenges,
        }
    };
}

const schoolClassSelect = {
    id: true,
    name: true,
    description: true,
    creator: {
        select: {
            id: true,
            name: true,
        }
    },
    students: {
        select: { userId: true },
    },
    challenges: {
        select: { challengeId: true },
    },
    _count: {
        select: {
            students: true,
            challenges: true,
        }
    }
}

export async function createSchoolClass(data: CreateSchoolClassDTO): Promise<SchoolClassResponse> {
    const result = await prisma.schoolClass.create({
        data,
        select: schoolClassSelect,
    });

    return mapToSchoolClassResponse(result);
}

export async function addStudentToSchoolClass(schoolClassId: string, studentId: string) {
  await prisma.schoolClassUser.create({
    data: { schoolClassId, userId: studentId },
  });

  const updated = await prisma.schoolClass.findUnique({
    where: { id: schoolClassId },
    select: schoolClassSelect,
  });

  if (!updated) throw new Error('School class not found');
  return mapToSchoolClassResponse(updated);
}

export async function addChallengeToSchoolClass(schoolClassId: string, challengeId: string) {
  await prisma.schoolClassChallenge.create({
    data: { schoolClassId, challengeId },
  });

  const updated = await prisma.schoolClass.findUnique({
    where: { id: schoolClassId },
    select: schoolClassSelect,
  });

  if (!updated) throw new Error('School class not found');
  return mapToSchoolClassResponse(updated);
}

export async function findAllSchoolClasses(): Promise<SchoolClassResponse[]> {
    const result = await prisma.schoolClass.findMany({
        select: schoolClassSelect,
    });

    return result.map(r => mapToSchoolClassResponse(r));
}

export async function findSchoolClassById(id: string): Promise<SchoolClassResponse | null> {
    const result = await prisma.schoolClass.findUnique({
        where: { id },
        select: schoolClassSelect,
    });
    if (!result) return null;

    return mapToSchoolClassResponse(result);
}

export async function updateSchoolClass(id: string, data: Partial<SchoolClass>): Promise<SchoolClassResponse> {
    const result = await prisma.schoolClass.update({
        where: { id },
        data,
        select: schoolClassSelect
    });

    return mapToSchoolClassResponse(result);
}

export async function deleteSchoolClass(id: string) {
    return await prisma.schoolClass.delete({ where: { id } });
}
