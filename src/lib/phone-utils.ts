// Phone number formatting utilities

/**
 * Formats Indonesian phone number by removing leading "0" and non-numeric characters
 * @param phoneNumber Raw phone number input
 * @returns Formatted phone number without leading "0"
 */
export const formatIndonesianPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Remove all non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, "");

  // Remove leading "0" if present
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  return cleaned;
};

/**
 * Validates Indonesian phone number format
 * @param phoneNumber Phone number to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export const validateIndonesianPhoneNumber = (phoneNumber: string) => {
  const formatted = formatIndonesianPhoneNumber(phoneNumber);

  if (!formatted) {
    return { isValid: false, error: "Nomor telepon wajib diisi" };
  }

  if (formatted.length < 9) {
    return {
      isValid: false,
      error: "Nomor telepon minimal 10 digit (atau 9 digit tanpa angka 0 di depan)"
    };
  }

  if (formatted.length > 15) {
    return {
      isValid: false,
      error: "Nomor telepon maksimal 15 digit"
    };
  }

  return { isValid: true, formattedNumber: formatted };
};

/**
 * Formats phone number for display (adds spaces for readability)
 * @param phoneNumber Formatted phone number
 * @returns Display-friendly phone number
 */
export const formatPhoneNumberForDisplay = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Add spaces every 3-4 digits for readability
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};