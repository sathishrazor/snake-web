import './assets/main.css'

import { createApp } from 'vue'
import App from './Views/App.vue'

import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './Views/LandingPage.vue'
import LoginView from './Views/Login.vue'
import SignUp from './Views/SignUp.vue'
import Dashboard from './Views/Dashboard.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignUp },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});


createApp(App).
    use(router).
    mount('#app')
