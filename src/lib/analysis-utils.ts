export const getAccessSource = (
  orderId: string | null,
  statusCode: string | null,
  transactionStatus: string | null,
  resultId: string | null
) => {
  if (orderId && statusCode === "200" && transactionStatus === "settlement") {
    return "payment";
  } else if (resultId && !orderId) {
    return "profile";
  } else {
    return "registration";
  }
};

export const isValidResultId = (
  resultId: string | null
): resultId is string => {
  return !!(
    resultId &&
    typeof resultId === "string" &&
    resultId.length > 0
  );
};

export const isPaymentRedirect = (
  statusCode: string | null,
  transactionStatus: string | null
) => {
  return statusCode === "200" && transactionStatus === "settlement";
};