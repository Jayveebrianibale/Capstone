import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const register = (name, email, password) => {
  return axios.post(`${API_URL}/register`, { name, email, password });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const verifyCode = (email, code) => {
  return axios.post(`${API_URL}/verify-code`, { email, code });
};

const authService = {
  register,
  login,
  verifyCode,
};

export default authService;
