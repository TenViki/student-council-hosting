"use client";

import React, { FC } from "react";
import { QueryClient, QueryClientProvider as QC_QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryClientProvider: FC<QueryProviderProps> = ({ children }) => {
  return <QC_QueryClientProvider client={queryClient}>{children}</QC_QueryClientProvider>;
};

export default QueryClientProvider;
