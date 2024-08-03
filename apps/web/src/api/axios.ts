import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

export const getUserInfo = async () => {
  const response = await api.get("/user-info");
  return response.data;
};

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};
