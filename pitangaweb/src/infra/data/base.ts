import axios from 'axios';
import { restConfig } from '../../app/config/rest.config';
import { AuthService } from '../../auth/authService';

function createApi(baseURL: string) {
  const api = axios.create({
    baseURL,
    timeout: 30000,
    validateStatus: (status) => [200, 201, 404].includes(status),
    withCredentials: true,
  });

  api.interceptors.request.use(async (config) => {
    const token = await AuthService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return api;
}

export const challengesApi = createApi(restConfig.challengesBaseURL);   // para challenges
export const classesApi = createApi(restConfig.classesBaseURL);   // para schoolClasses
