<template>
    <div class="landing-page">
        <div class="hero-section">
            <el-row justify="center" align="middle">
                <el-col :xs="24" :md="12" class="hero-content">
                    <h1 class="hero-title">Play Snake Online</h1>
                    <p class="hero-subtitle">
                        Join friends! Challenge friends,
                        learn strategies, and climb the ranks.
                    </p>

                    <div class="action-buttons">
                        <el-button type="primary" size="large" @click="handleLogin" class="auth-button">
                            Login
                        </el-button>

                        <el-button type="success" size="large" @click="handleSignup" class="auth-button">
                            Sign Up Free
                        </el-button>
                    </div>
                </el-col>

                <el-col :xs="24" :md="12" class="hero-image">
                    <img src="/logos/overlay.png" style="width: 100%; max-width: 500px; height: auto;"
                        class="board-image">
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleLogin = () => {
    // Add login logic
    router.push('/login')
    console.log('Login clicked');
};

const handleSignup = () => {
    // Add signup logic

    router.push('/signup')
    console.log('Signup clicked');
};
</script>

<style scoped>
.landing-page {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.nav-menu {
    padding: 0 20px;
    position: fixed;
    width: 100%;
    z-index: 1000;
}

.logo-item {
    font-size: 1.5rem;
    font-weight: bold;
}

.logo {
    height: 40px;
    margin-right: 10px;
}

.hero-section {
    padding-top: 100px;
    min-height: calc(100vh - 60px);
    background-color: #2c3e50;
    color: white;
}

.hero-content {
    padding: 40px;
    text-align: center;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 20px;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 40px;
    color: #ecf0f1;
}

.action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.auth-button {
    padding: 20px 40px;
    font-size: 1.1rem;
}

.hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
}

.board-image {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .action-buttons {
        flex-direction: column;
    }

    .auth-button {
        width: 100%;
    }
}
</style>