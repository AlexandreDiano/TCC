import axios from 'axios';
import { API_URL } from '@env';

const api = axios.create({
    baseURL: "http://192.168.100.229:3000",
});

export default api;
