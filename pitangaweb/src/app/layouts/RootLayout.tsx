import { Outlet, useLoaderData } from "react-router-dom";
import type { User } from "@/types/school-class.types";
import { getLoggedUser } from "@/infra/data/school.rest";

type ContextType = { user: User };

export async function rootLoader() {
  const user = await getLoggedUser();
  return user;
}

export const RootLayout = () => {
  const user = useLoaderData() as User;

  return (
    <main>
      <Outlet context={{ user } satisfies ContextType} />
    </main>
  );
};
