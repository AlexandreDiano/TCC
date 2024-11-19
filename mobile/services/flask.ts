import axios from 'axios';
import {BASE_URL, FLASK_PORT} from '@env';

const flask_api = axios.create({
    baseURL: `${BASE_URL}:${FLASK_PORT}`,
    headers: {
        "Content-Type": "application/json",
    },
});

export default flask_api;
