import { keycloak } from "../infra/data/keycloack";

export const AuthService = {
  getToken: async () => {
    if (!keycloak.authenticated) return null;
    await keycloak.updateToken(30); // garante token válido
    return keycloak.token;
  },
  login: () => keycloak.login(),
  logout: () => keycloak.logout(),
};
