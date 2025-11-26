import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";

import { useAuth } from "@/hooks/useAuth";

import { updateUser } from "@/infra/data/school.rest";
import { keycloak, initOptions } from "@/infra/data/keycloack";

import { App } from "@/App";
import "./main.css";

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
  }, [initialized]);

  if (!ready) {
    return <div>Carregando aplicação...</div>;
  }

  return <App />;
}

ReactDOM.createRoot(root).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
    <AppInitializer />
  </ReactKeycloakProvider>
);
