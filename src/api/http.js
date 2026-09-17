import axios from 'axios';
import { getToken, clearToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const http = axios.create({
    baseURL: BASE_URL,
    timeout:30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

http.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>  Promise.reject(error)

);

export class ApiError extends Error {
    constructor({message, status, code,errors, isNetwork, isCancel}) {
        super(message);
        this.name = 'ApiError';
        this.status = status ?? null;
        this.code = code ?? null;
        this.errors = errors ?? null;
        this.isNetwork = Boolean(isNetwork) ;
        this.isCancel = Boolean(isCancel) ;
    }
}

http.interceptors.response.use(
    (response) =>{
        // Binary responses (PDF downloads) must pass through untouched - there is
        // no JSON envelope to unwrap.
        const responseType = response.config.responseType;
        if (responseType === 'blob' || responseType === 'arraybuffer') {
            return response;
        }
        const body = response.data;
        // The backend wraps everything as {success,message, ...payload}. we handle the payload straight back so callers get the data, not hte envelope.
        if (body && typeof body === 'object' && 'success'in body) {
            const {success, message, ...rest} = body;
            return rest;
        }
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(new ApiError({message: 'Request canceled', isCancel: true}));
        }
        if (!error.response) {
            const isTimeout = error.code === 'ECONNABORTED';
            return Promise.reject(new ApiError({message: isTimeout ? 'Request timeout' : 'Network error', isNetwork: true}));
        }

        const {status, data} = error.response;

        const isLoginCall = error.config.url.includes('/auth/login');
        if (status === 401 && !isLoginCall) {
            clearToken();

            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                const next = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.assign(`/login?session=expired&next=${next}`);
            }
        }

        return Promise.reject(
            new ApiError({message: data?.message ?? `Request failed (${status})`, status, code: data?.code, errors: data?.errors}));
    }
);

export default http;
