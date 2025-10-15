<template>
  <div class="avatar-upload">
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
      accept="image/*"
    >
      <el-avatar 
        v-if="imageUrl" 
        :size="size" 
        :src="imageUrl" 
        :alt="alt"
      />
      <el-avatar 
        v-else 
        :size="size" 
        :src="currentAvatar" 
        :alt="alt"
      >
        {{ alt.charAt(0).toUpperCase() }}
      </el-avatar>
      <template #trigger>
        <div class="upload-overlay">
          <el-icon><Camera /></el-icon>
        </div>
      </template>
    </el-upload>
    
    <div v-if="uploading" class="upload-progress">
      <el-progress 
        :percentage="uploadProgress" 
        :status="uploadStatus"
        :show-text="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Camera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { uploadAvatar } from '@/utils/supabaseHelpers'

interface Props {
  size?: number
  alt?: string
  currentAvatar?: string
  userId: string
}

interface Emits {
  (e: 'upload-success', avatarUrl: string): void
  (e: 'upload-error', error: Error): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 80,
  alt: '用户头像'
})

const emit = defineEmits<Emits>()

const imageUrl = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref<'success' | 'exception' | undefined>()

const beforeUpload = (file: File) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('头像图片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleUpload = async (options: any) => {
  const { file } = options
  
  try {
    uploading.value = true
    uploadProgress.value = 30
    
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)
    
    // 实际上传
    const avatarUrl = await uploadAvatar(file, props.userId)
    
    clearInterval(progressInterval)
    uploadProgress.value = 100
    uploadStatus.value = 'success'
    
    imageUrl.value = avatarUrl
    
    // 延迟显示成功消息
    setTimeout(() => {
      ElMessage.success('头像上传成功!')
      emit('upload-success', avatarUrl)
      uploading.value = false
      uploadProgress.value = 0
      uploadStatus.value = undefined
    }, 500)
    
  } catch (error: any) {
    uploading.value = false
    uploadProgress.value = 0
    uploadStatus.value = 'exception'
    
    ElMessage.error('头像上传失败: ' + error.message)
    emit('upload-error', error)
  }
}
</script>

<style scoped>
.avatar-upload {
  position: relative;
  display: inline-block;
}

.avatar-uploader {
  position: relative;
  display: inline-block;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.avatar-uploader:hover .upload-overlay {
  opacity: 1;
}

.upload-overlay .el-icon {
  color: white;
  font-size: 20px;
}

.upload-progress {
  position: absolute;
  bottom: -10px;
  left: 10%;
  right: 10%;
  width: 80%;
}
</style>