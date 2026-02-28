import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    } else {
      delete request.headers.authorization;
    }

    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("RESPONSE ERROR", error);
    return Promise.reject(error);
  },
);

export default api;
