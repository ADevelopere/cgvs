import 'bootstrap';
import axios, { AxiosStatic, InternalAxiosRequestConfig } from 'axios';

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    axios: AxiosStatic;
    Pusher?: any; // Only if you plan to use Pusher
    Echo?: any; // Only if you plan to use Laravel Echo
  }
}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true; // Enable sending cookies with requests

// Add a request interceptor to add the bearer token
axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage if it exists
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

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';
// import Pusher from 'pusher-ts';

// Uncomment and properly type if you need Pusher/Echo functionality
// interface PusherConfig {
//     broadcaster: 'pusher';
//     key: string;
//     cluster: string;
//     wsHost: string;
//     wsPort: number;
//     wssPort: number;
//     forceTLS: boolean;
//     enabledTransports: string[];
// }

// window.Pusher = Pusher;
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
//     wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// } as PusherConfig);
