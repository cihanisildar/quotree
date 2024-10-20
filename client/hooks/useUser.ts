"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useIsLoggedIn from "../components/context/useIsLoggedIn";
import { User } from "@/models/User";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("An error occurred while fetching the data.");
  }
  return res.json();
};

export function useUser() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();

  const { data, error, mutate } = useSWR<User | null>(
    isLoggedIn ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile` : null,
    fetcher
  );

  useEffect(() => {
    if (error) {
      console.error("Error in useUser:", error);
      if (error.message === "Unauthorized") {
        setIsLoggedIn(false);
        if (!pathname.startsWith("/auth/") && pathname !== "/") {
          router.push("/auth/sign-in");
        }
      }
    } else if (data && pathname.startsWith("/auth/")) {
      router.push("/dashboard");
    }
  }, [error, data, router, pathname, setIsLoggedIn]);

  return {
    user: data,
    isLoading: !error && !data && isLoggedIn === null,
    isError: error,
    mutate,
  };
}
