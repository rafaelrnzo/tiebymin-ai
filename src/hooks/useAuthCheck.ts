import { useEffect, useState } from "react";
import { useUserData } from "./useUserData";

// Comprehensive localStorage clearing function for auth expiration
const clearAllUserData = () => {
  if (typeof window === "undefined") return;

  // Clear all authentication tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userToken");

  // Clear all user profile data
  localStorage.removeItem("userId");
  localStorage.removeItem("user_id");
  localStorage.removeItem("id");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");

  // Clear analysis data
  localStorage.removeItem("analysisResultId");
  localStorage.removeItem("tiebymin-analysis-data");

  // Clear payment data
  localStorage.removeItem("paymentOrderId");

  // Clear image data
  localStorage.removeItem("capturedImage");
  localStorage.removeItem("uploadedImage");
  localStorage.removeItem("uploadedFaceImage");

  // Clear registration data
  localStorage.removeItem("registration-steps-progress");
  localStorage.removeItem("registration-current-step");

  // Clear feedback data
  localStorage.removeItem("feedbackSubmitted");
  localStorage.removeItem("feedbackDismissed");

  // Clear cookie
  document.cookie = 'auth=; path=/; max-age=0; SameSite=Lax';

  console.log("All user data cleared from localStorage due to session expiration");
};

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
          console.log("User not authenticated, clearing all data before redirect");

          // Clear all localStorage data before redirect
          clearAllUserData();

          setIsAuthenticated(false);
          setIsAuthChecking(false);

          if (autoRedirect) {
            // Small delay to ensure localStorage clearing completes
            setTimeout(() => {
              window.location.href = redirectTo;
            }, 100);
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

        // Clear all data on auth check failure as well
        console.log("Auth check failed, clearing all data before redirect");
        clearAllUserData();

        setIsAuthenticated(false);
        if (autoRedirect) {
          // Small delay to ensure localStorage clearing completes
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 100);
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