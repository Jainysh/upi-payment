export const appType = () => {
  if (typeof window === "undefined") {
    return "";
  }
  if (window.location.hostname.includes("self-defence")) {
    return "self-defence";
  } else if (window.location.hostname.includes("shibir")) {
    return "shibir";
  }
  return "shibir";
};

export const openSpecificUPIApp = async (
  scheme: string,
  name: string,
  mobile: string
) => {
  const app = appType();
  const payee =
    app === "self-defence"
      ? process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT
      : process.env.NEXT_PUBLIC_SHIBIR_UPI_PAYEE_ACCOUNT;
  const amount =
    app === "self-defence"
      ? process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
      : process.env.NEXT_PUBLIC_SHIBIR_PAYMENT_AMOUNT;

  const description = `${name.trim()}-${mobile.trim()}`;

  const specificUrl = `${scheme}?pa=${payee}&am=${amount}&tn=${encodeURIComponent(
    description
  )}&cu=INR`;

  // Try to open the specific app
  window.location.href = specificUrl;

  // Fallback to generic UPI after a delay
  setTimeout(() => {
    if (!document.hidden) {
      const genericUrl = `upi://pay?pa=${payee}&am=${amount}&tn=${encodeURIComponent(
        description
      )}&cu=INR`;
      window.location.href = genericUrl;
    }
  }, 2000);
};
