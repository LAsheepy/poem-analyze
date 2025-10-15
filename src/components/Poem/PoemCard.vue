<template>
  <el-card class="poem-card" shadow="hover" @click="handleClick">
    <template #header>
      <div class="poem-header">
        <h3 class="poem-title">{{ poem.title }}</h3>
        <div class="poem-meta">
          <span class="author">{{ poem.author }}</span>
          <el-tag size="small" :type="getDifficultyType(poem.difficulty)">
            {{ getDifficultyText(poem.difficulty) }}
          </el-tag>
        </div>
      </div>
    </template>
    
    <div class="poem-content">
      <p v-for="(line, index) in poem.content.slice(0, 3)" :key="index" class="poem-line">
        {{ line }}
      </p>
      <p v-if="poem.content.length > 3" class="poem-more">...</p>
    </div>
    
    <template #footer>
      <div class="poem-footer">
        <div class="poem-tags">
          <el-tag 
            v-for="tag in poem.tags.slice(0, 3)" 
            :key="tag" 
            size="small" 
            type="info"
          >
            {{ tag }}
          </el-tag>
        </div>
        <div class="poem-stats">
          <span class="views">
            <el-icon><View /></el-icon>
            {{ poem.views || 0 }}
          </span>
          <span class="likes">
            <el-icon><Star /></el-icon>
            {{ poem.likes || 0 }}
          </span>
        </div>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { View, Star } from '@element-plus/icons-vue'
import type { Poem } from '@/lib/supabase'

interface Props {
  poem: Poem
}

interface Emits {
  (e: 'click', poem: Poem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getDifficultyType = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'success'
    case 'medium': return 'warning'
    case 'hard': return 'danger'
    default: return 'info'
  }
}

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '简单'
    case 'medium': return '中等'
    case 'hard': return '困难'
    default: return difficulty
  }
}

const handleClick = () => {
  emit('click', props.poem)
}
</script>

<style scoped>
.poem-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  border-radius: 8px;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.poem-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.poem-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.author {
  font-size: 12px;
  color: #7f8c8d;
}

.poem-content {
  min-height: 80px;
}

.poem-line {
  margin: 4px 0;
  font-size: 14px;
  color: #34495e;
  line-height: 1.6;
}

.poem-more {
  margin: 4px 0;
  font-size: 12px;
  color: #95a5a6;
  font-style: italic;
}

.poem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.poem-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.poem-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #7f8c8d;
}

.poem-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-card__header) {
  padding: 12px 16px;
}

:deep(.el-card__body) {
  padding: 12px 16px;
}

:deep(.el-card__footer) {
  padding: 8px 16px;
}
</style>