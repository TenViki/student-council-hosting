"use client";

import { useUser } from "@/providers/UserProvider";
import React from "react";

const page = () => {
  const { user } = useUser();

  return <div>Přihlášen jako {user?.email}</div>;
};

export default page;
