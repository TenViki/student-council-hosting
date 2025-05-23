import AppLayout from "&/dashboard/AppLayout";
import { AppShellNavbar } from "@mantine/core";
import React, { FC } from "react";
import AdminNavbar from "./AdminNavbar";
import { getAuth } from "@/lib/auth/dal";

interface LayoutProps {
  children: React.ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  const { user } = await getAuth(true);
  if (!user?.admin) {
    return (
      <div>Přístup odepřen. Nemáte oprávnění k zobrazení této stránky.</div>
    );
  }

  return <AppLayout navigation={<AdminNavbar />}>{children}</AppLayout>;
};

export default layout;
