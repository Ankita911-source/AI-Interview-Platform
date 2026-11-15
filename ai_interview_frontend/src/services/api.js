import axios from "axios";

export const TOKEN_KEY = "ai_interview_token";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

// attach the login token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// token expired / invalid -> back to the login page
// (the /auth/* calls handle their own 401s, e.g. "wrong password")
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.startsWith("/auth/")) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);


export const getErrorMessage = (error) => {
  const detail = error.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((d) => d.msg).join(". ");
  }
  if (!error.response) {
    return "Can't reach the server! Please check your internet connection.";
  }
  return "Something went wrong! Please try again.";
};

export default api;
