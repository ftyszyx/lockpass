import { LangItem } from '@common/lang'
import { ConsoleLog } from '@renderer/libs/Console'
import { create } from '@renderer/libs/state'

export interface AppsetStore {
  initOK: boolean
  lang: LangItem
  setLang: (lang: LangItem) => void
  SetInitOK: (ok: boolean) => void
  getText: (str: string, ...args: any[]) => string
  //menu
  fold_menu: boolean
  ToggleFoldMenu: () => void
}
export const use_appset = create<AppsetStore>((set, _) => {
  ConsoleLog.LogTrace('use_appset create')
  return {
    fold_menu: false,
    lang: null,
    initOK: false,
    ToggleFoldMenu() {
      set((state) => {
        return { ...state, fold_menu: !state.fold_menu }
      })
    },
    SetInitOK(ok: boolean) {
      set((state) => {
        return { ...state, initOK: ok }
      })
    },
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
      })
    },
    getText(str, ...args) {
      return this.lang?.getText(str, ...args)
    }
  }
})
