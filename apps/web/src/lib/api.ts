export const API_BASE_URL =
    process.env.NEXT_PUBLIC_ENV === "production" && process.env.NEXT_PUBLIC_BACKEND_API
        ? process.env.NEXT_PUBLIC_BACKEND_API
        : "http://localhost:8000";
