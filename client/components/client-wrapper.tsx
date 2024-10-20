"use client";

import BreadcrumbNavigation from "@/components/bread-crumb-navigation";
import { usePathname } from "next/navigation";
import React from "react";

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="w-full">
      {!isHomePage && (
        <div className="flex items-center  justify-between border-b-slate-200 border-b-[1px]">
          <BreadcrumbNavigation />
        </div>
      )}
      {children}
    </div>
  );
};

export default ClientWrapper;
