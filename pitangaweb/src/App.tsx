import { StrictMode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { getChallengeSolution } from './infra/data/challenges.rest';
import { getLoggedUser, getSchoolClass } from './infra/data/shcool.rest';

import { ThemeProvider } from '@/components/theme-provider';
import { useAuth } from './auth/hook/useAuth';
import { HomePage } from './app/pages/HomePage';
import { Colors } from './app/pages/Colors';
import { ErrorPage } from './app/pages/ErrorPage';
import { CreateChallenge } from './app/pages/CreateChallenge';
import { CreateSchoolClass } from './app/pages/CreateSchoolClass';
import { ChallengeEditor } from './app/pages/ChallengeEditor';
import SchoolClass from './app/pages/SchoolClass';

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
      },
      {
        path: "/colors-test",
        element: <Colors />,
      }
    ],
    { basename }
  );

  return (
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  );
}
