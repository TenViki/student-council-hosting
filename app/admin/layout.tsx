import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const layout: FC<LayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default layout;
