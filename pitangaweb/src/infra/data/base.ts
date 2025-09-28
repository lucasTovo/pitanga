import axios from 'axios';
import { restConfig } from '../../app/config/rest.config';
import { AuthService } from '../../auth/authService';


const apiBase = axios.create({
  baseURL: restConfig.baseURL,
  timeout: 30000,
  validateStatus: (status) => [200, 404].includes(status),
  withCredentials: true,
});

// Interceptor de requisição
apiBase.interceptors.request.use(async (config) => {
  const token = await AuthService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { apiBase };
