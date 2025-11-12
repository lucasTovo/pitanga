
import { useKeycloak } from "@react-keycloak/web";

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  return {
    initialized,
    isAuthenticated: keycloak.authenticated,
    userId: keycloak.tokenParsed?.sub,
    userName: keycloak.tokenParsed?.name,
    userEmail: keycloak.tokenParsed?.email,
    userPreferredUsername: keycloak.tokenParsed?.preferred_username,
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
