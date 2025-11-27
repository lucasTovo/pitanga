import { ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { initialized, isAuthenticated, login } = useAuth();

  if (!initialized) {
    return <div>Carregando autenticação...</div>;
  }

  if (!isAuthenticated) {
    login();
    return <div>Redirecionando para login...</div>;
  }

  return <>{children}</>;
};
