"use client";

import { Box, Group, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import StackItem from "./onboarding/StackItem";
import { useMutation } from "@tanstack/react-query";
import { setup } from "./actions/setup";
import { useRouter } from "next/navigation";

const options = [
  {
    id: "wordpress",
    title: "Wordpress",
    description: "Nejpopulárnější redakční systém na světě.",
    image: "/images/wordpress.png",
  },
  {
    id: "joomla",
    title: "Joomla",
    description: "Joomla je open-source redakční systém pro správu obsahu.",
    image: "/images/joomla.png",
  },
  {
    id: "html-css",
    title: "HTML/CSS",
    description: "Základní technologie pro tvorbu webových stránek.",
    image: "/images/html.png",
  },
  {
    id: "custom",
    title: "Vlastní aplikace",
    description: "Vytvořte si vlastní aplikaci podle svých představ.",
    image: "/images/custom.png",
  },
];

const OnBoarding = () => {
  const router = useRouter();
  const setupMutation = useMutation({
    mutationFn: setup,
    onSuccess: (data) => {
      console.log("Setup successful", data);
      router.refresh();
    },
    onError: (error) => {
      console.error("Setup failed", error);
    },
  });

  const handleSelect = (id: string) => {
    if (id !== "custom") setupMutation.mutate(id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Ask user to choose desired container stack */}
      <Title mb={16}>Vítejte v administraci hostingu!</Title>

      <Text c="dimmed" mb={16}>
        Vyberte si požadovanou aplikaci, kterou chcete nainstalovat.
      </Text>

      <Group align="stretch">
        {options.map((option) => (
          <StackItem
            {...option}
            key={option.id}
            onClick={() => handleSelect(option.id)}
          />
        ))}
      </Group>

      {setupMutation.isPending && (
        <Modal
          opened={setupMutation.isPending}
          onClose={() => {}}
          withCloseButton={false}
        >
          <Text>Probíhá instalace...</Text>
        </Modal>
      )}
    </Box>
  );
};

export default OnBoarding;
