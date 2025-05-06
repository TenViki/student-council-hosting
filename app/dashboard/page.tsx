import React from "react";
import { getCouncil } from "./actions/council";
import OnBoarding from "./OnBoarding";

const page = async () => {
  const council = await getCouncil();
  if (!council) return null;

  if (council.containers.length === 0) return <OnBoarding />;

  return <div>page</div>;
};

export default page;
