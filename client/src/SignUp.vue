<template>

  <el-page-header>

    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          Home
        </el-breadcrumb-item>

        <el-breadcrumb-item>SignUp</el-breadcrumb-item>
      </el-breadcrumb>
    </template>

  </el-page-header>

  <el-row>

    <el-col :span="12">
      <div class="signup-container">
        <el-card>
          <h2 style="text-align: center; margin-bottom: 24px">Sign Up</h2>
          <el-form :model="form" :rules="rules" ref="signupForm" label-width="150px"
            @submit.native.prevent="handleSignUp">
            <el-form-item label="Username" prop="username">
              <el-input v-model="form.username" autocomplete="username" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" autocomplete="email" />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input v-model="form.password" type="password" autocomplete="new-password" show-password />
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" autocomplete="new-password" show-password />
            </el-form-item>

            <el-form-item label="Profile Avatar" prop="confirmPassword">
              <el-row>
                <el-col :span="3" v-for="item in icons" :key="item.value">
                  <div class="grid-content">
                    <img :src="item.value" class="icon-item" alt="" @click="form.profile_thumb = item.value"
                      style="width: 72px; height: 72px;" />
                  </div>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSignUp">Register</el-button>
            </el-form-item>
            <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom: 12px" />
            <el-alert v-if="success" title="Registration successful!" type="success" show-icon
              style="margin-bottom: 12px" />
          </el-form>
        </el-card>
      </div>
    </el-col>
  </el-row>


</template>

<script>
import { backendUrl } from "./config";
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

    const validatePassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("Passwords do not match"));
      } else {
        callback();
      }
    };

    const icons = []


    for (let i = 0; i <= 5; i++) {
      for (let j = 0; j <= 7; j++) {
        icons.push({
          label: `Icon ${i}_${j}`,
          value: `/images/tile_${i}_${j}.jpg`
        });
      }
    }


    return {
      icons,
      form: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profile_thumb: ""
      },
      rules: {
        username: [{ required: true, message: "Username is required", trigger: "blur" }],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        password: [
          { required: true, message: "Password is required", trigger: "blur" },
          { min: 6, message: "Password must be at least 6 characters", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "Please confirm your password", trigger: "blur" },
          { min: 6, message: "Password must be at least 6 characters", trigger: "blur" },
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        profile_thumb: [
          { required: true, message: "Please select a profile avatar", trigger: "blur" }
        ]
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
          const response = await fetch(`${backendUrl}/auth/register`, {
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
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);

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
  max-width: 800px;
  margin: 40px auto;
}

.icon-item:hover {
  cursor: pointer;
  border: 1px solid #fb0101;
}
</style>
