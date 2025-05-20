import axios from 'axios';

const api = axios.create({
    baseURL: 'https://capstone-production-bf29.up.railway.app/api',
});

export default api;
