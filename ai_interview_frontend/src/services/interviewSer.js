import api, { getErrorMessage } from "./api";

const BASE_URL = "/interview";

export const startInterviewAPI = async (sessionId) => {
  try {
    const response = await api.get(`${BASE_URL}/start/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};

export const submitAPI = async (payload) => {
  try {
    const response = await api.post(`${BASE_URL}/submit`, payload);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};

export const reportAPI = async (sessionId) => {
  try {
    const response = await api.get(`${BASE_URL}/report/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};

export const endInterviewAPI = async (sessionId) => {
  try {
    const response = await api.put(`${BASE_URL}/end/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};

export const historyAPI = async () => {
  try {
    const response = await api.get(`${BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};

export const generateQuestionsAPI = async (formData) => {
  try {
    const response = await api.post(
      `${BASE_URL}/generate-question`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(getErrorMessage(error));
  }
};
