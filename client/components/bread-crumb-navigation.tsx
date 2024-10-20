// components/BreadcrumbNavigation.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

function BreadcrumbNavigation() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <div className="sticky top-0 right-0 z-10 bg-white">
      <div className="px-8 py-4  flex items-center justify-between text-[#475467]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1;
              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                      className={`capitalize ${
                        isLast ? "text-[#42867A] font-semibold " : ""
                      }`}
                    >
                      {segment}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>{" "}
        {/* <Button className="rounded-full">Sign in <ChevronRight className="font-bold ml-1" strokeWidth={3} size={16} fontWeight={500} /></Button> */}
      </div>
    </div>
  );
}

export default BreadcrumbNavigation;
