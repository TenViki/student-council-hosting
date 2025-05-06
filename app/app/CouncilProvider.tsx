"use client";

import React, { FC, useEffect } from "react";
import { getCouncil } from "./actions/council";
import { AsyncReturnType } from "@/types/async";
import { useQuery } from "@tanstack/react-query";
import { getUserAction } from "@/actions/auth";

type CouncilProviderType = Exclude<AsyncReturnType<typeof getCouncil>, null>;

interface CouncilProviderProps {
  children: React.ReactNode;
  defaultCouncil: CouncilProviderType;
}

const CouncilContext = React.createContext<{
  council: CouncilProviderType | null;
}>({
  council: null,
});

export const useCouncil = () => {
  const councilContext = React.useContext(CouncilContext);
  if (!councilContext) {
    throw new Error("useCouncil must be used within a CouncilProvider");
  }

  if (!councilContext.council) {
    throw new Error("Council not found");
  }

  return councilContext.council;
};

const CouncilProvider: FC<CouncilProviderProps> = ({
  children,
  defaultCouncil,
}) => {
  const councilQuery = useQuery({
    queryKey: ["council", defaultCouncil?.id],
    queryFn: () => getCouncil(),
    initialData: defaultCouncil,
  });

  useEffect(() => {
    councilQuery.refetch();
  }, [defaultCouncil]);

  return (
    <CouncilContext.Provider
      value={{
        council: councilQuery.data,
      }}
    >
      {children}
    </CouncilContext.Provider>
  );
};

export default CouncilProvider;
