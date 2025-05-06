import AppNavbar from "&/dashboard/AppNavbar";
import AppNavLink from "&/dashboard/AppNavLink";
import NavUser from "&/dashboard/NavUser";
import ThemeSwitcher from "&/dashboard/ThemeSwitcher";
import { getAuth } from "@/lib/auth/dal";
import {
  AppShellNavbar,
  AppShellSection,
  Box,
  Group,
  NavLink,
  Text,
  Title,
} from "@mantine/core";
import { LucideLayoutGrid } from "lucide-react";
import Link from "next/link";
import React from "react";

const AdminNavbar = async () => {
  const { user } = await getAuth();

  return (
    <AppNavbar title="Studentské Rady ČR" footer={<NavUser />}>
      <AppNavLink
        text="Přehled"
        icon={<LucideLayoutGrid size="1rem" />}
        to="/admin"
        exact
      />
    </AppNavbar>
  );
};

export default AdminNavbar;
