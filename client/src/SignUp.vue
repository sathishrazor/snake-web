<template>
  <div class="signup-container">
    <el-card>
      <h2 style="text-align: center; margin-bottom: 24px">Sign Up</h2>
      <el-form
        :model="form"
        :rules="rules"
        ref="signupForm"
        label-width="100px"
        @submit.native.prevent="handleSignUp"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" autocomplete="username" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" autocomplete="email" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            show-password
          />
        </el-form-item>

        <el-form-item label="confirmPassword" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSignUp">Register</el-button>
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom: 12px" />
        <el-alert
          v-if="success"
          title="Registration successful!"
          type="success"
          show-icon
          style="margin-bottom: 12px"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    const validateEmail = (rule, value, callback) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        callback(new Error("Email is required"));
      } else if (!re.test(value)) {
        callback(new Error("Please input a valid email"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        email: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "Username is required", trigger: "blur" }],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        password: [
          { required: true, message: "Password is required", trigger: "blur" },
          { min: 6, message: "Password must be at least 6 characters", trigger: "blur" },
        ],
      },
      error: "",
      success: false,
    };
  },
  methods: {
    handleSignUp() {
      this.error = "";
      this.success = false;
      this.$refs.signupForm.validate(async (valid) => {
        if (!valid) return;
        try {
          const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.form),
          });
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Registration failed");
          }
          this.success = true;
          this.form.username = "";
          this.form.email = "";
          this.form.password = "";
          this.$refs.signupForm.resetFields();
        } catch (err) {
          this.error = err.message;
        }
      });
    },
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 40px auto;
}
</style>
