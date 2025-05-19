<template>
  <el-row justify="center" align="middle" style="height: 100vh">
    <el-col :span="8">
      <el-card>
        <h2 style="text-align: center">Login</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-position="top">
          <el-form-item label="Username" prop="username">
            <el-input v-model="loginForm.username" autocomplete="username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              autocomplete="current-password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="loading" style="width: 100%"
              >Login</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";

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

const onSubmit = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // Simulate login
      setTimeout(() => {
        loading.value = false;
        // Handle successful login here
        // e.g., redirect or show message
      }, 1000);
    }
  });
};
</script>

<style scoped>
.el-card {
  padding: 32px 24px;
}
</style>
