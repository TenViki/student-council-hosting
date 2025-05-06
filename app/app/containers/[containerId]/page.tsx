import React, { FC } from "react";

interface PageProps {
  params: Promise<{
    containerId: string;
  }>;
}

const page: FC<PageProps> = async ({ params }) => {
  const p = await params;
  return <div>{JSON.stringify(p)}</div>;
};

export default page;
