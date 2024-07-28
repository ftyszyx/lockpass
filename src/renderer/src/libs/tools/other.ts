import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { ConsoleLog } from '../Console'

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
  } catch (e) {
    ConsoleLog.LogError(e)
    ConsoleLog.LogError('ipc_call res err', e.message)
    return Promise.reject({ code: ApiRespCode.unkonw })
  }
}
