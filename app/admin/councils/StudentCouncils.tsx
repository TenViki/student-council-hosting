"use client";

import DatatableWrapper from "&/admin/DatatableWrapper";
import PageHeader from "&/dashboard/PageHeader";
import React from "react";
import { bulkGetCouncils } from "./actions/studentCouncilsBulk";
import { Button } from "@mantine/core";
import { LucidePlus } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import CreateCouncilForm from "./CreateCouncil";

const StudentCouncils = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <PageHeader title="Studentské Rady">
        <Button
          leftSection={<LucidePlus size="1rem" />}
          onClick={open}
          variant="light"
        >
          Nová studentská rada
        </Button>
      </PageHeader>

      <CreateCouncilForm opened={opened} onClose={close} />

      <DatatableWrapper
        action={bulkGetCouncils}
        columns={[
          {
            accessor: "name",
          },
        ]}
        defaultOrderBy="name"
      />
    </>
  );
};

export default StudentCouncils;
