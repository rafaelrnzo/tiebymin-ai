import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { secureUrl } from "@/lib/api";
import { handleAxiosError } from "@/lib/error-utils";

// Interface bisa Anda letakkan di file terpisah (e.g., types.ts)
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
  const queryClient = useQueryClient();

  // ✅ 1. Gunakan state untuk menyimpan token dan data user.
  // Ini menghindari pemanggilan localStorage langsung saat render.
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ 2. Inisialisasi state dari localStorage HANYA di dalam useEffect.
  // Ini memastikan kode hanya berjalan di sisi client setelah komponen mount.
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedName = localStorage.getItem("firstName");
    const storedId = localStorage.getItem("userId") || localStorage.getItem("user_id");

    if (storedToken) setToken(storedToken);
    if (storedName) setUserName(storedName);
    if (storedId) setUserId(storedId);

    // Listener untuk sinkronisasi antar tab
    const syncData = () => {
      const currentToken = localStorage.getItem("accessToken");
      if (!currentToken) {
        clearAllUserData(); // Jika token dihapus di tab lain, logout di sini juga
      }
    };

    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
    };
  }, []); // <-- Dependency array kosong agar hanya berjalan sekali saat mount.

  const clearAllUserData = () => {
    // Fungsi ini sudah bagus, hanya perlu memastikan state di-reset juga.
    setToken(null);
    setUserName(null);
    setUserId(null);

    // Hapus semua query cache yang berhubungan dengan user
    queryClient.clear();

    if (typeof window === "undefined") return;

    // Daftar item yang akan dihapus
    const itemsToRemove = [
      "accessToken", "userToken", "userId", "user_id", "id",
      "userEmail", "firstName", "lastName", "analysisResultId",
      "tiebymin-analysis-data", "paymentOrderId", "capturedImage",
      "uploadedImage", "uploadedFaceImage", "registration-steps-progress",
      "registration-current-step", "feedbackSubmitted", "feedbackDismissed",
    ];
    itemsToRemove.forEach(item => localStorage.removeItem(item));

    document.cookie = 'auth=; path=/; max-age=0; SameSite=Lax';
  };

  const handleAuthError = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      clearAllUserData();
      // Melempar error baru agar bisa ditangkap di komponen UI jika perlu
      throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
    }
    throw handleAxiosError(error, 'general');
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axios.post<LoginResponse>(secureUrl(`/v1/auth/login`), credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token } = data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("userToken", access_token);
      document.cookie = `auth=${access_token}; path=/; max-age=86400; SameSite=Lax`;
      setToken(access_token);
      // ✅ Invalidate queries agar data user yang baru di-fetch (misal authMeQuery)
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
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
      if (result.id) {
        localStorage.setItem("userId", result.id);
        setUserId(result.id);
      }
      if (result.first_name) {
        localStorage.setItem("firstName", result.first_name);
        setUserName(result.first_name);
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  // ✅ 3. Gunakan 'token' dari state untuk mengaktifkan query
  const authMeQuery = useQuery({
    queryKey: ["authMe"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      try {
        const response = await axios.get(secureUrl(`/v1/auth/me`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        // Simpan data penting ke localStorage dan state
        if (userData.first_name) {
          localStorage.setItem("firstName", userData.first_name);
          setUserName(userData.first_name);
        }
        if (userData.id) {
          localStorage.setItem("userId", userData.id);
          setUserId(userData.id);
        }
        return userData;
      } catch (error: unknown) {
        handleAuthError(error);
      }
    },
    enabled: !!token, // Query ini hanya aktif jika ada token di state
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache data selama 5 menit
  });

  const userProfileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      try {
        const response = await axios.get<UserProfile>(secureUrl(`/v1/user-profile/user-info`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error: unknown) {
        handleAuthError(error);
      }
    },
    enabled: !!token, // Aktifkan juga jika token ada
    retry: 1,
  });

  // Analysis history query
  const analysisHistoryQuery = useQuery({
    queryKey: ["analysisHistory"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      try {
        const response = await axios.get<AnalysisHistoryResponse>(secureUrl(`/v1/user-profile/analysis-history`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error: unknown) {
        handleAuthError(error);
      }
    },
    enabled: false, // Manual trigger
    retry: 1,
  });

  // ... (query dan mutation lainnya bisa mengikuti pola yang sama)

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (!token) return; // Jika tidak ada token, tidak perlu panggil API
      return axios.post(secureUrl(`/v1/auth/logout`), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSettled: () => {
      // onSettled berjalan baik sukses maupun gagal
      clearAllUserData();
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Redirect ke login setelah logout
      }
    },
  });

  return {
    // State
    userName: userName || "",
    userId: userId || "",
    token,
    isAuthenticated: !!token, // Flag yang berguna untuk UI

    // Queries
    userProfile: userProfileQuery.data,
    analysisHistory: analysisHistoryQuery.data?.items || [],

    // Status
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