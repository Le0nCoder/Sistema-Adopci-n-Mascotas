import axios from 'axios';

// Creamos una instancia de Axios apuntando al puerto de tu backend
const API = axios.create({
    baseURL: 'http://localhost:5000/api' 
});

// Este "interceptor" adjuntará automáticamente el token JWT a todas las peticiones futuras
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;