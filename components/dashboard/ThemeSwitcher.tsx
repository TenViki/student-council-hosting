"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useClient } from "@/hooks/useClient";

const ThemeSwitcher = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const client = useClient();

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
      variant="default"
      size="md"
      p={4}
      aria-label="Toggle color scheme"
    >
      <Sun
        style={{
          display: client && colorScheme === "light" ? "none" : undefined,
        }}
      />
      <Moon
        style={{
          display: client && colorScheme === "dark" ? "none" : undefined,
        }}
      />
    </ActionIcon>
  );
};

export default ThemeSwitcher;
