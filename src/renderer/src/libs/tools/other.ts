import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { ConsoleLog } from '../Console'
import { AppStore } from '@renderer/models/app.model'
import { MessageInstance } from 'antd/es/message/interface'
import { WhereDef } from '@common/entitys/db.entity'
import { Vault } from '@common/entitys/vault.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { LangItem } from '@common/lang'
import { VaultItem } from '@common/entitys/vault_item.entity'

export async function ipc_call<T>(api: string, ...args: any[]): Promise<T> {
  try {
    ConsoleLog.LogInfo('ipc_call req', api, args)
    const res = (await window.electron.ipcRenderer.invoke(api, ...args)) as ApiResp<T>
    if (res.code == ApiRespCode.SUCCESS) {
      ConsoleLog.LogInfo('ipc_call res', res.data)
      return res.data as T
    } else {
      ConsoleLog.LogInfo('ipc_call res err', res.code)
      return Promise.reject(res)
    }
  } catch (e: any) {
    ConsoleLog.LogError(e)
    ConsoleLog.LogError('ipc_call res err', e.message)
    return Promise.reject({ code: ApiRespCode.unkonw })
  }
}

export async function getAllVault(appstore: AppStore, lang: LangItem, messageApi: MessageInstance) {
  if (appstore.cur_user) {
    // ConsoleLog.LogTrace('getAllVault')
    const where: WhereDef<Vault> = { cond: { user_id: appstore.cur_user.id } }
    await ipc_call<Vault[]>(webToManMsg.GetAllValuts, where)
      .then((res) => {
        appstore.setValuts(res)
      })
      .catch((e) => {
        messageApi.error(lang.getLangText(`err.${e.code}`))
      })
  }
}

export async function getAllVaultItem(
  appstore: AppStore,
  lang: LangItem,
  messageApi: MessageInstance
) {
  if (appstore.cur_user) {
    const where2: WhereDef<VaultItem> = { cond: { user_id: appstore.cur_user.id } }
    await ipc_call<VaultItem[]>(webToManMsg.GetAllValutItems, where2)
      .then((res) => {
        res.forEach((item) => {
          item.info = JSON.parse((item.info as string) || '{}')
        })
        appstore.setValutItems(res)
      })
      .catch((e) => {
        messageApi.error(lang.getLangText(`err.${e.code}`))
      })
  }
}
