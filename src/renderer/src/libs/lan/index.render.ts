import { LangItem } from '@common/lang'
import React, { createContext } from 'react'

export const LangContext = createContext<LangItem>(null)

export function useLang() {
  const lang = React.useContext(LangContext)
  return lang
}

export function useLangFormat() {
  const { getLangFormat } = React.useContext(LangContext)
  return getLangFormat
}
