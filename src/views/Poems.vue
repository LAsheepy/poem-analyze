<template>
  <div class="poems-page">
    <div class="page-header">
      <h1 class="page-title">诗词库</h1>
      <p class="page-subtitle">探索经典诗词，感受中华文化魅力</p>
    </div>

    <div class="page-content">
      <PoemList :poems="poems" title="全部诗词" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PoemList from '@/components/Poem/PoemList.vue'
import { generateMockPoems } from '@/utils/mockData'
import { supabase } from '@/lib/supabase'

const poems = ref<any[]>([])

onMounted(async () => {
  await loadPoems()
})

const loadPoems = async () => {
  try {
    // 首先尝试从Supabase加载数据
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('加载诗词数据失败:', error)
      // 如果数据库为空，使用模拟数据
      poems.value = generateMockPoems()
    } else if (data && data.length > 0) {
      poems.value = data
    } else {
      poems.value = generateMockPoems()
    }
  } catch (error) {
    console.error('加载诗词数据异常:', error)
    poems.value = generateMockPoems()
  }
}
</script>

<style scoped>
.poems-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.page-title {
  margin: 0 0 12px 0;
  font-size: 36px;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-content {
    padding: 20px 16px;
  }
}
</style>