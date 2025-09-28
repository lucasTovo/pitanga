import { StrictMode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ChallengesList } from "./app/pages/ChallengesList";
import { ChallengeEditor } from "./app/pages/ChallengeEditor";
import { CreateChallenge } from "./app/pages/CreateChallenge";
import { ErrorPage } from "./app/pages/ErrorPage";

import { getChallengeSolution, listChallenges } from "./infra/data/challenges.rest";
import { useAuth } from "./auth/hook/useAuth";

const basename = import.meta.env.BASE_URL ?? "/pitanga-tcc";

export const App = () => {
  const { initialized, isAuthenticated, login } = useAuth();

  if (!initialized) {
    return <div>Carregando Keycloak...</div>;
  }

  if (!isAuthenticated) {
    login();
    return <div>Redirecionando para login...</div>;
  }

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <ChallengesList />,
        loader: listChallenges,
        errorElement: <ErrorPage />,
      },
      {
        path: "/challenge/:challengeId",
        element: <ChallengeEditor />,
        loader: getChallengeSolution,
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-challenge",
        element: <CreateChallenge />,
      },
    ],
    { basename }
  );

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
