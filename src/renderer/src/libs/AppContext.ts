import { LangItem } from '@common/lang'
import React, { createContext } from 'react'

export interface AppContextDef {
  Lang: LangItem
}
export const AppContext = createContext<AppContextDef>(null)

export function useLang() {
  const { Lang } = React.useContext(AppContext)
  return Lang
}
