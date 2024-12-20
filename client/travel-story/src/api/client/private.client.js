import axios from "axios";
import queryString from "query-string";

const baseURL = "https://travel-story-api-navy.vercel.app/api/v1";
// http://localhost:5000/api/v1
const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

privateClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Chỉ thiết lập Content-Type nếu không phải là FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

privateClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
      }
      throw error.response.data;
    }
    throw error;
  }
);

export default privateClient;
