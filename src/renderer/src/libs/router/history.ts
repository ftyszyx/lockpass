export enum Action {
  Pop = "POP",
  Push = "PUSH",
  Replace = "REPLACE",
}
const PopStateEventType = "popstate";
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface History {
  readonly isDebug: boolean;
  readonly LastAction: Action;
  readonly PathName: string;
  readonly CurLocation: LocationDef; //cur location info
  push(to: string, state?: any): void;
  replace(to: string, state?: any): void;
  go(delta: number): void;
  listen(listener: Listener): () => void;
}

export interface LocationDef {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  key?: string;
}

type HistoryState = {
  usr: any;
  key?: string;
  idx: number;
};

export interface Listener {
  (arg: { action: Action; location: LocationDef; delta: number | null }): void;
}

function createKey() {
  return Math.random().toString(36).substring(2, 8);
}

export function createPath(to: LocationDef): string {
  const { search, hash } = to;
  let pathname = to.pathname || "/";
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}

export function parsePath(path: string): Partial<LocationDef> {
  const parsedPath: Partial<LocationDef> = {};
  if (path) {
    const hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    const searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}

export function createLocation(to: string, state: any = null, key?: string): Readonly<LocationDef> {
  const location: Readonly<LocationDef> = {
    pathname: "",
    search: "",
    hash: "",
    ...parsePath(to),
    state,
    key: key || createKey(),
  };
  return location;
}

function getHistoryState(location: LocationDef, index: number): HistoryState {
  return {
    usr: location.state,
    key: location.key,
    idx: index,
  };
}

// function createURL(to: LocationDef): URL {
//   // window.location.origin is "null" (the literal string value) in Firefox
//   // under certain conditions, notably when serving from a local HTML file
//   // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
//   const base = window.location.origin !== "null" ? window.location.origin : window.location.href;
//   const href = createPath(to as LocationDef);
//   if (base == null) throw new Error("base is null");
//   return new URL(href, base);
// }

export function createBrowserHistory(args: { debug?: boolean }): History {
  const window = document.defaultView!;
  const debug_flag = args.debug || false;
  const globalHistory = window.history;
  let action = Action.Pop;
  let listener: Listener | null = null;
  let index = getIndex()!;
  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }
  function getIndex(): number {
    const state = globalHistory.state || { idx: null };
    return state.idx;
  }

  function handlePop() {
    action = Action.Pop;
    const nextIndex = getIndex();
    const delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({ action, location: history.CurLocation, delta });
    }
  }

  function push(to: string, state?: any) {
    if (debug_flag) console.log("push to ", to, "listen:", listener != null);
    action = Action.Push;
    const location = createLocation(to, state);
    index = getIndex() + 1;
    const historyState = getHistoryState(location, index);
    const url = createPath(location);
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, let that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }
    if (listener) {
      listener({ action, location: history.CurLocation, delta: 1 });
    }
  }

  function replace(to: string, state?: any) {
    action = Action.Replace;
    const location = createLocation(to, state);
    index = getIndex();
    const historyState = getHistoryState(location, index);
    const url = createPath(location);
    globalHistory.replaceState(historyState, "", url);
    if (listener) {
      listener({ action, location: history.CurLocation, delta: 0 });
    }
  }

  const history: History = {
    get isDebug() {
      return debug_flag;
    },
    get LastAction() {
      return action;
    },
    get PathName() {
      return this.CurLocation.pathname;
    },
    get CurLocation() {
      const { pathname, search, hash } = window.location;
      return {
        pathname,
        search,
        hash,
        state: (globalHistory.state && globalHistory.state.usr) || null,
        key: (globalHistory.state && globalHistory.state.key) || "default",
      };
    },
    listen(fn: Listener) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    },
  };
  return history;
}
