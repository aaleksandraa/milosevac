export const backendPublicUrl =
  import.meta.env.VITE_BACKEND_PUBLIC_URL || "http://127.0.0.1:8002";

export const backendLoginUrl = `${backendPublicUrl.replace(/\/$/, "")}/login`;
