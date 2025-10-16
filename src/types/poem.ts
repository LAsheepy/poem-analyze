// 诗词相关类型定义
export interface Poem {
  id: string
  title: string
  author: string
  dynasty: string
  content: string[]
  translation: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

export interface PoemAnalysis {
  id: string
  poemId: string
  userId: string
  wordAnalysis: WordAnalysis
  imageryAnalysis: ImageryAnalysis
  overallAnalysis: OverallAnalysis
  authorInfo: AuthorInfo
  historicalContext: HistoricalContext
  createdAt: string
  updatedAt: string
}

export interface WordAnalysis {
  difficultWords: DifficultWord[]
  rhetoricalDevices: RhetoricalDevice[]
  wordUsage: WordUsage[]
  annotations: Annotation[]
}

export interface DifficultWord {
  word: string
  pinyin: string
  meaning: string
  usage: string
  examples: string[]
}

export interface RhetoricalDevice {
  type: string
  description: string
  examples: string[]
  effect: string
}

export interface WordUsage {
  word: string
  frequency: number
  context: string
  significance: string
}

export interface Annotation {
  line: number
  text: string
  explanation: string
  culturalContext: string
}

export interface ImageryAnalysis {
  mainImages: Image[]
  symbolicMeanings: SymbolicMeaning[]
  emotionalTone: string
  atmosphere: string
  visualElements: VisualElement[]
}

export interface Image {
  type: string
  description: string
  significance: string
  examples: string[]
}

export interface SymbolicMeaning {
  symbol: string
  meaning: string
  culturalSignificance: string
  examples: string[]
}

export interface VisualElement {
  element: string
  description: string
  effect: string
}

export interface OverallAnalysis {
  theme: string
  structure: StructureAnalysis
  artisticFeatures: ArtisticFeature[]
  emotionalExpression: EmotionalExpression
  culturalValue: string
}

export interface StructureAnalysis {
  type: string
  lines: number
  rhymeScheme: string
  meter: string
  organization: string
}

export interface ArtisticFeature {
  feature: string
  description: string
  examples: string[]
  significance: string
}

export interface EmotionalExpression {
  mainEmotion: string
  intensity: number
  development: string
  climax: string
}

export interface AuthorInfo {
  name: string
  lifetime: string
  style: string
  achievements: string[]
  historicalSignificance: string
}

export interface HistoricalContext {
  period: string
  socialBackground: string
  literaryTrends: string[]
  historicalEvents: HistoricalEvent[]
}

export interface HistoricalEvent {
  event: string
  year: string
  impact: string
  relevance: string
}

export interface LearningRecord {
  id: string
  userId: string
  poemId: string
  analysisId: string | null
  score: number
  timeSpent: number
  completed: boolean
  notes: string | null
  createdAt: string
}

export interface PoemSearchParams {
  page?: number
  limit?: number
  search?: string
  dynasty?: string
  difficulty?: string
  tags?: string[]
}