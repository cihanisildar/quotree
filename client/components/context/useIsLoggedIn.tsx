// hooks/useIsLoggedIn.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthStatus: () => Promise<void>;
  error: string | null;
}

const IsLoggedInContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  checkAuthStatus: async () => {},
  error: null,
});

export const IsLoggedInProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/status`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("use is logged in", data);
        
        setIsLoggedIn(data.isLoggedIn);
        setError(null);
      } else {
        setIsLoggedIn(false);
        setError("Failed to fetch auth status");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      setError("Error checking auth status");
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
    // Check auth status every minute
    const interval = setInterval(checkAuthStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  return (
    <IsLoggedInContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, checkAuthStatus, error }}
    >
      {children}
    </IsLoggedInContext.Provider>
  );
};

export const useIsLoggedIn = () => useContext(IsLoggedInContext);

export default useIsLoggedIn;
