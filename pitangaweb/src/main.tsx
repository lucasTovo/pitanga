import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";

import "./main.css";

import { App } from "./App";
import { updateUser } from "./infra/data/school.rest";
import { keycloak, initOptions } from "./infra/data/keycloack";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useState } from "react";

const root = document.getElementById("root")!;

function AppInitializer() {
  const { initialized } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    const syncUser = async () => {
      if (keycloak.authenticated) {
        await updateUser();
      }
      setReady(true);
    };

    syncUser();
  }, [initialized, keycloak.authenticated]);

  if (!ready) {
    return <div>Carregando...</div>;
  }

  return <App />;
}

ReactDOM.createRoot(root).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
    <AppInitializer />
  </ReactKeycloakProvider>
);
