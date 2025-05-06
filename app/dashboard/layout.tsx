import AppLayout from "&/dashboard/AppLayout";
import { getAuth } from "@/lib/auth/dal";
import React, { FC } from "react";
import { getCouncil } from "./actions/council";
import CouncilProvider from "./CouncilProvider";
import CouncilNav from "./CouncilNav";

interface LayoutProps {
  children: React.ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  const { user } = await getAuth(true);
  const council = await getCouncil();

  if (!council) {
    return (
      <div>Přístup odepřen. Nemáte oprávnění k zobrazení této stránky.</div>
    );
  }

  return (
    <CouncilProvider defaultCouncil={council}>
      <AppLayout navigation={<CouncilNav />}>{children}</AppLayout>
    </CouncilProvider>
  );
};

export default layout;
