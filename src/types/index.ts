// 统一导出所有类型定义
export * from './user'
export * from './ai'
export * from './poem'

// 通用类型定义
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
}

export interface SearchParams {
  query: string
  filters?: Record<string, any>
  sort?: string
  order?: 'asc' | 'desc'
}

// 组件相关类型
export interface NavItem {
  label: string
  icon: string
  route: string
  requiresAuth?: boolean
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  path?: string
  active?: boolean
}

export interface ModalConfig {
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

// 表单相关类型
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number'
  required?: boolean
  placeholder?: string
  options?: { label: string; value: any }[]
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    custom?: (value: any) => string | null
  }
}

export interface FormState {
  [key: string]: any
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
}

// 主题相关类型
export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      small: string
      medium: string
      large: string
      xlarge: string
    }
  }
  spacing: {
    small: string
    medium: string
    large: string
    xlarge: string
  }
}