import React from "react";
import { getCouncil } from "./actions/council";
import OnBoarding from "./OnBoarding";
import PageHeader from "&/dashboard/PageHeader";
import { LucideContainer, LucideGlobe } from "lucide-react";
import DashboardTile from "./DashboardTile";
import {Group} from "@mantine/core"

const page = async () => {
  const council = await getCouncil();
  if (!council) return null;

  if (council.containers.length === 0) return <OnBoarding />;

  return (
    <>
      <PageHeader title="Přehled" />

      <Group>
        <DashboardTile
          label="Adresa"
          icon={<LucideGlobe size={"1.5rem"} />}
          value={`${council.subdomain}.${process.env.DOMAIN}`}
        />

        <DashboardTile
          label="Počet kontejnerů"
          icon={<LucideContainer size={"1.5rem"} />}
          value={council.containers.length.toLocaleString()}
        />
      </Group>
    </>
  );
};

export default page;
