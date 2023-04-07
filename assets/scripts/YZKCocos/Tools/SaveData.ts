import { Dictionary } from './Dictionary'

export class SaveData {
  /**
     * 保存数据
     * @param key 存储key
     * @param value 存储值
     */
  public static set (key: string, value) {
    cc.sys.localStorage.setItem(key, JSON.stringify(value))
  }

  /**
     * 获取key存储的数据
     * @param key 存储key
     * @param defaultValue 默认值（必填）
     */
  static get (key: string, defaultValue) {
    if (this.has(key)) {
      const value = cc.sys.localStorage.getItem(key)
      if (defaultValue instanceof Dictionary) {
        return Dictionary.parse(value)
      } else if (defaultValue instanceof Array) {
        return JSON.parse(value)
      } else {
        const type: string = typeof defaultValue
        if (type === 'number') {
          return parseFloat(value)
        } else if (type == 'boolean') {
          return value === 'true'
        } else if (type === 'object') {
          return JSON.parse(value)
        } else {
          return value
        }
      }
    }
    return defaultValue
  }

  public static delete (key: string) {
    cc.sys.localStorage.removeItem(key)
  }

  public static deleteAll () {
    cc.sys.localStorage.clear()
  }

  public static has (key: string): boolean {
    const value = cc.sys.localStorage.getItem(key)
    return value && value != '' && value != 'null' && value != 'undefined'
  }
}
