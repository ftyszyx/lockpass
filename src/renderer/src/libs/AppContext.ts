import { LangItem } from '@common/lang'
import React, { createContext } from 'react'

export interface AppContext {
  Lang: LangItem
}
export const AppContext = createContext<AppContext>(null)

export function useLang() {
  const { Lang } = React.useContext(AppContext)
  return Lang
}
