"use client";

import { AppShell, Box, Burger, Group } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import React, { FC } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

interface AppLayoutProps {
  children: React.ReactNode;
  navigation: React.ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children, navigation }) => {
  const [opened, { toggle }] = useDisclosure();
  const hideHeader = useMediaQuery("(min-width: 768px)");

  return (
    <AppShell
      header={{
        height: { base: 60, md: 70, lg: 80 },
        collapsed: hideHeader,
      }}
      navbar={{
        width: { base: 200, md: 300 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

          <Box sx={{ flexGrow: 1 }}>Studentská rada</Box>

          <ThemeSwitcher />
        </Group>
      </AppShell.Header>

      {navigation}

      <AppShell.Main sx={{ display: "flex", flexDirection: "column" }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
