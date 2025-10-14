// 统一导出所有类型
export * from './user'
export * from './ai'
export * from './poem'

// 通用类型定义
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export interface SearchParams {
  keyword: string
  filters?: Record<string, any>
}

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}