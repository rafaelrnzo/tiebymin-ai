import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { secureUrl } from "@/lib/api";
import { handleAxiosError } from "@/lib/error-utils";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  google_id: string;
  is_active: boolean;
  phone_number: number | null;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface UserProfile {
  user_id: string;
  user_full_name: string;
  user_first_name: string;
}

interface AnalysisHistoryItem {
  analysis_id: string;
  analysis_date: string;
}

interface AnalysisHistoryResponse {
  total_items: number;
  items: AnalysisHistoryItem[];
  limit: number;
  skip: number;
}

export const useUserData = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

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

    // Clear user state
    setUserName("");
    setUserId("");
  };

  useEffect(() => {
    const syncData = () => {
      if (typeof window !== "undefined") {
        const storedName = localStorage.getItem("firstName");
        let storedId = localStorage.getItem("userId");

        if (!storedId) {
          storedId =
            localStorage.getItem("user_id") || localStorage.getItem("id");
        }

        if (storedName && storedName !== userName) {
          setUserName(storedName);
        }
        if (storedId && storedId !== userId) {
          setUserId(storedId);
        }
      }
    };

    syncData();

    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
    };
  }, [userName, userId]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const endpoint = secureUrl(`/v1/auth/login`);

      const response = await axios.post(endpoint, credentials, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data as LoginResponse;
    },
    onSuccess: async (result) => {
      // Save access token to localStorage
      if (result.access_token) {
        localStorage.setItem("accessToken", result.access_token);
        localStorage.setItem("userToken", result.access_token); // For backward compatibility

        // Set cookie for middleware with proper settings
        if (typeof window !== 'undefined') {
          document.cookie = `auth=${result.access_token}; path=/; max-age=86400; SameSite=Lax`;
        }

        // Immediately fetch user data to get firstName
        try {
          const userResponse = await axios.get(secureUrl(`/v1/auth/me`), {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.access_token}`,
            },
          });

          if (userResponse.data.first_name) {
            localStorage.setItem("firstName", userResponse.data.first_name);
            setUserName(userResponse.data.first_name);
          }
        } catch (error) {
          console.warn("Failed to fetch user data after login:", error);
        }
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const endpoint = secureUrl(`/v1/auth/register`);

      const response = await axios.post(endpoint, registerData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data as RegisterResponse;
    },
    onSuccess: (result) => {

      // Save user data to localStorage
      if (result.id) {
        localStorage.setItem("userId", result.id);
      }
      if (result.email) {
        localStorage.setItem("userEmail", result.email);
      }
      if (result.first_name) {
        localStorage.setItem("firstName", result.first_name);
      }
      if (result.last_name) {
        localStorage.setItem("lastName", result.last_name);
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  // User profile query
  const userProfileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No access token found");
      }

      try {
        const response = await axios.get(secureUrl(`/v1/user-profile/user-info`), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const tes = await axios.get(secureUrl(`/v1/auth/validate-token`), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.setItem("userId", tes.data.user_id);

        return response.data as UserProfile;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          // Clear all user data on auth expiration
          clearAllUserData();
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw handleAxiosError(error, 'general');
      }
    },
    enabled: false, // Manual trigger
    retry: 2,
  });

  // Auth me query for getting user first_name
  const authMeQuery = useQuery({
    queryKey: ["authMe"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No access token found");
      }

      try {
        const response = await axios.get(secureUrl(`/v1/auth/me`), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Save first_name to localStorage if available
        if (response.data.first_name) {
          localStorage.setItem("firstName", response.data.first_name);
          setUserName(response.data.first_name);
        }

        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          // Clear all user data on auth expiration
          clearAllUserData();
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw error;
      }
    },
    enabled: !!localStorage.getItem("accessToken"), // Auto-trigger when token exists
    retry: 2,
  });

  // Analysis history query
  const analysisHistoryQuery = useQuery({
    queryKey: ["analysisHistory"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No access token found");
      }

      try {
        const response = await axios.get(secureUrl(`/v1/user-profile/analysis-history`), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data as AnalysisHistoryResponse;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          // Clear all user data on auth expiration
          clearAllUserData();
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw error;
      }
    },
    enabled: false, // Manual trigger
    retry: 2,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.post(secureUrl(`/v1/auth/logout`), {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Clear all user data
      clearAllUserData();

      // Redirect to home page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
    onError: (error) => {
      // Even if logout API fails, clear all local data and redirect
      clearAllUserData();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
  });

  return {
    // State
    userName,
    userId,

    // Queries
    userProfile: userProfileQuery.data,
    analysisHistory: analysisHistoryQuery.data?.items || [],
    isLoading: loginMutation.isPending || registerMutation.isPending || userProfileQuery.isLoading || analysisHistoryQuery.isLoading || logoutMutation.isPending,
    error: loginMutation.error?.message || registerMutation.error?.message || userProfileQuery.error?.message || analysisHistoryQuery.error?.message || logoutMutation.error?.message,

    // Mutations
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // Query triggers
    fetchUserProfile: userProfileQuery.refetch,
    fetchAnalysisHistory: analysisHistoryQuery.refetch,
    fetchAuthMe: authMeQuery.refetch,

    // Combined fetch
    fetchUserData: async () => {
      await Promise.all([
        userProfileQuery.refetch(),
        analysisHistoryQuery.refetch(),
        authMeQuery.refetch(), // Also fetch auth me to ensure firstName is updated
      ]);
    },
  };
};