import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Vault } from '@common/entitys/vault.entity'
import { LangItem } from '@common/lang'
import { create } from 'zustand'
import { defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
import { ConsoleLog } from '@renderer/libs/Console'
export interface QuickKeyInfo {
  quick_search?: boolean
  quick_add?: boolean
}

export interface AppStore {
  quick_input: QuickKeyInfo
  vaults: Vault[]
  setValuts: (valuts: Vault[]) => void
  getVaults: () => Vault[]
  vault_items: VaultItem[]
  setValutItems: (valutItems: VaultItem[]) => void
  //user
  cur_user?: User
  login_flag: boolean
  Login: (user: User) => void
  SetUser: (user: User) => void
  LoginOut: () => void
  HaveLogin: () => boolean
  user_list: User[]
  setUserList: (users: User[]) => void
  GetUserSet: () => UserSetInfo
  GetCurUser: () => User
  setQuickInput: (quick: QuickKeyInfo) => void
}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    quick_input: {
      quick_search: false,
      quick_add: false
    },
    user_list: [],
    getVaults() {
      return get().vaults
    },
    cur_user: null,
    lock_timeout: 0,
    login_flag: false,
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
      })
    },
    GetCurUser() {
      return get().cur_user
    },
    vaults: [],
    vault_items: [],
    setQuickInput(quick: QuickKeyInfo) {
      set((state) => {
        return { ...state, quick_input: { ...state.quick_input, ...quick } }
      })
    },
    GetUserSet() {
      if (!get().cur_user) return defaultUserSetInfo
      return get().cur_user.user_set as UserSetInfo
    },
    LoginOut() {
      set((state) => {
        ConsoleLog.info('login out')
        return { ...state, cur_user: null, login_flag: false }
      })
    },
    Login(info: User) {
      set((state) => {
        const res = { ...state, cur_user: info, login_flag: true }
        ConsoleLog.info('login', res)
        return res
      })
    },
    SetUser(user: User) {
      set((state) => {
        const res = { ...state, cur_user: user }
        ConsoleLog.info('set user', res)
        return res
      })
    },
    HaveLogin() {
      // console.log('have login', get().cur_user, get().login_flag)
      if (get().cur_user !== null && get().login_flag) {
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
