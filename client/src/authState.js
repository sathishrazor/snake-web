// src/authState.js
import { reactive } from 'vue';
import { fetchWithAuth } from './fetchWithAuth.js';

export const authState = reactive({
    isAuthenticated: !!localStorage.getItem('token'),

    login(token) {
        localStorage.setItem('token', token);
        authState.isAuthenticated = true;
    },

    logout() {
        localStorage.removeItem('token');
        authState.isAuthenticated = false;
    },

    getUser() {

        var token = localStorage.getItem('token');
        if (token) {
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));

            return decodedPayload;
        }
    },

    async getUserInfo() {
        const token = localStorage.getItem('token');
        if (token) {

            const response = await fetchWithAuth('http://localhost:3000/api/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.json();
        }
        return null;
    }

});
