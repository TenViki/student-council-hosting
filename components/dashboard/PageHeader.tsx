import { ActionIcon, Box, Group, Text, Title } from "@mantine/core";
import Link from "next/link";
import React, { FC } from "react";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backLink?: string;
  children?: React.ReactNode;
  id?: string;
  subtext?: string | React.ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  children,
  backLink,
  id,
  subtext,
}) => {
  return (
    <Group mb={16}>
      {backLink && (
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          href={backLink}
          component={Link}
        >
          <ArrowLeft style={{ width: "70%", height: "70%" }} size="1rem" />
        </ActionIcon>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Title id={id}>{title}</Title>
        {typeof subtext === "string" ? (
          <Text c="dimmed">{subtext}</Text>
        ) : (
          subtext
        )}
      </Box>
      <Group>{children}</Group>
    </Group>
  );
};

export default PageHeader;
