import React, { createContext } from 'react'

export interface LangContextDef {
  getLang: (key: string) => string
  getLangFormat(key: string, ...args: any[]): string
}
export const LangContext = createContext<LangContextDef>({} as LangContextDef)

export function useLang() {
  const { getLang } = React.useContext(LangContext)
  return getLang
}

export function useLangFormat() {
  const { getLangFormat } = React.useContext(LangContext)
  return getLangFormat
}
