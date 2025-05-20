// src/authState.js
import { reactive } from 'vue';

export const authState = reactive({
    isAuthenticated: !!localStorage.getItem('token'),

    login(token) {
        localStorage.setItem('token', token);
        authState.isAuthenticated = true;
    },

    logout() {
        localStorage.removeItem('token');
        authState.isAuthenticated = false;
    }
});
