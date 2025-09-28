import { classesApi } from "./base";

export async function listSchoolClasses() {
    try {
        const response = await classesApi.get('/classes');
        return response.data;
    } catch (error) {
        console.error('Error listing school classes:', error);
    }
}

export async function getSchoolClass(id: string) {
    try {
        const response = await classesApi.get(`/classes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching school class:', error);
    }
}

export async function createSchoolClass(data: { name: string; description?: string }) {
    try {
        const schoolClass = await classesApi.post("/classes", data);
        return schoolClass.data;
    } catch (error) {
        console.error('Error creating school class:', error);
    }
}

export async function updateSchoolClass(id: string, data: { name?: string; description?: string }) {
  try {
      const response = await classesApi.put(`/classes/${id}`, data);
      return response.data;
  } catch (error) {
      console.error('Error updating school class:', error);
  }
}

export async function deleteSchoolClass(id: string) {
  try {
      const response = await classesApi.delete(`/classes/${id}`);
      return response.data;
  } catch (error) {
      console.error('Error deleting school class:', error);
  }
}

