import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './LandingPage.vue'
import LoginView from './Login.vue'
import SignUp from './SignUp.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignUp },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


createApp(App).
    use(router).
    mount('#app')
