import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Vault } from '@common/entitys/vault.entity'
import { LangItem } from '@common/lang'
import { create } from '@renderer/libs/state'
import { defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
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
  user_list: User[]
  setUserList: (users: User[]) => void
  GetUserSet: () => UserSetInfo

  lock_timeout: number
  IsLock: () => boolean
  LockRemainTime: () => number
}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    user_list: [],
    cur_user: null,
    hasLogin: false,
    lock_timeout: 0,
    setLang(lang: LangItem) {
      set((state) => {
        return { ...state, lang: lang }
      })
    },
    vaults: [],
    vaut_items: [],
    GetUserSet() {
      if (!get().cur_user) return defaultUserSetInfo
      return get().cur_user.user_set as UserSetInfo
    },
    //user
    IsLock() {
      if (!get().cur_user) return false
      const setinfo = get().cur_user.user_set as UserSetInfo
      if (setinfo.normal_autolock_time == 0) return false
      const cuttime = new Date().getTime() / 1000
      return get().lock_timeout < cuttime
    },
    LockRemainTime() {
      const cuttime = new Date().getTime() / 1000
      return get().lock_timeout - cuttime
    },
    LoginOut() {
      set((state) => {
        return { ...state, cur_user: null, hasLogin: false, lock_timeout: 0 }
      })
    },
    Login(info: User) {
      set((state) => {
        if (!state.cur_user) return state
        const setinfo = state.cur_user.user_set as UserSetInfo
        const lock_timeout = new Date().getTime() / 1000 + setinfo.normal_autolock_time * 60
        const res = { ...state, cur_user: info, hasLogin: true, lock_timeout }
        console.log('login', res)
        return res
      })
    },
    SetUser(user: User) {
      set((state) => {
        const res = { ...state, cur_user: user }
        console.log('set user', res)
        return res
      })
    },
    HaveLogin() {
      if (get().hasLogin && get().cur_user) {
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
        return { ...state, vaut_items: valutItems }
      })
    }
  }
})
