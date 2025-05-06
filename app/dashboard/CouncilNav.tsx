"use client";

import AppNavbar from "&/dashboard/AppNavbar";
import NavUser from "&/dashboard/NavUser";
import React from "react";
import { useCouncil } from "./CouncilProvider";
import AppNavLink from "&/dashboard/AppNavLink";
import { LucideContainer, LucideLayoutGrid } from "lucide-react";

const CouncilNav = () => {
  const council = useCouncil();

  return (
    <AppNavbar title={council.name} footer={<NavUser />}>
      <AppNavLink
        text="Přehled"
        icon={<LucideLayoutGrid size="1rem" />}
        to="/dashboard"
        exact
      />

      <AppNavLink
        text="Kontejnery"
        icon={<LucideContainer size="1rem" />}
        to="/admin/councils"
        exact
      />
    </AppNavbar>
  );
};

export default CouncilNav;
