import { LangHelper, LangItem } from '@common/lang'
import { create } from '@renderer/libs/state'

export interface AppsetStore {
  initOK: boolean
  vault_change_not_backup: boolean
  lang: LangItem | null
  setLang: (lang: LangItem) => void
  SetInitOK: (ok: boolean) => void
  getText: (str: string, ...args: any[]) => string
  ChangeLang: (lang: string) => void
  version: string
  SetVersion: (version: string) => void
  //menu
  fold_menu: boolean
  ToggleFoldMenu: () => void
  SetVaultChangeNotBackup: (flag: boolean) => void
  IsVaultChangeNotBackup: () => boolean
}

export const use_appset = create<AppsetStore>((set, get) => {
  // ConsoleLog.LogInfo('use_appset create')
  return {
    fold_menu: false,
    lang: null,
    vault_change_not_backup: false,
    initOK: false,
    version: '',
    SetVaultChangeNotBackup(flag: boolean) {
      set((state) => {
        return { ...state, vault_change_not_backup: flag }
      })
    },
    IsVaultChangeNotBackup() {
      return get().vault_change_not_backup
    },
    SetVersion(version: string) {
      set((state) => {
        return { ...state, version: version }
      })
    },
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
        return { ...state, lang }
      })
    },
    ChangeLang(lang: string) {
      lang = lang.toLowerCase()
      LangHelper.setLang(lang)
      get().setLang(LangHelper.lang)
    },
    getText(str, ...args) {
      return get().lang?.getText(str, ...args)
    }
  }
})
