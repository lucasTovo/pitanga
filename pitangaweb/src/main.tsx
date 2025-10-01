import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";

import "./main.css";

import { App } from "./App";
import { updateUser } from "./infra/data/shcool.rest";
import { keycloak, initOptions } from "./infra/data/keycloack";

const root = document.getElementById("root")!;

const onAuthSuccess = (event: string) => {
  if (event === 'onAuthSuccess') {
    updateUser();
  }
}

ReactDOM.createRoot(root).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions} onEvent={onAuthSuccess}>
    <App />
  </ReactKeycloakProvider>
);
