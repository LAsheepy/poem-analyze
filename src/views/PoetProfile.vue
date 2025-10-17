<template>
  <div class="poet-profile">
    <!-- 左侧导航边栏 -->
    <div class="sidebar left-sidebar">
      <div class="logo">
        <h2>诗韵星</h2>
        <p>AI驱动诗词解析平台</p>
      </div>
      
      <el-menu default-active="poet-profile" class="sidebar-menu">
        <el-menu-item index="dashboard" @click="$router.push('/')">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="poems" @click="$router.push('/poems')">
          <el-icon><Notebook /></el-icon>
          <span>诗词库</span>
        </el-menu-item>
        <el-menu-item index="poet-profile" @click="$router.push('/poet-profile')">
          <el-icon><User /></el-icon>
          <span>诗人简介</span>
        </el-menu-item>
        <el-menu-item index="settings" @click="$router.push('/settings')">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="content-area">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>诗人简介</h1>
          <p>了解历代著名诗人的生平与成就</p>
        </div>

        <!-- 诗人搜索 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索诗人姓名、朝代或风格..."
            size="large"
            clearable
            class="poet-search"
            @input="filterPoets"
            @clear="clearSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 搜索结果提示 -->
        <div v-if="searchQuery" class="search-results-info">
          <el-alert
            :title="`找到 ${filteredPoets.length} 位诗人`"
            type="info"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 诗人列表 -->
        <div class="poets-grid">
          <el-card 
            v-for="poet in filteredPoets" 
            :key="poet.id" 
            class="poet-card"
            @click="selectPoet(poet)"
            :class="{ active: selectedPoet?.id === poet.id }"
          >
            <div class="poet-avatar">
              <el-avatar :size="60" :src="poet.avatar" fit="cover">
                <span class="avatar-text">{{ poet.name.charAt(0) }}</span>
              </el-avatar>
            </div>
            <div class="poet-info">
              <h3>{{ poet.name }}</h3>
              <p class="poet-dynasty">{{ poet.dynasty }}</p>
              <p class="poet-lifespan">{{ poet.lifespan }}</p>
              <el-tag :type="getTagType(poet.style)" size="small">
                {{ poet.style }}
              </el-tag>
            </div>
          </el-card>
        </div>

        <!-- 无搜索结果提示 -->
        <div v-if="searchQuery && filteredPoets.length === 0" class="no-results">
          <el-empty description="未找到相关诗人" />
        </div>

        <!-- 诗人详情 -->
        <div v-if="selectedPoet" class="poet-detail">
          <el-card class="detail-card">
            <div class="detail-header">
              <div class="detail-avatar">
                <el-avatar :size="80" :src="selectedPoet.avatar" fit="cover">
                  <span class="avatar-text">{{ selectedPoet.name.charAt(0) }}</span>
                </el-avatar>
              </div>
              <div class="detail-info">
                <h2>{{ selectedPoet.name }}</h2>
                <p class="dynasty-lifespan">{{ selectedPoet.dynasty }} · {{ selectedPoet.lifespan }}</p>
                <div class="detail-tags">
                  <el-tag v-for="tag in selectedPoet.tags" :key="tag" :type="getTagType(tag)">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="detail-content">
              <!-- 生平简介 -->
              <div class="section">
                <h3>生平简介</h3>
                <p class="biography">{{ selectedPoet.biography }}</p>
              </div>

              <!-- 代表作品 -->
              <div class="section">
                <h3>代表作品</h3>
                <div class="works-list">
                  <div 
                    v-for="work in selectedPoet.representativeWorks" 
                    :key="work.id" 
                    class="work-item"
                    @click="$router.push(`/analysis/${work.id}`)"
                  >
                    <span class="work-title">{{ work.title }}</span>
                    <el-button type="text" size="small">查看分析 →</el-button>
                  </div>
                </div>
              </div>

              <!-- 文学成就 -->
              <div class="section">
                <h3>文学成就</h3>
                <ul class="achievements">
                  <li v-for="achievement in selectedPoet.achievements" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>

              <!-- 历史评价 -->
              <div class="section">
                <h3>历史评价</h3>
                <p class="evaluation">{{ selectedPoet.evaluation }}</p>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 无选中诗人时的提示 -->
        <div v-else class="no-selection">
          <el-empty description="请选择一位诗人查看详细信息">
            <el-button type="primary">浏览诗人列表</el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  House,
  Notebook,
  User,
  Setting,
  Search
} from '@element-plus/icons-vue'

const router = useRouter()

// 搜索相关
const searchQuery = ref('')
const selectedPoet = ref<any>(null)

// 诗人数据
const poets = ref([
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    lifespan: '701年-762年',
    style: '浪漫主义',
    avatar: '',
    tags: ['诗仙', '浪漫主义', '豪放派'],
    biography: '李白，字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。其诗风豪放飘逸，想象丰富，语言流转自然，音律和谐多变。善于从民歌、神话中汲取营养，构成其特有的瑰丽绚烂的色彩，是屈原以来最具个性特色和浪漫精神的诗人。',
    representativeWorks: [
      { id: 1, title: '静夜思' },
      { id: 2, title: '望庐山瀑布' },
      { id: 3, title: '将进酒' },
      { id: 4, title: '蜀道难' }
    ],
    achievements: [
      '开创了唐代诗歌的浪漫主义风格',
      '作品被收录在《全唐诗》中，流传千古',
      '对后世文学创作产生深远影响',
      '与杜甫并称"李杜"，代表唐诗最高成就'
    ],
    evaluation: '李白的诗歌对后世产生了极为深远的影响。中唐的韩愈、孟郊、李贺，宋代的苏轼、陆游、辛弃疾，明清的高启、杨慎、龚自珍等著名诗人，都受到李白诗歌的巨大影响。'
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐代',
    lifespan: '712年-770年',
    style: '现实主义',
    avatar: '',
    tags: ['诗圣', '现实主义', '社会派'],
    biography: '杜甫，字子美，自号少陵野老，唐代伟大的现实主义诗人，与李白合称"李杜"。杜甫在中国古典诗歌中的影响非常深远，被后人称为"诗圣"，他的诗被称为"诗史"。',
    representativeWorks: [
      { id: 5, title: '春望' },
      { id: 6, title: '登高' },
      { id: 7, title: '茅屋为秋风所破歌' },
      { id: 8, title: '兵车行' }
    ],
    achievements: [
      '开创了唐代诗歌的现实主义风格',
      '作品深刻反映社会现实和人民疾苦',
      '诗歌艺术成就达到古典诗歌的巅峰',
      '对后世现实主义文学影响深远'
    ],
    evaluation: '杜甫的诗歌在语言上，普遍认为具有"沉郁"的特点，语言和篇章结构又富于变化，讲求炼字炼句。他的诗歌对元白的"新乐府运动"的文艺思想及李商隐的近体讽喻时事诗影响甚深。'
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋代',
    lifespan: '1037年-1101年',
    style: '豪放派',
    avatar: '',
    tags: ['东坡居士', '豪放派', '文学家'],
    biography: '苏轼，字子瞻，号东坡居士，北宋著名文学家、书法家、画家。苏轼是宋代文学最高成就的代表，并在诗、词、散文、书、画等方面取得了很高的成就。',
    representativeWorks: [
      { id: 9, title: '水调歌头·明月几时有' },
      { id: 10, title: '念奴娇·赤壁怀古' },
      { id: 11, title: '江城子·密州出猎' },
      { id: 12, title: '前赤壁赋' }
    ],
    achievements: [
      '开创宋词豪放派风格',
      '诗、词、散文、书法、绘画俱佳',
      '对后世文学艺术产生深远影响',
      '作品被收录在《苏东坡全集》中'
    ],
    evaluation: '苏轼在文、诗、词三方面都达到了极高的造诣，堪称宋代文学最高成就的代表。而且苏轼的创造性活动不局限于文学，他在书法、绘画等领域内的成就都很突出，对医药、烹饪、水利等技艺也有所贡献。'
  },
  {
    id: 4,
    name: '李清照',
    dynasty: '宋代',
    lifespan: '1084年-1155年',
    style: '婉约派',
    avatar: '',
    tags: ['易安居士', '婉约派', '女词人'],
    biography: '李清照，号易安居士，宋代女词人，婉约词派代表，有"千古第一才女"之称。李清照出生于书香门第，早期生活优裕，其父李格非藏书甚富。',
    representativeWorks: [
      { id: 13, title: '声声慢·寻寻觅觅' },
      { id: 14, title: '如梦令·常记溪亭日暮' },
      { id: 15, title: '醉花阴·薄雾浓云愁永昼' },
      { id: 16, title: '一剪梅·红藕香残玉簟秋' }
    ],
    achievements: [
      '宋代婉约词派的代表人物',
      '中国文学史上最重要的女词人',
      '作品情感真挚，语言优美',
      '对后世女性文学创作影响深远'
    ],
    evaluation: '李清照的词，在宋代词苑中，独树一帜，自名一家，对中国词史的发展具有重大影响。她的人格像她的作品一样令人崇敬。她既有巾帼之淑贤，更兼须眉之刚毅；既有常人愤世之感慨，又具崇高的爱国情怀。'
  }
])

// 过滤诗人列表
const filteredPoets = computed(() => {
  if (!searchQuery.value) {
    return poets.value
  }
  return poets.value.filter(poet => 
    poet.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    poet.dynasty.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    poet.style.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 选择诗人
const selectPoet = (poet: any) => {
  selectedPoet.value = poet
}

// 获取标签类型
const getTagType = (style: string) => {
  const typeMap: Record<string, any> = {
    '浪漫主义': 'success',
    '现实主义': 'warning',
    '豪放派': 'danger',
    '婉约派': 'info'
  }
  return typeMap[style] || 'primary'
}

// 过滤诗人
const filterPoets = () => {
  // 搜索功能已在computed中实现
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
}

onMounted(() => {
  // 默认选择第一个诗人
  if (poets.value.length > 0) {
    selectedPoet.value = poets.value[0]
  }
})
</script>

<style scoped>
.poet-profile {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.left-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e4e7ed;
  padding: 20px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.logo {
  text-align: center;
  padding: 0 20px 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.logo h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.logo p {
  margin: 5px 0 0;
  color: #909399;
  font-size: 12px;
}

.sidebar-menu {
  border: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  margin-left: 200px;
  padding: 0;
}

.content-area {
  padding: 24px;
  overflow-y: auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  color: #303133;
  font-size: 32px;
}

.page-header p {
  margin: 8px 0 0;
  color: #909399;
  font-size: 16px;
}

.search-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.search-results-info {
  margin-bottom: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.no-results {
  text-align: center;
  padding: 40px 0;
}

.poet-search {
  width: 400px;
}

.poet-search :deep(.el-input__wrapper) {
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.poet-card {
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.poet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.poet-card.active {
  border-color: #409eff;
  background: #f0f7ff;
}

.poet-avatar {
  text-align: center;
  margin-bottom: 16px;
}

.avatar-text {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.poet-info {
  text-align: center;
}

.poet-info h3 {
  margin: 0 0 8px;
  color: #303133;
  font-size: 18px;
}

.poet-dynasty {
  margin: 0 0 4px;
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
}

.poet-lifespan {
  margin: 0 0 12px;
  color: #909399;
  font-size: 12px;
}

.poet-detail {
  margin-top: 32px;
}

.detail-card {
  padding: 24px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.detail-avatar .avatar-text {
  font-size: 32px;
}

.detail-info h2 {
  margin: 0 0 8px;
  color: #303133;
  font-size: 24px;
}

.dynasty-lifespan {
  margin: 0 0 12px;
  color: #909399;
  font-size: 14px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-content {
  max-width: 800px;
}

.section {
  margin-bottom: 32px;
}

.section h3 {
  margin: 0 0 16px;
  color: #303133;
  font-size: 18px;
  border-left: 4px solid #409eff;
  padding-left: 12px;
}

.biography {
  line-height: 1.8;
  color: #606266;
  font-size: 14px;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.work-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.work-item:hover {
  background: #e9ecef;
}

.work-title {
  font-weight: 500;
  color: #303133;
}

.achievements {
  padding-left: 20px;
  color: #606266;
  line-height: 1.8;
}

.achievements li {
  margin-bottom: 8px;
}

.evaluation {
  line-height: 1.8;
  color: #606266;
  font-size: 14px;
  font-style: italic;
}

.no-selection {
  text-align: center;
  padding: 60px 0;
}

@media (max-width: 768px) {
  .poets-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
  }
  
  .poet-search {
    width: 100%;
  }
}
</style>