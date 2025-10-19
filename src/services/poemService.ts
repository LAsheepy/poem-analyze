import { supabase } from '../lib/supabase'
import type { PoemAnalysis } from '../types/poem'

const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/poem-analysis'

interface PoemAnalysisRequest {
  poemId: string
  userId: string
  content: string
  analysisType?: string
}

export const poemService = {
  async analyzePoem(request: PoemAnalysisRequest): Promise<PoemAnalysis> {
    try {
      // 调用n8n工作流进行诗词分析
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poemContent: request.content,
          analysisType: request.analysisType || 'comprehensive'
        })
      })

      if (!response.ok) {
        throw new Error(`n8n工作流调用失败: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '诗词分析失败')
      }

      // 解析DeepSeek返回的分析结果
      const analysisResult = this.parseAnalysisResult(result.analysis)

      // 保存分析结果到数据库
      const { data, error } = await supabase
        .from('poem_analyses')
        .insert({
          poem_id: request.poemId,
          user_id: request.userId,
          word_analysis: analysisResult.wordAnalysis,
          imagery_analysis: analysisResult.imageryAnalysis,
          overall_analysis: analysisResult.overallAnalysis,
          author_info: analysisResult.authorInfo,
          historical_context: analysisResult.historicalContext
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        poemId: data.poem_id,
        userId: data.user_id,
        wordAnalysis: data.word_analysis,
        imageryAnalysis: data.imagery_analysis,
        overallAnalysis: data.overall_analysis,
        authorInfo: data.author_info,
        historicalContext: data.historical_context,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

    } catch (error) {
      console.error('诗词分析失败:', error)
      throw new Error(`诗词分析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  },

  async getAnalysisHistory(userId: string): Promise<PoemAnalysis[]> {
    const { data, error } = await supabase
      .from('poem_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(item => ({
      id: item.id,
      poemId: item.poem_id,
      userId: item.user_id,
      wordAnalysis: item.word_analysis,
      imageryAnalysis: item.imagery_analysis,
      overallAnalysis: item.overall_analysis,
      authorInfo: item.author_info,
      historicalContext: item.historical_context,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
  },

  private parseAnalysisResult(analysisText: string): any {
    // 这里需要将DeepSeek返回的文本分析结果解析为结构化的数据
    // 暂时返回模拟数据
    return {
      wordAnalysis: {
        difficultWords: [],
        rhetoricalDevices: [],
        wordUsage: [],
        annotations: []
      },
      imageryAnalysis: {
        mainImages: [],
        symbolicMeanings: [],
        emotionalTone: '',
        atmosphere: '',
        visualElements: []
      },
      overallAnalysis: {
        theme: '',
        structure: {
          type: '',
          lines: 0,
          rhymeScheme: '',
          meter: '',
          organization: ''
        },
        artisticFeatures: [],
        emotionalExpression: {
          mainEmotion: '',
          intensity: 0,
          development: '',
          climax: ''
        },
        culturalValue: ''
      },
      authorInfo: {
        name: '',
        lifetime: '',
        style: '',
        achievements: [],
        historicalSignificance: ''
      },
      historicalContext: {
        period: '',
        socialBackground: '',
        literaryTrends: [],
        historicalEvents: []
      }
    }
  }
}