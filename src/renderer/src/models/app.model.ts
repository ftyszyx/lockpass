import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Vault } from '@common/entitys/vault.entity'
import { LangItem } from '@common/lang'
import { create } from '@renderer/libs/state'
import { defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
import { ConsoleLog } from '@renderer/libs/Console'
export interface AppStore {
  vaults: Vault[]
  setValuts: (valuts: Vault[]) => void
  vault_items: VaultItem[]
  setValutItems: (valutItems: VaultItem[]) => void
  //user
  cur_user?: User
  Login: (user: User) => void
  SetUser: (user: User) => void
  LoginOut: () => void
  HaveLogin: () => boolean
  user_list: User[]
  setUserList: (users: User[]) => void
  GetUserSet: () => UserSetInfo
}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    user_list: [],
    cur_user: null,
    lock_timeout: 0,
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
      })
    },
    vaults: [],
    vault_items: [],
    GetUserSet() {
      if (!get().cur_user) return defaultUserSetInfo
      return get().cur_user.user_set as UserSetInfo
    },
    LoginOut() {
      set((state) => {
        return { ...state, cur_user: null }
      })
    },
    Login(info: User) {
      set((state) => {
        const res = { ...state, cur_user: info }
        ConsoleLog.LogInfo('login', res)
        return res
      })
    },
    SetUser(user: User) {
      set((state) => {
        const res = { ...state, cur_user: user }
        ConsoleLog.LogInfo('set user', res)
        return res
      })
    },
    HaveLogin() {
      if (get().cur_user) {
        return true
      }
      return false
    },
    setUserList(users: User[]) {
      set((state) => {
        return { ...state, user_list: users }
      })
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
        return { ...state, vault_items: valutItems }
      })
    }
  }
})
