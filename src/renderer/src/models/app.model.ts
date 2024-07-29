import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Vault } from '@common/entitys/vault.entity'
import { LangItem } from '@common/lang'
import { create } from '@renderer/libs/state'
import { UserSetInfo } from '@renderer/entitys/set.entity'
export interface AppStore {
  vaults: Vault[]
  setValuts: (valuts: Vault[]) => void
  vaut_items: VaultItem[]
  setValutItems: (valutItems: VaultItem[]) => void
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
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
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
        let setinfo = JSON.parse((user.set as string) || '{}') as UserSetInfo
        setinfo.aulock_time = 10
        user.set = setinfo
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
