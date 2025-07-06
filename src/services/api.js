import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'Erro de conexão com o servidor' });
    } else {
      return Promise.reject({ message: 'Erro ao processar requisição' });
    }
  }
);

export const saveConversionHistory = async (data) => {
  const res = await api.post('/auth/conversion-history', data);
  return res.data;
};

export const getConversionHistory = async () => {
  const res = await api.get('/auth/conversion-history');
  return res.data;
};

export const sendChatMessage = async (message) => {
  const res = await api.post('/chatbot/chat', { message });
  return res.data.reply;
};

export default api; 