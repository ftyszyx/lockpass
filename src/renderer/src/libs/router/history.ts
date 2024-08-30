//prettier-ignore
import { LocationDef, History, HistoryOptions, Action, Listener, HistoryState, PopStateEventType } from './def'

function createKey() {
  return Math.random().toString(36).substring(2, 8)
}

function getCurLocation(window: Window, globalHistory: Window['history']): LocationDef {
  let { pathname, search, hash } = window.location
  // console.log('windows location', window.location, pathname, search, hash)
  return {
    pathname,
    search,
    hash,
    state: (globalHistory.state && globalHistory.state.usr) || null,
    key: (globalHistory.state && globalHistory.state.key) || 'default'
  }
}

export function createPath(_: Window, to: LocationDef): string {
  const { search, hash } = to
  let pathname = to.pathname || '/'
  if (search && search !== '?') pathname += search.charAt(0) === '?' ? search : '?' + search
  if (hash && hash !== '#') pathname += hash.charAt(0) === '#' ? hash : '#' + hash
  return pathname
}

export function parsePath(path: string): Partial<LocationDef> {
  const parsedPath: Partial<LocationDef> = {}
  if (path) {
    const hashIndex = path.indexOf('#')
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex)
      path = path.substring(0, hashIndex)
    }
    const searchIndex = path.indexOf('?')
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex)
      path = path.substring(0, searchIndex)
    }
    if (path) {
      parsedPath.pathname = path
    }
  }
  return parsedPath
}

export function createLocation(to: string, state: any = null, key?: string): Readonly<LocationDef> {
  const location: Readonly<LocationDef> = {
    pathname: '',
    search: '',
    hash: '',
    ...parsePath(to),
    state,
    key: key || createKey()
  }
  return location
}

function getHistoryState(location: LocationDef, index: number): HistoryState {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  }
}

export function createBrowserHistory(opitons: HistoryOptions): History {
  return getBaseHistory(getCurLocation, createPath, opitons)
}
function gethashPathname(hash: string): string {
  if (hash && hash.startsWith('#')) {
    return hash.slice(1)
  }
  return '/'
}

export function createHashHistory(options: HistoryOptions): History {
  function createHashLocation(window: Window, globalHistory: Window['history']): LocationDef {
    const res = getCurLocation(window, globalHistory)
    res.pathname = gethashPathname(res.hash)
    return res
  }
  function createUrl(window: Window, to: LocationDef): string {
    const base = window.document.querySelector('base')
    let href = ''
    if (base && base.getAttribute('href')) {
      const url = window.location.href
      const hashIndex = url.indexOf('#')
      href = hashIndex === -1 ? url : url.slice(0, hashIndex)
    }
    const res = href + '#' + createPath(window, to)
    return res
  }
  return getBaseHistory(createHashLocation, createUrl, options)
}

function getBaseHistory(
  getLocation: (window: Window, globalHistory: Window['history']) => LocationDef,
  createHref: (window: Window, to: LocationDef) => string,
  opitons: HistoryOptions
): History {
  const window = document.defaultView!
  const debug_flag = opitons.debug || false
  const globalHistory = window.history
  let action = Action.Pop
  let listener: Listener | null = null
  let index = getIndex()!
  if (index == null) {
    index = 0
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '')
  }
  function getIndex(): number {
    const state = globalHistory.state || { idx: null }
    return state.idx
  }

  function handlePop() {
    if (opitons.debug) console.log('handlePop')
    action = Action.Pop
    const nextIndex = getIndex()
    const delta = nextIndex == null ? null : nextIndex - index
    index = nextIndex
    if (listener) {
      listener({ action, location: history.CurLocation, delta })
    }
  }

  function push(to: string, state?: any) {
    action = Action.Push
    const location = createLocation(to, state)
    index = getIndex() + 1
    const historyState = getHistoryState(location, index)
    const url = history.createHref(location)
    try {
      if (opitons.debug) console.log('push to ', url, listener)
      globalHistory.pushState(historyState, '', url)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'DataCloneError') {
        if (opitons.debug) console.log('DataCloneError', error)
        throw error
      }
      window.location.assign(url)
    }
    if (listener) {
      if (opitons.debug) console.log('push listener')
      listener({ action, location: history.CurLocation, delta: 1 })
    }
  }

  function replace(to: string, state?: any) {
    action = Action.Replace
    const location = createLocation(to, state)
    index = getIndex()
    const historyState = getHistoryState(location, index)
    const url = history.createHref(location)
    if (opitons.debug) console.log('replace url ', url)
    globalHistory.replaceState(historyState, '', url)
    if (listener) {
      if (opitons.debug) console.log('push listener')
      listener({ action, location: history.CurLocation, delta: 0 })
    }
  }

  const history: History = {
    get isDebug() {
      return debug_flag
    },
    get LastAction() {
      return action
    },
    get PathName() {
      return this.CurLocation.pathname
    },
    get CurLocation() {
      return getLocation(window, globalHistory)
    },
    createHref(to: LocationDef) {
      return createHref(window, to)
    },
    listen(fn: Listener) {
      if (listener) {
        throw new Error('A history only accepts one active listener')
      }
      window.addEventListener(PopStateEventType, handlePop)
      listener = fn
      return () => {
        if (opitons.debug) console.log('remove listener')
        window.removeEventListener(PopStateEventType, handlePop)
        listener = null
      }
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n)
    }
  }
  return history
}
