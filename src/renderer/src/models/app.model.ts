import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/vaults.entity'
import { AppEntity } from '@renderer/entitys/app.entity'
import { create } from '@renderer/libs/state'

export interface AppStore extends AppEntity {
  cur_user?: User
  user_list?: User[]
  fold_menu: boolean
  SetFoldMenu: (fold: boolean) => void
  // valuts
  FetchAllValuts: () => Promise<void>
  UpdateValut: (old: Vault, valut: Vault) => Promise<void>
  DeleteValut: (id: number) => Promise<void>
  AddValut: (valut: Vault) => Promise<void>
  //valut_item
  FetchValutItems: () => Promise<void>
  UpdateValutItem: (info_old: VaultItem, info: VaultItem) => Promise<void>
  DeleteValutItem: (info: VaultItem) => Promise<void>
  AddValutItem: (info: VaultItem) => Promise<void>
  //search
  SearchValutItems: (keyword: string, vault_id: Number) => VaultItem[]

  //user
  FetchAllUsers: () => Promise<User[]>
  SelectUser: (user: User) => Promise<void>
}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    fold_menu: false,
    SetFoldMenu(fold: boolean) {
      set((state) => {
        return { ...state, fold_menu: fold }
      })
    },
    vaults: [],
    vaut_items: [],
    async FetchAllValuts() {
      const res = await window.electron.ipcRenderer.invoke(webToManMsg.GetAllValuts)
      set((state) => {
        return { ...state, vaults: res }
      })
    },

    async FetchValutItems() {
      const res = await window.electron.ipcRenderer.invoke(webToManMsg.GetAllValutItems)
      set((state) => {
        return { ...state, vaut_items: res }
      })
      return res
    },

    async FetchAllUsers() {
      const res = await window.electron.ipcRenderer.invoke(webToManMsg.getAllUser)
      set((state) => {
        return { ...state, user_list: res }
      })
      return res
    },

    async SelectUser(info: User) {
      await window.electron.ipcRenderer.invoke(webToManMsg.SelectAsUser, info.username)
      set((state) => {
        return { ...state, cur_user: info }
      })
    },

    async UpdateValut(old, valut) {
      console.log(valut)
      await window.electron.ipcRenderer.invoke(webToManMsg.UpdateValut, old, valut)
    },

    async DeleteValut(id: number) {
      await window.electron.ipcRenderer.invoke(webToManMsg.DeleteValut, id)
    },

    async AddValut(valut) {
      await window.electron.ipcRenderer.invoke(webToManMsg.AddValut, valut)
    },

    async UpdateValutItem(old, valutItem) {
      await window.electron.ipcRenderer.invoke(webToManMsg.updateValutItem, old, valutItem)
    },

    async DeleteValutItem(valutItem) {
      await window.electron.ipcRenderer.invoke(webToManMsg.DeleteValutItem, valutItem)
    },

    async AddValutItem(valutItem) {
      await window.electron.ipcRenderer.invoke(webToManMsg.AddValutItem, valutItem)
    },

    SearchValutItems(keyword, vault_id) {
      return get().vaut_items.filter((item) => {
        if (vault_id) return item.name.includes(keyword)
        return item.valut_id === vault_id && item.name.includes(keyword)
      })
    }
  }
})
