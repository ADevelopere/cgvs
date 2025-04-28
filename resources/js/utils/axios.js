import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add the auth token
instance.interceptors.request.use(
    (config) => {
        // Don't override Content-Type if it's already set (like for multipart/form-data)
        if (config.headers['Content-Type']) {
            const originalHeaders = { ...config.headers };
            config.headers = {
                ...instance.defaults.headers,
                ...originalHeaders
            };
        }
        
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        
        // Handle authentication errors
        if (status === 401 || status === 419) {
            localStorage.removeItem('auth_token');
            
            // Only redirect to login if we're not already there and not trying to login
            const isLoginRequest = error.config.url === '/login';
            const isOnLoginPage = window.location.pathname.includes('/login');
            
            if (!isLoginRequest && !isOnLoginPage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
