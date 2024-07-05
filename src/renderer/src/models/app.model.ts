import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/valuts.entity'
import { AppEntity } from '@renderer/entitys/app.entity'
import { create } from '@renderer/libs/state'

export interface AppStore extends AppEntity {
  // valuts
  FetchAllValuts: () => Promise<void>
  UpdateValut: (valut: Vault) => Promise<void>
  DeleteValut: (valut: Vault) => Promise<void>
  AddValut: (valut: Vault) => Promise<void>
  //valut_item
  FetchValutItems: () => Promise<void>
  UpdateValutItem: (info: VaultItem) => Promise<void>
  DeleteValutItem: (info: VaultItem) => Promise<void>
  AddValutItem: (info: VaultItem) => Promise<void>
  //search
  SearchValutItems: (keyword: string, vault_id: Number) => VaultItem[]
}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    // fold_menu: false,
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
    },

    async UpdateValut(valut) {
      await window.electron.ipcRenderer.invoke(webToManMsg.UpdateValut, valut)
    },

    async DeleteValut(valut) {
      await window.electron.ipcRenderer.invoke(webToManMsg.DeleteValut, valut)
    },

    async AddValut(valut) {
      await window.electron.ipcRenderer.invoke(webToManMsg.AddValut, valut)
    },

    async UpdateValutItem(valutItem) {
      await window.electron.ipcRenderer.invoke(webToManMsg.updateValutItem, valutItem)
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
