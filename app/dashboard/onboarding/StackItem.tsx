import { Box, Paper, Text, Title, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import React, { FC } from "react";

interface StackItemProps {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
}

const StackItem: FC<StackItemProps> = ({
  description,
  image,
  title,
  onClick,
}) => {
  return (
    <UnstyledButton
      sx={{
        display: "flex",
        transition: "transform 0.3s, box-shadow 0.3s",
        ["&:hover"]: {
          transform: "translateY(-0.2rem)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        },
      }}
      onClick={onClick}
    >
      <Paper withBorder sx={{}} p={16} maw={200}>
        <Box
          sx={{
            position: "relative",
            width: 150,
            height: 150,
          }}
          mb={16}
        >
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="contain"
            style={{ borderRadius: 8 }}
          />
        </Box>

        <Box>
          <Title order={4} mt={8} mb={4}>
            {title}
          </Title>

          <Text c="dimmed" size="sm">
            {description}
          </Text>
        </Box>
      </Paper>
    </UnstyledButton>
  );
};

export default StackItem;
