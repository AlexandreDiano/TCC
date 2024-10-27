import axios from "axios";
import { store } from "~/store";

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const { token } = store.getState().authentication;
  const headers = { ...config.headers };

  if (token) {
    headers.Authorization = token;
  }

  return { ...config, headers };
});

export default api;
