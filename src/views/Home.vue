<template>
  <div class="home">
    <h1>诗韵星 - AI驱动诗词解析平台</h1>
    <p>欢迎使用诗韵星平台！</p>
    <el-button type="primary" @click="goToDashboard">进入工作台</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h1 {
  color: #409eff;
  margin-bottom: 20px;
}

p {
  color: #606266;
  margin-bottom: 30px;
}
</style>