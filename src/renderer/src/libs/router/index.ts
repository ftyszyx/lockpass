export { default as BrowerRouter } from './BrowerRouter'
export { default as HashRouter } from './HashRouter'
export { default as Link } from './Link'
export { default as Route } from './Route'
export { default as RouterContext } from './RouterContext'
export * from './history'
import React from 'react'
import { History } from './def'
import { TokensToRegexpOptions, ParseOptions } from 'path-to-regexp'
import routerContext from './RouterContext'
import { PathMatch } from './match'
import Route from './Route'
export type MatchOption = TokensToRegexpOptions & ParseOptions
export type MatchRes = {
  params: Record<string, string>
  path: string
  url: string
  isExact: boolean
}

export type RouterProps = {
  children?: React.ReactNode
  history?: History
  relative_path?: boolean //route 节点是否使用相对路径
  debug: boolean
}

export type RouteProps = {
  match?: MatchOption
  // params?: Record<string, string>;
  children?: React.ReactNode
  element?: React.ReactNode | ((props: RouteProps) => React.ReactElement)
  errorElement?: () => React.ReactElement
  path?: string
  relative_path?: boolean //route 节点是否使用相对路径
  redirect?: string
  routeType?: string
}
export type RedirectProps = RouteProps & {
  to: string
}
export type BrowerRouterProps = {
  children?: React.ReactNode
  relative_path?: boolean //route 节点是否使用相对路径
  debug?: boolean
  base_path?: string
}

export type HashRouteProps = {
  children?: React.ReactNode
  relative_path?: boolean //route 节点是否使用相对路径
  debug?: boolean
}

export type LinkProps = {
  children?: React.ReactNode
  to: string
  className?: string
}
export type RouterStoreData = {
  match?: MatchRes
  history: History
  relative_path?: boolean //route 节点是否使用相对路径
  debug: boolean
}
export type RouterStoreDef = RouterStoreData & {
  setData: (data: RouterStoreData) => void
}

export function useRouterStore() {
  return React.useContext(routerContext)
}

export function useHistory() {
  return React.useContext(routerContext).history
}
export function useMatch() {
  return React.useContext(routerContext).match
}

export function url_join(...args: string[]): string {
  const parts = Array.from(Array.isArray(args[0]) ? (args[0] as string[]) : args)
  if (parts.length === 0) return ''
  const resArray: string[] = []
  for (let i = 0; i < parts.length; i++) {
    let text = parts[i]
    if (text == null) continue
    text = text.trim()
    if (text === '') {
      if (i == 0 || i == parts.length - 1) text = '/'
      else continue
    }
    //Removing the starting slashes for each component but the first.
    if (i > 0) text = text.replace(/^[/]+/, '')
    if (i < parts.length - 1) {
      //Removing the ending slashes for each component but the last.
      text = text.replace(/[/]+$/, '')
    } else {
      //For the last component we will combine multiple slashes to a single one.
      text = text.replace(/[/]+$/, '/')
    }
    resArray.push(text)
  }
  const res_str = resArray.join('/')
  return res_str
}

export type childMatchRes = { child: React.ReactElement | null }
// prettier-ignore
export function matchChild( parent_path: string, children: React.ReactNode, value: RouterStoreData,relative_path:boolean): childMatchRes {
  const url = value.history.PathName
  let final_children: React.ReactElement[] = []
  if (children instanceof Array) final_children = children
  else if (children instanceof Object) final_children = [children as React.ReactElement]
  for (const item of final_children) {
    if (React.isValidElement(item) == false) continue
    const itemtype = item.type
    if (itemtype != Route) continue
    const item_props = item.props as RouteProps
    let item_truepath = item_props.path || ''
    if(relative_path) item_truepath = url_join(parent_path, item_truepath)
    const match = PathMatch(item_truepath, url, item_props?.match, value.debug)
    if (match != null) {
      return { child: item }
    }
  }
  return { child: null }
}
