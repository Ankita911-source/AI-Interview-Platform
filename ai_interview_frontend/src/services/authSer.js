import api, { getErrorMessage } from "./api";

export const signupAPI = async (name, email, password) => {
  try {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const loginAPI = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const meAPI = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};