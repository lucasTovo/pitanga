import { StrictMode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getChallengeSolution } from "./infra/data/challenges.rest";
import { getSchoolClass } from "./infra/data/shcool.rest";

import { useAuth } from "./hooks/useAuth";

import { Colors } from "./app/pages/Colors";
import { HomePage } from "./app/pages/HomePage";
import { ErrorPage } from "./app/pages/ErrorPage";
import { ChallengeEditor } from "./app/pages/ChallengeEditor";
import { SchoolClassPage } from "./app/pages/SchoolClassPage";
import { CreateSchoolClass } from "./app/pages/CreateSchoolClass";
import { RootLayout, rootLoader } from "./app/layouts/RootLayout";
import { CreateChallengePage } from "./app/pages/CreateChallengePage";

import { ThemeProvider } from "@/components/theme-provider";

const basename = import.meta.env.BASE_URL ?? "/pitanga-tcc";

// 🔹 Cria o cliente do React Query
const queryClient = new QueryClient();

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
        element: <RootLayout />,
        loader: rootLoader,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "/create-challenge",
            element: <CreateChallengePage />,
          },
          {
            path: "/challenges/:challengeId",
            element: <ChallengeEditor />,
            loader: getChallengeSolution,
          },
          {
            path: "/create-class",
            element: <CreateSchoolClass />,
          },
          {
            path: "/classes/:classId",
            element: <SchoolClassPage />,
            loader: getSchoolClass,
          },
          {
            path: "/colors-test",
            element: <Colors />,
          },
        ],
      },
    ],
    { basename }
  );

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};
