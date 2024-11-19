import axios from "axios";

const apiNoAuth = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiNoAuth;
