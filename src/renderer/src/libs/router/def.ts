export interface HistoryOptions {
  debug?: boolean
  basepath?: string
}

export enum Action {
  Pop = 'POP',
  Push = 'PUSH',
  Replace = 'REPLACE'
}
export const PopStateEventType = 'popstate'
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface History {
  readonly isDebug: boolean
  readonly LastAction: Action
  readonly PathName: string
  readonly CurLocation: LocationDef //cur location info
  push(to: string, state?: any): void
  replace(to: string, state?: any): void
  go(delta: number): void
  createHref(to: LocationDef): string
  listen(listener: Listener): () => void
}
export interface HashHistory extends History {}

export interface LocationDef {
  pathname: string
  search: string
  hash: string
  state: any
  key?: string
}

export type HistoryState = {
  usr: any
  key?: string
  idx: number
}

export interface Listener {
  (arg: { action: Action; location: LocationDef; delta: number | null }): void
}
