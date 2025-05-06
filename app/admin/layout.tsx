import AppLayout from "&/dashboard/AppLayout";
import { AppShellNavbar } from "@mantine/core";
import React, { FC } from "react";
import AdminNavbar from "./AdminNavbar";
import { getAuth } from "@/lib/auth/dal";

interface LayoutProps {
  children: React.ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  await getAuth(true);
  return <AppLayout navigation={<AdminNavbar />}>{children}</AppLayout>;
};

export default layout;
