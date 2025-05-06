"use client";

import { useUser } from "@/providers/UserProvider";
import { ActionIcon, Group, Text } from "@mantine/core";
import { LucideLogOut } from "lucide-react";
import { modals } from "@mantine/modals";
import React from "react";
import { logoutUser } from "@/actions/auth";

const NavUser = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const askLogout = () => {
    modals.openConfirmModal({
      title: "Odhlásit se",
      children: "Opravdu se chcete odhlásit z tohotoho zařízení?",
      onConfirm: () => {
        logoutUser();
      },
      confirmProps: { color: "red", children: "Odhlásit se" },
    });
  };

  return (
    <Group>
      <Text sx={{ flexGrow: 1 }}>{user.name}</Text>

      <ActionIcon color="red" variant="subtle" onClick={askLogout}>
        <LucideLogOut size="1rem" />
      </ActionIcon>
    </Group>
  );
};

export default NavUser;
