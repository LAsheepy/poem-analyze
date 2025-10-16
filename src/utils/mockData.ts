// 模拟数据生成器
export const generateMockPoems = () => {
  return [
    {
      id: '1',
      title: '静夜思',
      author: '李白',
      dynasty: '唐代',
      content: [
        '床前明月光',
        '疑是地上霜',
        '举头望明月',
        '低头思故乡'
      ],
      difficulty: 'easy',
      tags: ['思乡', '月亮', '夜晚'],
      views: 1250,
      likes: 89,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: '春晓',
      author: '孟浩然',
      dynasty: '唐代',
      content: [
        '春眠不觉晓',
        '处处闻啼鸟',
        '夜来风雨声',
        '花落知多少'
      ],
      difficulty: 'easy',
      tags: ['春天', '自然', '早晨'],
      views: 980,
      likes: 76,
      created_at: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      title: '登鹳雀楼',
      author: '王之涣',
      dynasty: '唐代',
      content: [
        '白日依山尽',
        '黄河入海流',
        '欲穷千里目',
        '更上一层楼'
      ],
      difficulty: 'medium',
      tags: ['登高', '哲理', '壮丽'],
      views: 1560,
      likes: 102,
      created_at: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      title: '相思',
      author: '王维',
      dynasty: '唐代',
      content: [
        '红豆生南国',
        '春来发几枝',
        '愿君多采撷',
        '此物最相思'
      ],
      difficulty: 'medium',
      tags: ['爱情', '思念', '红豆'],
      views: 890,
      likes: 67,
      created_at: '2024-01-12T14:20:00Z'
    },
    {
      id: '5',
      title: '江雪',
      author: '柳宗元',
      dynasty: '唐代',
      content: [
        '千山鸟飞绝',
        '万径人踪灭',
        '孤舟蓑笠翁',
        '独钓寒江雪'
      ],
      difficulty: 'hard',
      tags: ['冬天', '孤独', '雪景'],
      views: 1120,
      likes: 94,
      created_at: '2024-01-11T11:45:00Z'
    },
    {
      id: '6',
      title: '望庐山瀑布',
      author: '李白',
      dynasty: '唐代',
      content: [
        '日照香炉生紫烟',
        '遥看瀑布挂前川',
        '飞流直下三千尺',
        '疑是银河落九天'
      ],
      difficulty: 'medium',
      tags: ['瀑布', '壮丽', '庐山'],
      views: 1340,
      likes: 118,
      created_at: '2024-01-10T16:30:00Z'
    },
    {
      id: '7',
      title: '枫桥夜泊',
      author: '张继',
      dynasty: '唐代',
      content: [
        '月落乌啼霜满天',
        '江枫渔火对愁眠',
        '姑苏城外寒山寺',
        '夜半钟声到客船'
      ],
      difficulty: 'hard',
      tags: ['夜晚', '思乡', '枫桥'],
      views: 760,
      likes: 58,
      created_at: '2024-01-09T13:10:00Z'
    },
    {
      id: '8',
      title: '游子吟',
      author: '孟郊',
      dynasty: '唐代',
      content: [
        '慈母手中线',
        '游子身上衣',
        '临行密密缝',
        '意恐迟迟归',
        '谁言寸草心',
        '报得三春晖'
      ],
      difficulty: 'medium',
      tags: ['母爱', '感恩', '亲情'],
      views: 950,
      likes: 82,
      created_at: '2024-01-08T10:25:00Z'
    },
    {
      id: '9',
      title: '清明',
      author: '杜牧',
      dynasty: '唐代',
      content: [
        '清明时节雨纷纷',
        '路上行人欲断魂',
        '借问酒家何处有',
        '牧童遥指杏花村'
      ],
      difficulty: 'easy',
      tags: ['清明', '节日', '雨景'],
      views: 680,
      likes: 45,
      created_at: '2024-01-07T15:40:00Z'
    },
    {
      id: '10',
      title: '黄鹤楼送孟浩然之广陵',
      author: '李白',
      dynasty: '唐代',
      content: [
        '故人西辞黄鹤楼',
        '烟花三月下扬州',
        '孤帆远影碧空尽',
        '唯见长江天际流'
      ],
      difficulty: 'hard',
      tags: ['送别', '友情', '长江'],
      views: 1200,
      likes: 96,
      created_at: '2024-01-06T12:15:00Z'
    }
  ]
}

export const generateMockAnalysis = (poemId: string) => {
  const analysisMap: Record<string, any> = {
    '1': {
      word_analysis: [
        { character: '明月', meaning: '明亮的月亮，象征思乡之情', notes: '诗中核心意象' },
        { character: '故乡', meaning: '家乡，出生或长期居住的地方', notes: '情感寄托' }
      ],
      imagery_analysis: [
        { name: '月光', description: '清冷的月光洒在地上', symbolism: '思乡的象征' },
        { name: '霜', description: '月光如霜般洁白', symbolism: '孤独寒冷的氛围' }
      ],
      overall_analysis: '这首诗通过描绘静夜中的月光，表达了诗人深切的思乡之情。语言简洁，意境深远。',
      author_info: {
        name: '李白',
        dynasty: '唐代',
        biography: '唐代著名浪漫主义诗人，被誉为"诗仙"',
        works: ['将进酒', '蜀道难', '行路难']
      },
      historical_context: '创作于唐代开元年间，反映了当时文人的思乡情怀'
    },
    '2': {
      word_analysis: [
        { character: '春眠', meaning: '春天睡眠，形容春困', notes: '季节特征' },
        { character: '啼鸟', meaning: '鸣叫的鸟儿', notes: '春天的声音' }
      ],
      imagery_analysis: [
        { name: '春晓', description: '春天的早晨', symbolism: '生机勃勃' },
        { name: '风雨', description: '夜间的风雨声', symbolism: '时光流逝' }
      ],
      overall_analysis: '描绘春天早晨的生机与夜晚风雨后的落花，表达对时光流逝的感慨。',
      author_info: {
        name: '孟浩然',
        dynasty: '唐代',
        biography: '唐代山水田园诗派代表诗人',
        works: ['过故人庄', '宿建德江', '春晓']
      },
      historical_context: '唐代山水田园诗的代表作之一'
    }
  }
  
  return analysisMap[poemId] || analysisMap['1']
}

export const generateMockUser = () => {
  return {
    id: '1',
    username: '诗词爱好者',
    email: 'user@example.com',
    role: 'student',
    avatar_url: null,
    learning_progress: 65,
    streak_days: 7,
    analyzed_poems: 15,
    average_score: 85,
    mastery_level: '中级',
    weekly_activity: 80,
    weekly_study_time: 320,
    completion_rate: 75,
    interests: ['唐诗', '宋词', '山水诗'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    last_login_at: '2024-01-15T09:30:00Z'
  }
}

import type { AIConversation, AIMessage } from '@/types/ai'

export const generateMockConversations = (): AIConversation[] => {
  const mockMessages1: AIMessage[] = [
    {
      id: '1',
      conversationId: '1',
      role: 'user',
      content: '请帮我解析《静夜思》的意境',
      timestamp: new Date('2024-01-15T10:00:00Z')
    },
    {
      id: '2',
      conversationId: '1',
      role: 'assistant',
      content: '《静夜思》通过月光意象表达了深切的思乡之情...',
      timestamp: new Date('2024-01-15T10:01:00Z')
    }
  ]

  const mockMessages2: AIMessage[] = [
    {
      id: '3',
      conversationId: '2',
      role: 'user',
      content: '什么是五言绝句？',
      timestamp: new Date('2024-01-15T09:00:00Z')
    },
    {
      id: '4',
      conversationId: '2',
      role: 'assistant',
      content: '五言绝句是中国传统诗歌的一种形式，每句五个字，共四句。',
      timestamp: new Date('2024-01-15T09:01:00Z')
    }
  ]

  return [
    {
      id: '1',
      userId: 'mock-user-1',
      poemId: null,
      title: '唐诗学习讨论',
      messages: mockMessages1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:01:00Z'
    },
    {
      id: '2',
      userId: 'mock-user-1',
      poemId: null,
      title: '诗词格律探讨',
      messages: mockMessages2,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:01:00Z'
    }
  ]
}