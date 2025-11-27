import { Outlet } from "react-router-dom";

export const BaseLayout = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Outlet />
    </main>
  );
};
