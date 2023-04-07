import { Dictionary } from '../YZKCocos/Tools/Dictionary'

export class event {
  private readonly functions: Dictionary<any, Function> = new Dictionary<any, Function>()

  add (func: Function, name: string) {
    if (name) {
      this.functions.add(name, func)
    }
  }

  remove (name: string) {
    if (name) {
      this.functions.remove(name)
    }
  }

  /**
     * 最多支持3个参数
     */
  Invoke (...values: any[]) {
    if (!values || values.length === 0) {
      this.functions.forEach((key, value) => {
        value()
      })
    } else if (values.length === 1) {
      this.functions.forEach((key, value) => {
        value(values[0])
      })
    } else if (values.length === 2) {
      this.functions.forEach((key, value) => {
        value(values[0], values[1])
      })
    } else if (values.length === 3) {
      this.functions.forEach((key, value) => {
        value(values[0], values[1], values[2])
      })
    }
  }

  ForEach (callback: (ele: any) => void) {
    this.functions.forEach((ele) => {
      callback(ele)
    })
  }
}
