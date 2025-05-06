"use client";

import AppNavbar from "&/dashboard/AppNavbar";
import NavUser from "&/dashboard/NavUser";
import React from "react";
import { useCouncil } from "./CouncilProvider";
import AppNavLink from "&/dashboard/AppNavLink";
import {
  LucideContainer,
  LucideDatabase,
  LucideLayoutGrid,
  LucideServer,
} from "lucide-react";
import { DockerContainer } from "@prisma/client";

const CouncilNav = () => {
  const council = useCouncil();

  const getContainerIcon = (container: DockerContainer) => {
    if (container.isWebsite) return <LucideServer size="1rem" />;
    if (container.isDatabase) return <LucideDatabase size="1rem" />;
    return <LucideContainer size="1rem" />;
  };

  return (
    <AppNavbar title={council.name} footer={<NavUser />}>
      <AppNavLink
        text="Přehled"
        icon={<LucideLayoutGrid size="1rem" />}
        to="/app"
        exact
      />

      {council.containers.length > 0 && (
        <AppNavLink
          text="Kontejnery"
          icon={<LucideContainer size="1rem" />}
          to="/app/containers"
          exact
        >
          {council.containers.map((container) => (
            <AppNavLink
              key={container.id}
              text={container.name}
              icon={getContainerIcon(container)}
              to={`/app/containers/${container.id}`}
            />
          ))}
        </AppNavLink>
      )}
    </AppNavbar>
  );
};

export default CouncilNav;
