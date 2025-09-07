import { useEffect, useState } from "react";
import { useUserData } from "./useUserData";

interface UseAuthCheckOptions {
  redirectTo?: string;
  autoRedirect?: boolean;
  fetchUserData?: boolean;
  onAuthenticated?: () => void;
  onUnauthenticated?: () => void;
}

export const useAuthCheck = (options: UseAuthCheckOptions = {}) => {
  const {
    redirectTo = "/register",
    autoRedirect = true,
    fetchUserData = true,
    onAuthenticated,
    onUnauthenticated,
  } = options;

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { fetchAuthMe } = useUserData();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userToken = localStorage.getItem("userToken");
        const isLoggedIn =
          !!(accessToken && accessToken.trim()) ||
          !!(userToken && userToken.trim());

        if (!isLoggedIn) {
          setIsAuthenticated(false);
          setIsAuthChecking(false);

          if (autoRedirect) {
            window.location.href = redirectTo;
          }

          onUnauthenticated?.();
          return;
        }

        setIsAuthenticated(true);

        // Fetch user data from /v1/auth/me when component mounts
        // This ensures we have the latest user data
        if (fetchUserData && isLoggedIn) {
          try {
            await fetchAuthMe();
          } catch (error) {
            console.warn("Failed to fetch user data:", error);
            // Don't fail the auth check if user data fetch fails
          }
        }

        onAuthenticated?.();
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        if (autoRedirect) {
          window.location.href = redirectTo;
        }
        onUnauthenticated?.();
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [redirectTo, autoRedirect, fetchUserData, fetchAuthMe, onAuthenticated, onUnauthenticated]);

  return {
    isAuthChecking,
    isAuthenticated,
    user,
  };
};