<template>
  <el-menu default-active="0" class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <el-menu-item index="0">
      <img style="width: 32px" src="/images/tile_0_0.jpg" alt="Element logo" />
    </el-menu-item>
    <el-menu-item index="1">User Registration</el-menu-item>

  </el-menu>
  <main style="padding: 10px;">
    <RouterView />
  </main>
</template>