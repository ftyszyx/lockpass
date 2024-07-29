import { LangItem } from '@common/lang'
import { ConsoleLog } from '@renderer/libs/Console'
import { create } from '@renderer/libs/state'

export interface AppsetStore {
  initOK: boolean
  lang: LangItem
  setLang: (lang: LangItem) => void
  SetInitOK: (ok: boolean) => void
  //menu
  fold_menu: boolean
  ToggleFoldMenu: () => void
  //lock
  lock_state: boolean
  LockApp: () => void
  UnLockApp: () => void
}
export const use_appset = create<AppsetStore>((set, _) => {
  ConsoleLog.LogInfo('use_appset create')
  return {
    fold_menu: false,
    lock_state: false,
    lang: null,
    initOK: false,
    ToggleFoldMenu() {
      set((state) => {
        return { ...state, fold_menu: !state.fold_menu }
      })
    },
    LockApp() {
      set((state) => {
        return { ...state, lock_state: true }
      })
    },
    UnLockApp() {
      set((state) => {
        return { ...state, lock_state: false }
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
    }
  }
})
