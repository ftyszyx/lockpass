import { ApiResp, ApiRespCode, renderViewType, UserSetInfo } from '@common/entitys/app.entity'
import { ConsoleLog } from '../Console'
import { AppStore } from '@renderer/models/app.model'
import { MessageInstance } from 'antd/es/message/interface'
import { WhereDef } from '@common/entitys/db.entity'
import { Vault } from '@common/entitys/vault.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { User } from '@common/entitys/user.entity'
import { AppsetStore } from '@renderer/models/appset.model'
import { getLabelStr } from './string'
import { useState, useCallback } from 'react'

export async function ipc_call<T>(api: string, ...args: any[]): Promise<T> {
  try {
    ConsoleLog.info('ipc_call req', api, args)
    const res = (await window.electron.ipcRenderer.invoke(api, ...args)) as ApiResp<T>
    if (res.code == ApiRespCode.SUCCESS) {
      ConsoleLog.info('ipc_call res', api, res.data)
      return res.data as T
    } else {
      ConsoleLog.info('ipc_call res err', api, res.code)
      return Promise.reject(res)
    }
  } catch (e: any) {
    ConsoleLog.error(e)
    ConsoleLog.error('ipc_call res err', api, e.message)
    return Promise.reject({ code: ApiRespCode.unkonw })
  }
}

export async function ipc_call_normal<T>(api: string, ...args: any[]): Promise<T> {
  try {
    ConsoleLog.info('ipc_call_noraml req', api, args)
    const res = (await window.electron.ipcRenderer.invoke(api, ...args)) as T
    ConsoleLog.info('ipc_call_normal res', api, res)
    return res
  } catch (e: any) {
    ConsoleLog.error(e)
    ConsoleLog.error('ipc_call_noraml res err', api, e.message)
    return Promise.reject(e)
  }
}

export function useIpcInvoke<T>() {
  const [loading, setLoading] = useState(false)
  const invoke = useCallback(async (api: string, ...args: any[]): Promise<T> => {
    setLoading(true)
    try {
      ConsoleLog.info('ipc_call req', api, args)
      const res = (await window.electron.ipcRenderer.invoke(api, ...args)) as T
      ConsoleLog.info('ipc_call_normal res', api, res)
      return res
    } catch (e: any) {
      ConsoleLog.error(e)
      ConsoleLog.error('ipc_call res err', api, e.message)
      return Promise.reject(e)
    } finally {
      setLoading(false)
    }
  }, [])
  return { loading, invoke }
}

export async function GetAllUsers(
  appstore: AppStore,
  getText: AppsetStore['getText'],
  messageApi: MessageInstance
) {
  await ipc_call<User[]>(webToManMsg.getAllUser)
    .then((res) => {
      appstore.setUserList(res)
    })
    .catch((e) => {
      messageApi.error(getText(`err.${e.code}`))
    })
}

export async function getAllVault(
  appstore: AppStore,
  getText: AppsetStore['getText'],
  messageApi: MessageInstance
) {
  const curuser = appstore.GetCurUser()
  ConsoleLog.info(`getAllVault:${curuser !== null}`)
  if (curuser) {
    const where: WhereDef<Vault> = { cond: { user_id: curuser.id } }
    await ipc_call<Vault[]>(webToManMsg.GetAllValuts, where)
      .then((res) => {
        appstore.setValuts(res)
      })
      .catch((e) => {
        messageApi.error(getText(`err.${e.code}`))
      })
  }
}

export async function GetAllVaultData(
  appstore: AppStore,
  getText: AppsetStore['getText'],
  messageApi: MessageInstance
) {
  await getAllVault(appstore, getText, messageApi)
  await getAllVaultItem(appstore, getText, messageApi)
}

export async function getAllVaultItem(
  appstore: AppStore,
  getText: AppsetStore['getText'],
  messageApi: MessageInstance
) {
  const curuser = appstore.GetCurUser()
  ConsoleLog.info(`getAllVaultItem:${curuser !== null}`)
  if (curuser) {
    const where2: WhereDef<VaultItem> = { cond: { user_id: curuser.id } }
    await ipc_call<VaultItem[]>(webToManMsg.GetAllValutItems, where2)
      .then((res) => {
        appstore.setValutItems(res)
      })
      .catch((e) => {
        messageApi.error(getText(`err.${e.code}`))
      })
  }
}

export async function ChangeAppset(
  appstore: AppStore,
  getText: AppsetStore['getText'],
  setinfo: UserSetInfo,
  messageApi: MessageInstance
) {
  const newuserinfo = { ...appstore.GetCurUser(), user_set: setinfo }
  await ipc_call<User>(webToManMsg.UpdateUser, newuserinfo)
    .then((res) => {
      appstore.SetUser(res)
      messageApi.success(getText('save_success'))
    })
    .catch((e) => {
      messageApi.error(getText(`err.${e.code}`))
    })
}

export async function UpdateMenu(appsotre: AppStore, getText: AppsetStore['getText']) {
  const userset = appsotre.GetUserSet()
  await ipc_call_normal(webToManMsg.UpdateTrayMenu, {
    openlockpass: getLabelStr(getText('tray.menu.openlockpass'), userset.shortcut_global_open_main),
    lock: getLabelStr(getText('tray.menu.lock'), userset.shortcut_global_quick_lock),
    openquick: getLabelStr(getText('tray.menu.openquick'), userset.shortcut_global_quick_find),
    closemain: getLabelStr(getText('tray.menu.closemain'), userset.shortcut_global_hide_main)
  })
}

export async function FixWindowSize(viewtype: renderViewType) {
  const rect = document.body.getBoundingClientRect()
  if (rect.height == window.innerHeight) return
  await window.electron.ipcRenderer.invoke(webToManMsg.ResizeWindow, viewtype, 0, rect.height)
}
