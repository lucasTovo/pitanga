
import { useKeycloak } from "@react-keycloak/web";

export function useAuth() {
  const { keycloak, initialized } = useKeycloak();

  return {
    initialized,
    isAuthenticated: keycloak.authenticated,
    userName: keycloak.tokenParsed?.preferred_username,
    userId: keycloak.tokenParsed?.sub,
    roles: keycloak.tokenParsed?.realm_access?.roles || [],
    token: keycloak.token,
    logout: () => keycloak.logout(),
    login: () => keycloak.login(),
  };
}

export function getToken() {
  const { keycloak } = useKeycloak();
  return keycloak.token;
}