import { useReducer, useRef, useLayoutEffect } from 'react'
//set func
//lister func
export type ListenerDef<TState> = (state: TState, prevState: TState) => void
//unlisten
export type UnSubscribeDef = () => void

export type SetStateFunc<StateDataT> = (setfun: (state: StateDataT) => Partial<StateDataT>) => void
//store api
export interface StoreApi<StateDataT> {
  setState: SetStateFunc<StateDataT>
  getState: () => StateDataT
  subscribe: (listener: ListenerDef<StateDataT>) => UnSubscribeDef
  destroy: () => void
}
//state create
export type UserStateCreatFun<StateT> = (
  set: SetStateFunc<StateT>,
  get: () => StateT,
  store: StoreApi<StateT>
) => StateT

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never

export type UseStoreDef<TState, TStateSlice> = (
  selector: (state?: TState) => TStateSlice,
  equals?: (a: TStateSlice, b: TStateSlice) => boolean
) => TStateSlice

export type StateSelectFun<StateDataT> = (
  state?: StateDataT
) => StateDataT | StateDataT[keyof StateDataT]

// create new store and get api
const createStore = <StateT>(createUserState: UserStateCreatFun<StateT>) => {
  type TState = ReturnType<typeof createUserState>
  let state: TState
  const listeners = new Set<ListenerDef<TState>>()
  const getState = () => state
  const setState: SetStateFunc<TState> = (replacefunc) => {
    const nextState = replacefunc(state)
    if (nextState != state) {
      const prevState = state
      state = Object.assign({}, state, nextState)
      listeners.forEach((listener) => listener(state, prevState))
    }
  }
  const subscribe = (listener: ListenerDef<TState>) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  const destroy = () => listeners.clear()
  const api = { getState, setState, destroy, subscribe }
  //create user data
  state = createUserState(setState, getState, api)
  return api
}

export const create = <StateT>(stateFunc: UserStateCreatFun<StateT>) => {
  const api = createStore(stateFunc)
  const useStore = (selector: StateSelectFun<StateT> = api.getState, equalityFn = Object.is) => {
    type SelectSliceType = ReturnType<typeof selector>
    const [, forceUpdate] = useReducer((c) => c + 1, 0) //tirgger comp rerender
    const state = api.getState()
    const stateRef = useRef(state)
    const selectorRef = useRef(selector)
    const equalityFnRef = useRef(equalityFn)
    //当前state
    const selectStateRef = useRef<SelectSliceType>()
    if (selectStateRef.current === undefined) {
      selectStateRef.current = selector(state)
    }
    let newStateSlice: SelectSliceType
    let hasNewStateSlice = false
    if (
      stateRef.current !== state ||
      selector !== selectorRef.current ||
      equalityFn !== equalityFnRef.current
    ) {
      newStateSlice = selector(state)
      hasNewStateSlice = !equalityFn(newStateSlice, selectStateRef.current)
    }
    //初始化数据
    useLayoutEffect(() => {
      if (hasNewStateSlice) {
        selectStateRef.current = newStateSlice
      }
      stateRef.current = state
      selectorRef.current = selector
      equalityFnRef.current = equalityFn
    })

    // 添加state变化订阅事件
    useLayoutEffect(() => {
      const listener = () => {
        // 获取当前最新的state状态值
        const nextState = api.getState()
        // 拿到当前用户所需的store切片
        const nextStateSlice = selectorRef.current(nextState)
        // 比较当前用户current切片 与 最新store切片是否是一样的，如果不一样，就更新到最新的切片
        if (!equalityFnRef.current(nextStateSlice, selectStateRef.current)) {
          stateRef.current = nextState
          selectStateRef.current = nextStateSlice
          forceUpdate()
        }
      }
      const unSubscribe = api.subscribe(listener)
      // 当组件销毁，我们需要取消订阅
      return unSubscribe //clean up function
    }, [])

    // 返回用户所需切片
    const sliceToReturn = hasNewStateSlice ? newStateSlice! : selectStateRef.current
    return sliceToReturn
  }
  Object.assign(useStore, api)
  return useStore
}
