import axios from 'axios';
import { BASE_URL, API_PORT } from '@env';

const api = axios.create({
    baseURL: `${BASE_URL}:${API_PORT}`,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
