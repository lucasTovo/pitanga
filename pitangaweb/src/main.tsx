import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { App } from "./App";
import { keycloak, initOptions } from "./infra/data/keycloack";
import "./main.css";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
    <App />
  </ReactKeycloakProvider>
);
