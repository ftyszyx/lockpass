import { AppSetInfo } from '@common/entitys/set.entity'
import { LangHelper, LangItem } from '@common/lang'
import { ViewFocusType } from '@renderer/entitys/other.entity'
import { create } from 'zustand'

export interface AppsetStore {
  initOK: boolean
  vault_change_not_backup: boolean
  lang: LangItem | null
  setLang: (lang: LangItem) => void
  SetInitOK: (ok: boolean) => void
  getText: (str: string, ...args: any[]) => string
  ChangeLang: (lang: string) => void
  version: string
  app_set: AppSetInfo | null
  setAppSet: (set: AppSetInfo) => void
  getAppSet: () => AppSetInfo
  SetVersion: (version: string) => void
  view_focus: ViewFocusType
  SetViewFoucs: (view_focus: ViewFocusType) => void
  GetViewFoucs: () => ViewFocusType

  //menu
  fold_menu: boolean
  ToggleFoldMenu: () => void
  SetVaultChangeNotBackup: (flag: boolean) => void
  IsVaultChangeNotBackup: () => boolean
  getLang: () => LangItem | null
}

export const use_appset = create<AppsetStore>((set, get) => {
  return {
    fold_menu: false,
    lang: null,
    app_set: null,
    vault_change_not_backup: false,
    view_focus: ViewFocusType.None,
    initOK: false,
    version: '',
    SetVaultChangeNotBackup(flag: boolean) {
      set((state) => {
        return { ...state, vault_change_not_backup: flag }
      })
    },
    getLang() {
      return get().lang
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
    },
    setAppSet(setinfo: AppSetInfo) {
      set((state) => {
        return { ...state, app_set: { ...state.app_set, ...setinfo } }
      })
    },
    getAppSet() {
      return get().app_set
    },
    SetViewFoucs(view_focus: ViewFocusType) {
      set((state) => {
        return { ...state, view_focus }
      })
    },
    GetViewFoucs() {
      return get().view_focus
    }
  }
})
