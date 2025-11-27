import { StrictMode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/app/theme/ThemeProvider";
import { BaseLayout } from "@/app/layouts/BaseLayout";
import { RootLayout, rootLoader } from "@/app/layouts/RootLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import { Colors } from "@/app/pages/Colors";
import { HomePage } from "@/app/pages/HomePage";
import { ErrorPage } from "@/app/pages/ErrorPage";
import { SchoolClassPage } from "@/app/pages/SchoolClassPage";
import { EditChallengePage } from "@/app/pages/EditChallengePage";
import { CreateChallengePage } from "@/app/pages/CreateChallengePage";
import { ChallengeEditorPage } from "@/app/pages/ChallengeEditorPage";

const basename = import.meta.env.BASE_URL ?? "/pitanga-tcc";

// 🔹 React Query
const queryClient = new QueryClient();

export const App = () => {
  const router = createBrowserRouter(
    [
      {
        element: <BaseLayout />,
        children: [
          // 🔓 ROTA PÚBLICA
          {
            path: "/challenges/public/:challengeId",
            element: <ChallengeEditorPage readOnly />,
          },

          // 🔐 ROTAS PROTEGIDAS
          {
            path: "/",
            element: (
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            ),
            loader: rootLoader,
            errorElement: <ErrorPage />,
            children: [
              {
                index: true,
                element: <HomePage />,
              },
              {
                path: "/challenges/create",
                element: <CreateChallengePage />,
              },
              {
                path: "/challenges/:challengeId",
                element: <ChallengeEditorPage />,
              },
              {
                path: "/challenges/:id/edit",
                element: <EditChallengePage />,
              },
              {
                path: "/classes/:classId",
                element: <SchoolClassPage />,
              },
              {
                path: "/colors-test",
                element: <Colors />,
              },
            ],
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
