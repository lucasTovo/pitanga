import { StrictMode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ChallengeEditor } from "./app/pages/ChallengeEditor";
import { CreateChallenge } from "./app/pages/CreateChallenge";
import { ErrorPage } from "./app/pages/ErrorPage";

import SchoolClass from "./app/pages/SchoolClass";
import { useAuth } from "./auth/hook/useAuth";
import { HomePage } from "./app/pages/HomePage";
import { CreateSchoolClass } from "./app/pages/CreateSchoolClass";
import { getChallengeSolution } from "./infra/data/challenges.rest";
import { getLoggedUser, getSchoolClass } from "./infra/data/shcool.rest";

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
        element: <HomePage />,
        loader: getLoggedUser,
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-challenge",
        element: <CreateChallenge />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/challenges/:challengeId",
        element: <ChallengeEditor />,
        loader: getChallengeSolution,
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-class",
        element: <CreateSchoolClass />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/classes/:classId",
        element: <SchoolClass />,
        loader: getSchoolClass,
        errorElement: <ErrorPage />,
      }
    ],
    { basename }
  );

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
