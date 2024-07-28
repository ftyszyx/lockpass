import { LangItem } from '@common/lang'
import { ConsoleLog } from '@renderer/libs/Console'
import { create } from '@renderer/libs/state'

export interface AppsetStore {
  initOK: boolean
  lang: LangItem
  setLang: (lang: LangItem) => void
  SetInitOK: (ok: boolean) => void
}
export const use_appset = create<AppsetStore>((set, _) => {
  ConsoleLog.LogInfo('use_appset create')
  return {
    lang: null,
    initOK: false,
    SetInitOK(ok: boolean) {
      set((state) => {
        return { ...state, initOK: ok }
      })
    },
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
      })
    }
  }
})
