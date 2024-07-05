import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { AppEntity } from '@renderer/entitys/app.entity'
import { create } from '@renderer/libs/state'

export interface AppStore extends AppEntity {}
export const use_appstore = create<AppStore>((set, get) => {
  return {
    fold_menu: false,
    vaults: [],
    vaut_items: [],
    toggleFoldMenu() {
      set((state) => {
        return { ...state, fold_menu: !state.fold_menu }
      })
    },
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
    }
  }
})
