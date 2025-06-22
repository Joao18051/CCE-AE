import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear local storage and redirect to login
        localStorage.clear();
        window.location.href = '/';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ message: 'Erro de conexão com o servidor' });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({ message: 'Erro ao processar requisição' });
    }
  }
);

// Conversion History API
export const saveConversionHistory = async (data) => {
  const res = await api.post('/conversion-history', data);
  return res.data;
};

export const getConversionHistory = async () => {
  const res = await api.get('/conversion-history');
  return res.data;
};

export default api; 