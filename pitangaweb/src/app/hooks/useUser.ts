import { useOutletContext } from "react-router-dom";

import type { User } from "@/types/school-class.types";

type ContextType = { user: User };

export function useUser() {
  const { user } = useOutletContext<ContextType>();

  const isTeacher = user.role === "TEACHER";

  return {
    user,
    isTeacher,
  };
}
