<template>
  <el-dialog
    v-model="visible"
    title="n8n工作流配置"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="Webhook URL" required>
        <el-input
          v-model="form.webhookUrl"
          placeholder="请输入n8n工作流的Webhook URL"
          @change="handleUrlChange"
        />
        <div class="form-tip">
          在n8n工作流中创建的Webhook节点的URL地址
        </div>
      </el-form-item>
      
      <el-form-item label="API密钥">
        <el-input
          v-model="form.apiKey"
          type="password"
          placeholder="可选：如果需要认证的API密钥"
          show-password
        />
        <div class="form-tip">
          如果n8n工作流需要API密钥认证，请在此输入
        </div>
      </el-form-item>
      
      <el-form-item label="启用n8n">
        <el-switch
          v-model="form.useN8N"
          active-text="启用"
          inactive-text="禁用"
          @change="handleToggleN8N"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleTestConnection" :loading="testing">
          测试连接
        </el-button>
        <el-button type="success" @click="handleSave" :loading="saving">
          保存配置
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { n8nService } from '@/services/n8nService'
import { chatService } from '@/services/chatService'

interface N8NConfigForm {
  webhookUrl: string
  apiKey: string
  useN8N: boolean
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'configChanged': []
}>()

const visible = ref(false)
const testing = ref(false)
const saving = ref(false)

const form = reactive<N8NConfigForm>({
  webhookUrl: '',
  apiKey: '',
  useN8N: false
})

// 初始化表单数据
const initForm = () => {
  const config = n8nService.getConfig()
  form.webhookUrl = config.webhookUrl
  form.apiKey = config.apiKey || ''
  form.useN8N = config.useN8N
}

// 处理对话框显示/隐藏
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    initForm()
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// URL变化处理
const handleUrlChange = (value: string) => {
  if (value && !value.startsWith('http')) {
    ElMessage.warning('请输入有效的URL地址')
  }
}

// 切换n8n状态
const handleToggleN8N = (useN8N: boolean) => {
  if (useN8N && !form.webhookUrl) {
    ElMessage.warning('请先配置Webhook URL')
    form.useN8N = false
    return
  }
}

// 测试连接
const handleTestConnection = async () => {
  if (!form.webhookUrl) {
    ElMessage.warning('请先输入Webhook URL')
    return
  }

  testing.value = true
  try {
    // 临时配置n8n服务
    n8nService.configure({
      webhookUrl: form.webhookUrl,
      apiKey: form.apiKey,
      useN8N: true
    })
    
    const isConnected = await n8nService.testConnection()
    
    if (isConnected) {
      ElMessage.success('n8n工作流连接成功！')
    } else {
      ElMessage.error('n8n工作流连接失败，请检查URL和配置')
    }
  } catch (error) {
    console.error('连接测试失败:', error)
    ElMessage.error('连接测试失败：' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    testing.value = false
  }
}

// 保存配置
const handleSave = async () => {
  if (form.useN8N && !form.webhookUrl) {
    ElMessage.warning('启用n8n模式需要配置Webhook URL')
    return
  }

  saving.value = true
  try {
    // 保存配置到n8n服务
    n8nService.configure({
      webhookUrl: form.webhookUrl,
      apiKey: form.apiKey,
      useN8N: form.useN8N
    })
    
    // 同步到聊天服务
    chatService.toggleServiceMode(form.useN8N)
    
    ElMessage.success('配置保存成功！')
    emit('configChanged')
    handleClose()
  } catch (error) {
    console.error('配置保存失败:', error)
    ElMessage.error('配置保存失败：' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>