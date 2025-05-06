"use client";

import { useClient } from "@/hooks/useClient";
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

interface AppNavbarLinkProps {
  text: string;
  icon?: React.ReactNode;
  to: string;
  children?: React.ReactNode;
  exact?: boolean;
  onClick?: () => void;
}

const AppNavLink: FC<AppNavbarLinkProps> = ({
  text,
  icon,
  to,
  children,
  exact,
  onClick,
}) => {
  const pathname = usePathname();
  const client = useClient();

  const isActive = exact ? pathname === to : pathname.startsWith(to);

  return (
    <NavLink
      component={isActive ? undefined : Link}
      href={(isActive ? undefined : to) as string}
      onClick={isActive ? onClick : undefined}
      sx={{ borderRadius: ".2rem", transition: ".2s" }}
      leftSection={icon}
      label={text}
      active={exact ? pathname === to : pathname.startsWith(to)}
      defaultOpened={pathname.startsWith(to)}
    >
      {children}
    </NavLink>
  );
};

export default AppNavLink;
