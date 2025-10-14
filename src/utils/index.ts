// 工具函数统一导出
export * from './api'
export * from './helpers'
export * from './constants'

// 类型检查工具
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

// 数据验证工具
export function validateRequired(value: unknown, fieldName: string): string {
  if (!value || (isString(value) && value.trim() === '')) {
    return `${fieldName}是必填项`
  }
  return ''
}

export function validateEmailFormat(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '邮箱格式不正确'
  }
  return ''
}

export function validatePhoneFormat(phone: string): string {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    return '手机号格式不正确'
  }
  return ''
}

// 数据处理工具
export function formatNumber(num: number, decimals = 2): string {
  return num.toFixed(decimals)
}

export function formatPercentage(num: number, decimals = 1): string {
  return `${(num * 100).toFixed(decimals)}%`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 存储工具
export function getStorage(key: string): any {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function setStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('存储失败:', error)
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('删除存储失败:', error)
  }
}

// 性能工具
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label?: string
): (...args: Parameters<T>) => ReturnType<T> {
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now()
    const result = func.apply(this, args)
    const end = performance.now()
    
    if (label) {
      console.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }
}