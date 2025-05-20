<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-illustration">
        <img src="/logos/overlay.png" alt="Login Illustration" />
      </div>
      <div class="login-form">
        <h2>Login</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="form">
          <el-form-item label="Username">
            <el-input v-model="loginForm.username" placeholder="Enter your username" />
          </el-form-item>

          <el-form-item label="Password">
            <el-input v-model="loginForm.password" type="password" placeholder="Enter your password" />
          </el-form-item>

          <div class="form-links">
            <el-link type="primary" underline="never">Forgot your password?</el-link>
          </div>

          <el-button type="primary" class="login-button" @click="submitForm">Log in</el-button>

          <div class="extra-options">

            <p>Don't have an account yet? <el-link type="primary" href="/signup" underline="never">Sign up
                now!</el-link></p>
            <el-link type="info" underline="never">Contact us</el-link>
          </div>
        </el-form>
      </div>
    </div>
    <footer class="footer">
      <p>Copyright © 2025 SnakeWeb. All rights reserved.
        <el-link type="info" underline="never">Terms of Service</el-link> |
        <el-link type="info" underline="never">Privacy Policy</el-link> |
        <el-link type="info" underline="never">Acceptable Use Policy</el-link>
      </p>
    </footer>
  </div>


</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { backendUrl } from "../config";
import { authState } from '../authState';
const router = useRouter()


const loginForm = ref({
  username: "",
  password: "",
});

const loading = ref(false);
const loginFormRef = ref(null);

const rules = {
  username: [{ required: true, message: "Please input username", trigger: "blur" }],
  password: [{ required: true, message: "Please input password", trigger: "blur" }],
};

const submitForm = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      // Simulate login
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm.value),
      });
      loading.value = false;
      if (!response.ok) {
        const data = await response.json();

        ElMessage.error(`Oops, ${data.error}.`)

      } else {

        ElNotification({
          title: 'Success',
          message: 'Login successful!',
          duration: 2000,
          type: 'success',
        })

        const data = await response.json();
        console.log(data);
        authState.login(data.token);

        router.push('/dashboard');

      }


    }
  });
};
</script>




<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-box {
  display: flex;
  flex: 1;
  max-width: 900px;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-illustration {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-illustration img {
  max-width: 100%;
  height: auto;
}

.login-form {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h2 {
  margin-bottom: 1.5rem;
}

.form {
  width: 100%;
}

.form-links {
  margin-bottom: 1rem;
  text-align: right;
}

.login-button {
  width: 100%;
  margin-bottom: 1rem;
}

.extra-options {
  text-align: center;
}

.footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.875rem;
  background-color: #f9f9f9;
  color: #777;
}

.footer el-link {
  margin: 0 0.5rem;
}
</style>
