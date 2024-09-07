import { ApiResp, ApiRespCode, UserSetInfo } from '@common/entitys/app.entity'
import { ConsoleLog } from '../Console'
import { AppStore } from '@renderer/models/app.model'
import { MessageInstance } from 'antd/es/message/interface'
import { WhereDef } from '@common/entitys/db.entity'
import { Vault } from '@common/entitys/vault.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { LangItem } from '@common/lang'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { User } from '@common/entitys/user.entity'
import { AppsetStore } from '@renderer/models/appset.model'
import { getLabelStr } from './string'

export async function ipc_call<T>(api: string, ...args: any[]): Promise<T> {
  try {
    ConsoleLog.LogInfo('ipc_call req', api, args)
    const res = (await window.electron.ipcRenderer.invoke(api, ...args)) as ApiResp<T>
    if (res.code == ApiRespCode.SUCCESS) {
      ConsoleLog.LogInfo('ipc_call res', api, res.data)
      return res.data as T
    } else {
      ConsoleLog.LogInfo('ipc_call res err', api, res.code)
      return Promise.reject(res)
    }
  } catch (e: any) {
    ConsoleLog.LogError(e)
    ConsoleLog.LogError('ipc_call res err', api, e.message)
    return Promise.reject({ code: ApiRespCode.unkonw })
  }
}

export async function ipc_call_normal<T>(api: string, ...args: any[]): Promise<T> {
  try {
    ConsoleLog.LogInfo('ipc_call_noraml req', api, args)
    const res = (await window.electron.ipcRenderer.invoke(api, ...args)) as T
    ConsoleLog.LogInfo('ipc_call_normal res', api, res)
    return res
  } catch (e: any) {
    ConsoleLog.LogError(e)
    ConsoleLog.LogError('ipc_call_noraml res err', api, e.message)
    return Promise.reject(e)
  }
}

export async function GetAllUsers(appstore: AppStore, lang: LangItem, messageApi: MessageInstance) {
  await ipc_call<User[]>(webToManMsg.getAllUser)
    .then((res) => {
      appstore.setUserList(res)
    })
    .catch((e) => {
      messageApi.error(lang?.getText(`err.${e.code}`))
    })
}

export async function getAllVault(appstore: AppStore, lang: LangItem, messageApi: MessageInstance) {
  const curuser = appstore.GetCurUser()
  ConsoleLog.LogInfo(`getAllVault:${curuser !== null}`)
  if (curuser) {
    const where: WhereDef<Vault> = { cond: { user_id: curuser.id } }
    await ipc_call<Vault[]>(webToManMsg.GetAllValuts, where)
      .then((res) => {
        appstore.setValuts(res)
      })
      .catch((e) => {
        messageApi.error(lang?.getText(`err.${e.code}`))
      })
  }
}

export async function GetAllVaultData(
  appstore: AppStore,
  lang: LangItem,
  messageApi: MessageInstance
) {
  await getAllVault(appstore, lang, messageApi)
  await getAllVaultItem(appstore, lang, messageApi)
}

export async function getAllVaultItem(
  appstore: AppStore,
  lang: LangItem,
  messageApi: MessageInstance
) {
  const curuser = appstore.GetCurUser()
  ConsoleLog.LogInfo(`getAllVaultItem:${curuser !== null}`)
  if (appstore.cur_user) {
    const where2: WhereDef<VaultItem> = { cond: { user_id: curuser.id } }
    await ipc_call<VaultItem[]>(webToManMsg.GetAllValutItems, where2)
      .then((res) => {
        appstore.setValutItems(res)
      })
      .catch((e) => {
        messageApi.error(lang?.getText(`err.${e.code}`))
      })
  }
}

export async function ChangeAppset(
  appstore: AppStore,
  getText: AppsetStore['getText'],
  setinfo: UserSetInfo,
  messageApi: MessageInstance
) {
  const newuserinfo = { ...appstore.cur_user, user_set: setinfo }
  await ipc_call<User>(webToManMsg.UpdateUser, newuserinfo)
    .then((res) => {
      appstore.SetUser(res)
      messageApi.success(getText('save_success'))
    })
    .catch((e) => {
      messageApi.error(getText(`err.${e.code}`))
    })
}

export async function UpdateMenu(appsotre: AppStore, lang: LangItem) {
  const userset = appsotre.GetUserSet()
  await ipc_call_normal(webToManMsg.UpdateTrayMenu, {
    openlockpass: getLabelStr(
      lang?.getText('tray.menu.openlockpass'),
      userset.shortcut_global_open_main
    ),
    lock: getLabelStr(lang?.getText('tray.menu.lock'), userset.shortcut_global_quick_lock),
    openquick: getLabelStr(lang?.getText('tray.menu.openquick'), userset.shortcut_global_quick_find)
  })
}
