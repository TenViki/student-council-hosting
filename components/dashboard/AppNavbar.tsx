"use client";

import { AppShellNavbar, AppShellSection, Box, Title } from "@mantine/core";
import React, { FC } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { Group } from "@mantine/core";

interface AppNavbarProps {
  children: React.ReactNode;
  title: string;
  footer: React.ReactNode;
}

const AppNavbar: FC<AppNavbarProps> = ({ children, title, footer }) => {
  return (
    <AppShellNavbar
      p="md"
      sx={(theme, u) => ({
        [u.dark]: {
          backgroundColor: "var(--mantine-color-dark-8)",
        },
        [u.light]: {
          backgroundColor: "var(--mantine-color-gray-1)",
        },
      })}
    >
      <AppShellSection pb="md">
        <Group>
          <Box style={{ flexGrow: 1 }}>
            <Title order={1} size="xl">
              {title}
            </Title>
          </Box>
          <ThemeSwitcher />
        </Group>
      </AppShellSection>

      <AppShellSection grow>{children}</AppShellSection>

      <AppShellSection>{footer}</AppShellSection>
    </AppShellNavbar>
  );
};

export default AppNavbar;
