"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { createContext, FC, useEffect } from "react";
import { AsyncReturnType } from "@/types/async";
import { getUserAction } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";

type UserProviderType = AsyncReturnType<typeof getUserAction>;

interface UserProviderProps {
  children: React.ReactNode;
  defaultUser: UserProviderType | null;
}

const UserContext = createContext<{
  user: UserProviderType | null;
}>({
  user: null,
});

export const useUser = () => {
  const userContext = React.useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return userContext;
};

const UserProvider: FC<UserProviderProps> = ({ children, defaultUser }) => {
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserAction(),
    initialData: defaultUser,
  });

  useEffect(() => {
    userQuery.refetch();
  }, [defaultUser]);

  return (
    <UserContext.Provider
      value={{
        user: userQuery.data,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
