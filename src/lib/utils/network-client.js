import axios from 'axios';
import { getFromLocalStorage, removeFromLocalStorage } from './storage-utils';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = getFromLocalStorage('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration and unauthorized errors
apiClient.interceptors.response.use(
    (response) => {
        // Check if response has token expiration error (even with 200 status)
        const data = response.data;

        // Handle case where backend returns 200 but with token error
        if (
            data &&
            data.success === false &&
            (data.error?.code === 'TOKEN_INVALID' ||
                data.error?.code === 'TOKEN_EXPIRED' ||
                data.message?.toLowerCase().includes('token') &&
                (data.message?.toLowerCase().includes('invalid') ||
                    data.message?.toLowerCase().includes('expired')))
        ) {
            console.log('Token expired or invalid (from response data). Logging out...');

            // Clear all authentication data from localStorage
            removeFromLocalStorage('accessToken');
            removeFromLocalStorage('refreshToken');
            removeFromLocalStorage('auth-storage');

            // Redirect to login page
            window.location.href = '/auth/login';

            // Return the response as-is (redirect will happen anyway)
            return response;
        }

        // If response is successful, just return it
        return response;
    },
    (error) => {
        // Check if error is due to authentication (401 Unauthorized)
        // Note: 403 Forbidden means user is authenticated but lacks permission (authorization error)
        // Only 401 means token is invalid/expired (authentication error)
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            // Check for 401 (Unauthorized) OR 403 (Forbidden) with Token Error
            const isTokenError =
                status === 401 ||
                (status === 403 &&
                    data &&
                    (data.error?.code === 'TOKEN_INVALID' ||
                        data.error?.code === 'TOKEN_EXPIRED' ||
                        data.message?.toLowerCase().includes('token')));

            if (isTokenError) {
                // Check if this is a login attempt (don't redirect if user is trying to login)
                const isLoginAttempt = error.config?.url?.includes('/auth/login');

                if (!isLoginAttempt) {
                    // Token is invalid or expired
                    console.log(
                        `Token expired or invalid (${status} status). Logging out...`
                    );

                    // Clear all authentication data from localStorage
                    removeFromLocalStorage('accessToken');
                    removeFromLocalStorage('refreshToken');
                    removeFromLocalStorage('auth-storage');

                    // Redirect to login page
                    window.location.href = '/auth/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export const requestHandler = async (url, options = {}) => {
    try {
        const { method = 'GET', body, headers, params } = options;

        const config = {
            method,
            url,
            params,
            headers,
        };

        if (body) {
            config.data = body;
        }

        const response = await apiClient(config);

        // Check if response contains token error (interceptor will handle redirect)
        const data = response.data;
        if (
            data &&
            data.success === false &&
            (data.error?.code === 'TOKEN_INVALID' ||
                data.error?.code === 'TOKEN_EXPIRED')
        ) {
            // Interceptor has already handled logout/redirect
            // Just return the error response
            return data;
        }

        // Return the response data directly (backend should return {success, data, message})
        return response.data;
    } catch (error) {
        // If it's a 401 error, the response interceptor has already handled it
        // (cleared localStorage and redirected to login), UNLESS it was a login attempt
        if (error.response?.status === 401) {
            // If it was a login attempt, we want to return the actual error response
            // so the login page can display "Invalid credentials"
            if (error.response.config?.url?.includes('/auth/login')) {
                return error.response.data;
            }

            // Otherwise, don't process further as interceptor handled redirect
            return {
                success: false,
                statusCode: 401,
                message: 'Unauthorized - Session expired',
            };
        }

        // Handle other axios errors (including 403 - permission denied)
        if (error.response?.data) {
            // Backend returned an error response
            return error.response.data;
        }

        // Network or other error
        return {
            success: false,
            statusCode: error.response?.status || 500,
            message: error.message || 'Network Error',
            error: {
                code: error.code || 'ERR_UNKNOWN',
                details: error.stack || '',
            },
        };
    }
};

export default apiClient;
