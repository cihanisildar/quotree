"use client";
import { Avatar } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  Clock,
  FoldersIcon,
  MessageSquareQuoteIcon,
  SearchIcon,
  Settings,
  TagsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CiLogout, CiSettings } from "react-icons/ci";
import useSWR from "swr";
import shape from "../public/images/shape (1).png";
import QuickSearchComponent from "./quick-search";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";

type Folder = {
  id: number;
  name: string;
};

const fetchFolders = async (url: string, userId: number): Promise<Folder[]> => {
  const response = await fetch(
    `http://localhost:5000/api/folders/user/${userId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch folders");
  }
  return response.json();
};

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Quick Search",
      href: "/posts",
      icon: (
        <SearchIcon
          color="gray"
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
      dialog: true,
    },
    {
      label: "Recent Activities",
      href: "/tags",
      icon: (
        <Clock
          color="gray"
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
      dialog: false,
    },
    {
      label: "Settings",
      href: "/about",
      icon: (
        <Settings
          color="gray"
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
      dialog: false,
    },

    // {
    //   label: "Logout",
    //   href: "#",
    //   icon: (
    //     <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
  ];

  const workspaceLinks = [
    {
      label: "Folders",
      href: "/dashboard/folders",
      icon: (
        <FoldersIcon
          color="blue"
          className="bg-blue-200 p-1 rounded-full text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0"
        />
      ),
    },
    {
      label: "Quotes",
      href: "/dashboard/quotes",
      icon: (
        <MessageSquareQuoteIcon
          color="red"
          className="bg-red-200 p-1 rounded-full text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0"
        />
      ),
    },
    {
      label: "Tags",
      href: "/dashboard/tags",
      icon: (
        <TagsIcon
          color="yellow"
          className="bg-yellow-600 p-1 rounded-full text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0"
        />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  const {
    data: folders,
    error,
    isLoading,
    mutate,
  } = useSWR(user ? ["/api/folders", user.id] : null, ([url, userId]) =>
    fetchFolders(url, userId)
  );

  const email = user?.email;
  const firstTwoLetters = email ? email.slice(0, 2) : "";

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-transparent dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar animate={false} open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="p-4 flex flex-col">
              {links.map((link, idx) =>
                link.dialog ? (
                  <QuickSearchComponent
                    key={`link-${idx}`}
                    link={link}
                    idx={idx}
                  />
                ) : (
                  <SidebarLink key={idx} link={link} />
                )
              )}
            </div>

            {/* Folders Section */}
            <div className="px-4 mt-4">
              <div className="flex justify-between items-center">
                <h1 className="text-sm tracking-wide">Workspace</h1>
              </div>
              <Separator className="my-1 bg-slate-200" />
              {/* Show skeletons when loading */}
              <div className="flex flex-col">
                {workspaceLinks.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4">
            <Popover>
              <PopoverTrigger className="flex gap-4 items-center group/account">
                <Image src={shape} alt="shape" width={20} height={20} />
                <h1 className="group-hover/account:translate-x-1 transition duration-150">
                  {user?.email}
                </h1>
              </PopoverTrigger>
              <PopoverContent
                className="bg-white rounded-[8px] flex flex-col gap-1 ml-4 mb-4"
                side="top"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="bg-slate-500 flex items-center justify-center">
                    <h1 className="text-white uppercase">{firstTwoLetters}</h1>
                  </Avatar>
                  <h1 className="text-zinc-400">{user?.email}</h1>
                </div>
                <Separator />
                <Button className="flex items-center gap-2 text-slate-900 hover:bg-slate-50 rounded-[8px]">
                  Manage Account <CiSettings size={20} color="gray" />
                </Button>
                <Separator />
                <Button className="flex items-center gap-2  text-slate-900 hover:bg-slate-50 rounded-[8px]">
                  Log out <CiLogout size={20} color="gray" />
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal border-b-slate-200 border-b-[1px] flex gap-2 items-center text-sm text-black p-4 relative z-20 group/logo"
    >
      <Image src={shape} alt="shape" width={20} height={20} />

      <span className="font-semibold text-black dark:text-white whitespace-pre !opacity-100  group-hover/logo:translate-x-1 transition-all duration-150">
        BLOGCHAIN
      </span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal p-4 flex space-x-2 items-center text-sm text-black relative z-20"
    >
      <Image src={shape} alt="shape" width={20} height={20} />
    </Link>
  );
};
