
export class Random {
  static RangeFloat (min: number, max: number): number {
    let value: number = 0

    const i = Math.random()
    value = i * (max - min) + min

    return value
  }

  static RangeInt (min: number, max: number): number {
    let value: number = 0

    const i = Math.random()
    value = i * (max - min) + min
    value = Math.floor(value)
    return value
  }

  static get value (): number {
    return Math.random()
  }
}
