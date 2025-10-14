// 通用工具函数

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串 (默认: 'YYYY-MM-DD HH:mm:ss')
 */
export function formatDate(date: Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  
  const replacements: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: (d.getMonth() + 1).toString().padStart(2, '0'),
    DD: d.getDate().toString().padStart(2, '0'),
    HH: d.getHours().toString().padStart(2, '0'),
    mm: d.getMinutes().toString().padStart(2, '0'),
    ss: d.getSeconds().toString().padStart(2, '0')
  }
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match])
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间(毫秒)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间(毫秒)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0
  
  return function(this: any, ...args: Parameters<T>) {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > wait) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
        timeoutId = null
      }, wait - (currentTime - lastExecTime))
    }
  }
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  
  return obj
}

/**
 * 生成唯一ID
 * @param prefix 前缀
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式
 * @param phone 手机号码
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 获取文件大小文本
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 下载文件
 * @param content 文件内容
 * @param filename 文件名
 * @param contentType 内容类型
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  contentType = 'application/octet-stream'
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    }
  } catch {
    return false
  }
}

/**
 * 获取URL参数
 * @param name 参数名
 */
export function getUrlParam(name: string): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

/**
 * 设置URL参数
 * @param params 参数对象
 */
export function setUrlParams(params: Record<string, string>): void {
  const url = new URL(window.location.href)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
  })
  
  window.history.replaceState({}, '', url.toString())
}