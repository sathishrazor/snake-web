<template>
  <el-menu default-active="0" class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <el-menu-item index="0">
      <img style="width: 48px" src="/logos/logo.png" alt="Element logo" />
    </el-menu-item>
  </el-menu>
  <main style="padding: 10px;">
    <RouterView />
  </main>
</template>