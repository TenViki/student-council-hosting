import { Box, Group, Paper, Text, Title } from "@mantine/core";
import React, { FC } from "react";

interface DashboardTileProps {
  label: string;
  icon: React.ReactNode;
  value: string;
}

const DashboardTile: FC<DashboardTileProps> = ({ label, icon, value }) => {
  return (
    <Paper withBorder p={16} sx={{ flex: 1 }}>
      <Group>
        <Box>{icon}</Box>

        <Box>
          <Title order={3} mb={4}>
            {value}
          </Title>

          <Text c="dimmed">{label}</Text>
        </Box>
      </Group>
    </Paper>
  );
};

export default DashboardTile;
