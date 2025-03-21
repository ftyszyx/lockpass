import { GetTrueKey, KEY_MAP } from '@common/keycode'
import { ConsoleLog } from '../Console'

type ShortKeyCallback = (key: string) => boolean

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
  logflag = true
  constructor() {
    ConsoleLog.info('ShortKeyHelp constructor')
  }

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
    // ConsoleLog.info('bind key', keyCombo)
    if (!this.listeners[keyCombo]) {
      this.listeners[keyCombo] = new ShortKeyItems()
    }
    this.listeners[keyCombo].Add(callback)

    if (Object.keys(this.listeners).length === 1) {
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keyup', this.handleKeyUp)
      window.addEventListener('blur', this.handleBlur)
    }
    return this.listeners[keyCombo]
  }

  private handleBlur = () => {
    if (this.logflag) ConsoleLog.info('Window lost focus, clearing pressed keys')
    this.pressedKeys.clear()
  }

  public unbindShortKey(keyCombo: string, callback?: ShortKeyCallback) {
    keyCombo = this.getKeyComboFromStr(keyCombo)
    if (this.logflag) ConsoleLog.info('unbindShortKey', keyCombo)
    if (!this.listeners[keyCombo]) return
    if (callback) {
      this.listeners[keyCombo].Remove(callback)
    } else {
      delete this.listeners[keyCombo]
    }
    if (Object.keys(this.listeners).length === 0) {
      this.clean()
    }
  }

  public unbindCallback(callback: ShortKeyCallback) {
    for (const keyCombo in this.listeners) {
      this.listeners[keyCombo].Remove(callback)
    }
  }

  clean() {
    this.listeners = {}
    this.pressedKeys.clear()
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('blur', this.handleBlur)
  }

  public unbindAllShortKeys() {
    ConsoleLog.info('unbindAllShortKeys')
    this.clean()
  }

  isEventValid(e: KeyboardEvent, down: boolean = true): boolean {
    const ele = e.target as HTMLElement
    const tagname = ele.tagName
    if (this.logflag)
      ConsoleLog.info(
        `handleKey ${down ? 'down' : 'up'} key:${e.key} tagname:${tagname} class:${ele.className}`
      )
    if ((' ' + ele.className + ' ').indexOf(' mousetrap ') > -1) {
      return false
    }
    const key = GetTrueKey(e)
    if (key == KEY_MAP.esc) {
      const ele = e.target as HTMLElement
      if (tagname == 'BODY') {
        return true
      }
      if (down) {
        if (this.logflag) ConsoleLog.info('esc blur')
        ele.blur()
        this.pressedKeys.clear()
      }
      return false
    }

    if (tagname == 'INPUT' || tagname == 'SELECT' || tagname == 'TEXTAREA' || ele.isContentEditable)
      return false

    return true
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isEventValid(e, true)) return
    const key = GetTrueKey(e)
    if (this.logflag) ConsoleLog.info('handleKeyDown', key)
    this.pressedKeys.add(key)
    const combo = this.getKeyCombo()
    if (this.logflag) ConsoleLog.info('handlecombo', combo)
    if (this.listeners[combo]) {
      // e.preventDefault()
      const callbacks = this.listeners[combo].callbacks
      if (callbacks.length > 0) {
        for (let i = 0; i < callbacks.length; i++) {
          const callback = callbacks[i]
          if (callback(combo) == true) {
            break
          }
        }
      }
    }
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    if (!this.isEventValid(e, false)) return
    const key = GetTrueKey(e)
    if (this.logflag) ConsoleLog.info('handleKeyUp', key)
    this.pressedKeys.delete(key)
  }
}

export const shortKeys = new ShortKeyHelp()
