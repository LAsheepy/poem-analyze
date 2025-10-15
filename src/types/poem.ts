export interface Poem {
  id: string
  title: string
  author: string
  dynasty: string
  content: string[]
  annotations: Annotation[]
  translation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  views?: number
  likes?: number
  createdAt: Date
  updatedAt: Date
  created_at?: string
  updated_at?: string
}

export interface Annotation {
  line: number
  text: string
  explanation: string
  keywords: string[]
}

export interface PoemAnalysis {
  id: string
  poemId: string
  structure: StructureAnalysis
  imagery: ImageryAnalysis[]
  themes: string[]
  historicalContext: string
  modernRelevance: string
}

export interface StructureAnalysis {
  form: string
  rhymeScheme: string
  meter: string
  stanzas: number
}

export interface ImageryAnalysis {
  type: 'natural' | 'human' | 'abstract'
  description: string
  significance: string
  examples: string[]
}