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
