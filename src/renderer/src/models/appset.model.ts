import { LangItem } from '@common/lang'
import { create } from '@renderer/libs/state'

export interface AppsetStore {
  lang: LangItem
  setLang: (lang: LangItem) => void
}
export const use_appset = create<AppsetStore>((set, _) => {
  return {
    lang: null,
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
      })
    }
  }
})
