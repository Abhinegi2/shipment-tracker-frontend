import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const shipmentsAPI = {
  getAll: (params) => api.get("/shipments", { params }),
  getOne: (id) => api.get(`/shipments/${id}`),
  create: (data) => api.post("/shipments", data),
  updateStatus: (id, data) => api.post(`/shipments/${id}/update-status`, data),
  stats: () => api.get("/shipments/stats/summary"),
};

export const usersAPI = {
  getAll: () => api.get("/users"),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.patch(`/users/${id}`, data),
};

export default api;
