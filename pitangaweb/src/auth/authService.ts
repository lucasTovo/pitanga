import { keycloak } from "../infra/data/keycloak";

export const AuthService = {
  getToken: async () => {
    if (!keycloak.authenticated) return null;
    try {
      await keycloak.updateToken(30);
      return keycloak.token;
    } catch (err) {
      console.error("Erro ao atualizar token:", err);
      keycloak.logout();
      return null;
    }
  },
  login: () => keycloak.login(),
  logout: () => keycloak.logout(),
};
