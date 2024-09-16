import { GetTrueKey } from '@common/keycode'
import { ConsoleLog } from '../Console'

type ShortKeyCallback = (key: string) => void

class ShortKeyItems {
  callbacks: ShortKeyCallback[] = []
  constructor() {
    return
  }
  Add(callback: ShortKeyCallback) {
    this.callbacks.push(callback)
  }

  Remove(callback: ShortKeyCallback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }
}

class ShortKeyHelp {
  constructor() {}

  private listeners: { [key: string]: ShortKeyItems } = {}
  private pressedKeys: Set<string> = new Set()
  private getKeyCombo(): string {
    return Array.from(this.pressedKeys).sort().join('+')
  }

  private getKeyComboFromStr(str: string): string {
    return str.toLowerCase().split('+').sort().join('+')
  }

  public bindShortKey(keyCombo: string, callback: ShortKeyCallback) {
    keyCombo = this.getKeyComboFromStr(keyCombo)
    ConsoleLog.info('bind key', keyCombo)
    if (!this.listeners[keyCombo]) {
      this.listeners[keyCombo] = new ShortKeyItems()
    }
    this.listeners[keyCombo].Add(callback)

    if (Object.keys(this.listeners).length === 1) {
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keyup', this.handleKeyUp)
    }
    return this.listeners[keyCombo]
  }

  public unbindShortKey(keyCombo: string, callback?: ShortKeyCallback) {
    keyCombo = this.getKeyComboFromStr(keyCombo)
    ConsoleLog.info('unbindShortKey', keyCombo)
    if (!this.listeners[keyCombo]) return
    if (callback) {
      this.listeners[keyCombo].Remove(callback)
    } else {
      delete this.listeners[keyCombo]
    }
    if (Object.keys(this.listeners).length === 0) {
      window.removeEventListener('keydown', this.handleKeyDown)
      window.removeEventListener('keyup', this.handleKeyUp)
    }
  }

  public unbindCallback(callback: ShortKeyCallback) {
    for (const keyCombo in this.listeners) {
      this.listeners[keyCombo].Remove(callback)
    }
  }

  public unbindAllShortKeys() {
    this.listeners = {}
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const key = GetTrueKey(e)
    this.pressedKeys.add(key)
    const combo = this.getKeyCombo()
    // ConsoleLog.info('handlecombo', combo)
    if (this.listeners[combo]) {
      //   e.preventDefault()
      this.listeners[combo].callbacks.forEach((callback) => callback(combo))
    }
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    const key = GetTrueKey(e)
    // ConsoleLog.info('handleKeyUp', key)
    this.pressedKeys.delete(key)
  }
}

export const shortKeys = new ShortKeyHelp()
