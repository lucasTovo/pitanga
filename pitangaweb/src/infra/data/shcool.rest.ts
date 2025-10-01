import { SchoolClass, User } from "@/types/schoolClass.types";
import { classesApi } from "./base";
import { Params } from "react-router-dom";

export async function listSchoolClasses() {
  try {
    const response = await classesApi.get<SchoolClass[]>('/classes');
    return response.data;
  } catch (error) {
    console.error('Error listing school classes:', error);
    return [];
  }
}

export async function getSchoolClass({ params }: { params: Params }) {
  try {
    const response = await classesApi.get<SchoolClass>(`/classes/${params.classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching school class:', error);
    return null;
  }
}

export async function createSchoolClass(data: { name: string; description?: string }) {
  try {
    const schoolClass = await classesApi.post<SchoolClass>("/classes", data);
    return schoolClass.data;
  } catch (error) {
    console.error('Error creating school class:', error);
  }
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

// ---------------------- USERS ----------------------

export async function listUsers() {
  try {
    const response = await classesApi.get<User>("/users");
    return response.data;
  } catch (error) {
    console.error("Error listing users:", error);
    return [];
  }
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
  try {
    const response = await classesApi.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updateUser() {
  try {
    const response = await classesApi.put<User>('/users');
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}
