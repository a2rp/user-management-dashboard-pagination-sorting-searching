import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:1198/api/v1",
    withCredentials: true,
    headers: { Accept: "application/json" },
});

export default api;
