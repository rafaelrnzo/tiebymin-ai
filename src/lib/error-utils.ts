/**
 * Utility functions for handling and formatting error messages
 * to provide user-friendly error messages for authentication operations
 */

export interface ErrorHandlerOptions {
  defaultMessage?: string;
  includeTechnicalDetails?: boolean;
}

/**
 * Converts technical error messages to user-friendly messages
 * for authentication operations (login, register, etc.)
 */
export function getAuthErrorMessage(
  error: unknown,
  options: ErrorHandlerOptions = {}
): string {
  const { defaultMessage = "Terjadi kesalahan. Silakan coba lagi." } = options;

  if (!(error instanceof Error)) {
    return defaultMessage;
  }

  const errorText = error.message.toLowerCase();

  // Handle email already exists error
  if (
    errorText.includes("email") &&
    (errorText.includes("already") ||
      errorText.includes("exists") ||
      errorText.includes("duplicate"))
  ) {
    return "Email sudah digunakan, silakan coba email lain";
  }

  // Handle invalid credentials
  if (
    errorText.includes("invalid") &&
    (errorText.includes("credential") ||
      errorText.includes("password") ||
      errorText.includes("email"))
  ) {
    return "Email atau password yang Anda masukkan salah. Silakan periksa kembali.";
  }

  // Handle account not found
  if (
    errorText.includes("not found") ||
    errorText.includes("user") ||
    errorText.includes("account")
  ) {
    return "Akun tidak ditemukan. Pastikan email Anda sudah terdaftar.";
  }

  // Handle account not active
  if (
    errorText.includes("active") ||
    errorText.includes("inactive") ||
    errorText.includes("disabled")
  ) {
    return "Akun Anda belum aktif. Silakan periksa email Anda untuk aktivasi.";
  }

  // Handle network/connection errors
  if (
    errorText.includes("network") ||
    errorText.includes("connection") ||
    errorText.includes("timeout")
  ) {
    return "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.";
  }

  // Handle server errors
  if (
    errorText.includes("internal") ||
    errorText.includes("server") ||
    errorText.includes("500")
  ) {
    return "Server sedang mengalami gangguan. Silakan coba beberapa saat lagi.";
  }

  // Handle rate limiting
  if (
    errorText.includes("rate") ||
    errorText.includes("limit") ||
    errorText.includes("too many")
  ) {
    return "Terlalu banyak percobaan. Silakan tunggu beberapa menit sebelum mencoba lagi.";
  }

  // Handle authentication errors
  if (
    errorText.includes("unauthorized") ||
    errorText.includes("forbidden") ||
    errorText.includes("403") ||
    errorText.includes("401")
  ) {
    return "Akses ditolak. Silakan coba lagi atau hubungi dukungan.";
  }

  // Handle validation errors
  if (
    errorText.includes("validation") ||
    errorText.includes("invalid")
  ) {
    return "Data yang dimasukkan tidak valid. Periksa kembali form Anda.";
  }

  // Handle bad request
  if (
    errorText.includes("bad request") ||
    errorText.includes("400")
  ) {
    return "Permintaan tidak dapat diproses. Periksa data Anda dan coba lagi.";
  }

  // Handle session expired
  if (
    errorText.includes("session") ||
    errorText.includes("expired") ||
    errorText.includes("token")
  ) {
    return "Sesi Anda telah berakhir. Silakan login kembali.";
  }

  // Use original message if it's already user-friendly
  if (
    errorText.length < 100 &&
    !errorText.includes("error") &&
    !errorText.includes("code")
  ) {
    return error.message;
  }

  // Default fallback for technical errors
  return defaultMessage;
}

/**
 * Handles axios errors specifically and extracts user-friendly messages
 */
export function handleAxiosError(
  error: unknown,
  context: 'login' | 'register' | 'general' = 'general'
): string {
  // Handle axios error responses
  const axiosError = error as {
    response?: { status?: number; data?: { message?: string } };
    code?: string;
    message?: string
  };

  // Handle specific HTTP status codes
  if (axiosError.response?.status) {
    const status = axiosError.response.status;

    switch (status) {
      case 400:
        return "Permintaan tidak dapat diproses. Periksa data Anda dan coba lagi.";
      case 401:
        return "Email atau password yang Anda masukkan salah. Silakan periksa kembali.";
      case 403:
        return "Akses ditolak. Silakan coba lagi atau hubungi dukungan.";
      case 404:
        return "Akun tidak ditemukan. Pastikan email Anda sudah terdaftar.";
      case 422:
        return "Data yang dimasukkan tidak valid. Periksa kembali form Anda.";
      case 429:
        return "Terlalu banyak percobaan. Silakan tunggu beberapa menit sebelum mencoba lagi.";
      case 500:
        return "Server sedang mengalami gangguan. Silakan coba beberapa saat lagi.";
      default:
        if (status >= 500) {
          return "Server sedang mengalami gangguan. Silakan coba beberapa saat lagi.";
        }
    }
  }

  // Handle network errors
  if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
    return "Permintaan memakan waktu terlalu lama. Silakan coba lagi.";
  }

  if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
    return "Koneksi internet bermasalah. Mohon periksa koneksi Anda.";
  }

  // Fallback to general error handler
  return getAuthErrorMessage(error, {
    defaultMessage: context === 'login'
      ? "Terjadi kesalahan saat masuk ke akun. Silakan coba lagi dalam beberapa saat."
      : context === 'register'
      ? "Terjadi kesalahan saat membuat akun. Silakan coba lagi dalam beberapa saat."
      : "Terjadi kesalahan. Silakan coba lagi."
  });
}