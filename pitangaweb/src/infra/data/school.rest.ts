import { SchoolClass, User } from "@/types/school-class.types";

import { classesApi } from "./base";

export async function listSchoolClasses() {
  const response = await classesApi.get<SchoolClass[]>('/classes');
  return response.data;
}

export async function getSchoolClassById(classId: string) {
  const response = await classesApi.get<SchoolClass>(`/classes/${classId}`);
  return response.data;
}

export async function createSchoolClass(data: { name: string; description?: string }) {
  try {
    const schoolClass = await classesApi.post<SchoolClass>("/classes", data);
    return schoolClass.data;
  } catch (error) {
    console.error('Error creating school class:', error);
  }
}

export async function addStudentToSchoolClass(schoolClassId: string, studentId: string) {
  const response = await classesApi.post<SchoolClass>(`/classes/${schoolClassId}/students`, {
    studentId,
  });
  return response.data;
}

export async function addChallengeToSchoolClass(schoolClassId: string, challengeId: string) {
  const response = await classesApi.post<SchoolClass>(`/classes/${schoolClassId}/challenges`, {
    challengeId,
  });
  return response.data;
}

export async function updateSchoolClass(id: string, data: { name?: string; description?: string }) {
  try {
    const response = await classesApi.put<SchoolClass>(`/classes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating school class:', error);
  }
}

export async function deleteSchoolClass(id: string) {
  try {
    const response = await classesApi.delete<SchoolClass>(`/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting school class:', error);
  }
}

export async function removeChallengeFromAllClasses(id: string) {
  try {
    await classesApi.delete(`/classes/challenges/${id}`);
  } catch (error) {
    console.error(`Error deleting challenge ${id} from classes:`, error);
  }
}

export async function removeChallengeFromClass(schoolClassId: string, challengeId: string) {
  try {
    await classesApi.delete(`/classes/${schoolClassId}/challenges/${challengeId}`);
  } catch (error) {
    console.error(`Error deleting challenge ${challengeId} from class ${schoolClassId}:`, error);
  }
}

// ---------------------- USERS ----------------------

export async function listUsers() {
  const response = await classesApi.get<User[]>("/users");
  return response.data;
}

export async function getLoggedUser() {
  try {
    const response = await classesApi.get<User>(`/users/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUser(id: string) {
  const response = await classesApi.get<User>(`/users/${id}`);
  return response.data;
}

export async function updateUser() {
  try {
    const response = await classesApi.put<User>('/users');
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}
