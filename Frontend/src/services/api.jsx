import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
    baseURL: 'https://capstone-production-bf29.up.railway.app/api',
=======
  baseURL: import.meta.env.VITE_API_URL,
>>>>>>> Jeibii
});

export default api;
