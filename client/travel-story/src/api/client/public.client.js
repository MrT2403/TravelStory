import axios from "axios";
import queryString from "query-string";

const baseURL = "https://travel-story-api-navy.vercel.app/api/v1";
// http://localhost:5000/api/v1
const publicClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

publicClient.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
    },
  };
});

publicClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
  },
  (error) => {
    throw error.response ? error.response.data : error;
  }
);

export default publicClient;
