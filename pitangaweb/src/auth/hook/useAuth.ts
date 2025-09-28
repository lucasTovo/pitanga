
import { useKeycloak } from "@react-keycloak/web";

export const useAuth = () => {
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

export const getToken = () => {
  const { keycloak } = useKeycloak();
  return keycloak.token;
}