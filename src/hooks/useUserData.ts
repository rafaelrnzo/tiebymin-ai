import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { secureUrl } from "@/lib/api";

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

  useEffect(() => {
    const syncData = () => {
      if (typeof window !== "undefined") {
        const storedName = localStorage.getItem("firstName");
        let storedId = localStorage.getItem("userId");

        if (!storedId) {
          storedId =
            localStorage.getItem("user_id") || localStorage.getItem("id");
        }

        if (storedName) setUserName(storedName);
        if (storedId) setUserId(storedId);
      }
    };

    syncData();

    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
    };
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const endpoint = secureUrl(`/v1/auth/login`);
      console.log("Login endpoint:", endpoint);

      const response = await axios.post(endpoint, credentials, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data as LoginResponse;
    },
    onSuccess: (result) => {
      console.log("Login successful:", result);

      // Save access token to localStorage
      if (result.access_token) {
        localStorage.setItem("accessToken", result.access_token);
        localStorage.setItem("userToken", result.access_token); // For backward compatibility
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
      console.log("Register endpoint:", endpoint);

      const response = await axios.post(endpoint, registerData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data as RegisterResponse;
    },
    onSuccess: (result) => {
      console.log("Registration successful:", result);

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

      const response = await axios.get(secureUrl(`/v1/user-profile/user-info?token=${token}`), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data as UserProfile;
    },
    enabled: false, // Manual trigger
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

      const response = await axios.get(secureUrl(`/v1/user-profile/analysis-history?token=${token}`), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data as AnalysisHistoryResponse;
    },
    enabled: false, // Manual trigger
    retry: 2,
  });

  return {
    // State
    userName,
    userId,

    // Queries
    userProfile: userProfileQuery.data,
    analysisHistory: analysisHistoryQuery.data?.items || [],
    isLoading: loginMutation.isPending || registerMutation.isPending || userProfileQuery.isLoading || analysisHistoryQuery.isLoading,
    error: loginMutation.error?.message || registerMutation.error?.message || userProfileQuery.error?.message || analysisHistoryQuery.error?.message,

    // Mutations
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,

    // Query triggers
    fetchUserProfile: userProfileQuery.refetch,
    fetchAnalysisHistory: analysisHistoryQuery.refetch,

    // Combined fetch
    fetchUserData: async () => {
      await Promise.all([
        userProfileQuery.refetch(),
        analysisHistoryQuery.refetch(),
      ]);
    },
  };
};