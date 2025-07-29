import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse, AxiosHeaders } from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const isDev: boolean = process.env.NODE_ENV === 'development';
const logEnbled = true;
const log = (...args: unknown[]): void => {
  if (isDev && logEnbled) {
    console.log(...args);
  }
};


// Request interceptor to add the auth token
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (!(config.headers instanceof AxiosHeaders)) {
            config.headers = new AxiosHeaders(config.headers);
        }

        const contentType = config.headers.get('Content-Type');
        if (contentType) {
            // Reset headers while preserving Content-Type
            const defaultHeaders = instance.defaults.headers;
            Object.entries(defaultHeaders).forEach(([key, value]) => {
                if (key.toLowerCase() !== 'content-type') {
                    config.headers.set(key, value as string);
                }
            });
        }
        
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        log('Making request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            baseURL: config.baseURL
        });

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        log('Response received:', {
            url: response.config.url,
            status: response.status,
            headers: response.headers
        });
        return response;
    },
    (error: AxiosError) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message
        });

        const status = error.response?.status;
        
        // Handle authentication errors
        if (status === 401 || status === 419) {
            localStorage.removeItem('auth_token');
            
            // Only redirect to login if we're not already there and not trying to login
            const isLoginRequest = error.config?.url === '/login';
            const isOnLoginPage = window.location.pathname.includes('/login');
            
            if (!isLoginRequest && !isOnLoginPage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
