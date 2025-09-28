import Keycloak from 'keycloak-js';

// -------------------------------
// Instância global do Keycloak
// -------------------------------
export const keycloak = new Keycloak({
  url: "https://localhost:8444/", // URL do Keycloak
  realm: "pitanga",               // Realm
  clientId: "pitanga-client",     // Client ID
});

export const initOptions = {
    onLoad: 'check-sso',
    pkceMethod: 'S256',       // recomendado para SPAs
    checkLoginIframe: true,   // verifica token periodicamente
};