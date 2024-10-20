"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import { useUser } from "../hooks/useUser";
import useIsLoggedIn from "@/components/context/useIsLoggedIn";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { mutate } = useUser();
  const { isLoggedIn, setIsLoggedIn, checkAuthStatus } = useIsLoggedIn();

  console.log(isLoggedIn);

  useEffect(() => {
    // Check auth status when component mounts and after any navigation
    checkAuthStatus();
  }, [checkAuthStatus, pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setIsLoggedIn(false);

      await mutate(null);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="backdrop-blur-lg bg-white/85 border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto h-[60px] flex items-center justify-between">
        <Link
          href={"/"}
          className="font-serif text-2xl font-medium text-[#322D3A]"
        >
          quotify.
        </Link>
        <div className="flex gap-2 text-sm font-medium">
          {!isLoggedIn && (
            <Link href={"/pricing"} className="p-2 text-zinc-500 ">
              Pricing
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <button onClick={handleLogout} className="p-2 text-zinc-500">
                Sign out
              </button>
              <Link
                href={"/dashboard"}
                className="py-2 px-4 text-[#1E1928] border bg-[#FFF9DB] hover:bg-[#FFF9DB]/90 rounded-[8px] "
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href={"/auth/sign-in"} className="p-2 text-zinc-500">
                Login
              </Link>
              <Link
                href={"/auth/sign-up"}
                type="button"
                className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-[8px] text-white bg-[#292A2D] border hover:bg-black/80"
              >
                Get Started
                <FaArrowRight />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
