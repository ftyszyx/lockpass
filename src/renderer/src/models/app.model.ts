import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Vault } from '@common/entitys/vaults.entity'
import { LangItem } from '@common/lang'
import { create } from '@renderer/libs/state'
export interface AppStore {
  vaults: Vault[]
  setValuts: (valuts: Vault[]) => void
  vaut_items: VaultItem[]
  setValutItems: (valutItems: VaultItem[]) => void
  fold_menu: boolean
  SetFoldMenu: (fold: boolean) => void
  //user
  cur_user?: User
  hasLogin: boolean
  Login: (user: User) => void
  SetUser: (user: User) => void
  LoginOut: () => void
  HaveLogin: () => boolean
}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    cur_user: null,
    hasLogin: false,
    fold_menu: false,
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
      })
    },
    SetFoldMenu(fold: boolean) {
      set((state) => {
        return { ...state, fold_menu: fold }
      })
    },
    vaults: [],
    vaut_items: [],
    //user
    LoginOut() {
      set((state) => {
        return { ...state, cur_user: null, hasLogin: false }
      })
    },

    Login(info: User) {
      set((state) => {
        return { ...state, cur_user: info, hasLogin: true }
      })
    },
    SetUser(user: User) {
      set((state) => {
        const res = { ...state, cur_user: user }
        return res
      })
    },
    HaveLogin() {
      if (get().hasLogin && get().cur_user) {
        return true
      }
      return false
    },
    //vault
    setValuts(valuts: Vault[]) {
      set((state) => {
        return { ...state, vaults: valuts }
      })
    },
    //vault item
    setValutItems(valutItems) {
      set((state) => {
        return { ...state, vaut_items: valutItems }
      })
    }
  }
})
