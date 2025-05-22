<template>
  <el-menu default-active="0" class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <el-menu-item index="0">
      <img style="width: 48px" src="/logos/logo.png" alt="Element logo" />
    </el-menu-item>

    <el-menu-item index="1" @click="$router.push('/dashboard')">Dashboard</el-menu-item>
    <el-menu-item index="5" v-if="authState.isAuthenticated" @click="logout">Logout</el-menu-item>
    <el-menu-item index="5" v-if="!authState.isAuthenticated" @click="logout">Login</el-menu-item>
    <el-menu-item index="6" v-if="!authState.isAuthenticated" @click="$router.push('/signup')">Sign Up</el-menu-item>
    <el-menu-item index="5" v-if="authState.isAuthenticated" @click="$router.push('/settings')">Settings</el-menu-item>

  </el-menu>
  <main style="padding: 10px;">
    <RouterView />
  </main>
</template>


<script setup>
import { authState } from '../authState';
import { ref } from "vue";

import { fetchWithAuth } from '../fetchWithAuth.js';

import { backendUrl } from "../config";

import { useRoute, useRouter } from 'vue-router'

const loading = ref(false);



function logout() {
  authState.logout();

  window.location.href = '/login'; // Or use router.push('/login') if you're using Vue Router
}


</script>