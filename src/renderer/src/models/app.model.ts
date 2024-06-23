import { AppEntity } from '@renderer/entitys/app.entity'
import { create } from '@renderer/libs/state'

export interface AppStore extends AppEntity {}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    fold_menu: false,
    toggleFoldMenu() {
      set((state) => {
        return { ...state, fold_menu: !state.fold_menu }
      })
    }
  }
})
