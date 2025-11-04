import { Outlet, useLoaderData, useOutletContext } from 'react-router-dom';

import { User } from '@/types/schoolClass.types';

import { getLoggedUser } from '@/infra/data/shcool.rest';

type ContextType = { user: User };

export async function rootLoader() {
  const user = await getLoggedUser()
  return user
}

export const RootLayout = () => {
  const user = useLoaderData() as User;

  return (
    <main
      className="mx-auto w-full max-w-7xl"
    >
      <Outlet context={{ user } satisfies ContextType} />
    </main>
  );
};

export function useUser() {
  return useOutletContext<ContextType>();
}
