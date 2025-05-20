// src/fetchWithAuth.js

export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `${token}` } : {}),
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers,
    };

    return fetch(url, config);
}
