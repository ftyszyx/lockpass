import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { PagePath } from '@common/entitys/page.entity'
import { LangHelper } from '@common/lang'
import { ConsoleLog } from '../Console'

export async function IPC_CALL<T>(messageApi, api: string, ...args: any[]): Promise<T> {
  try {
    const res = (await window.electron.ipcRenderer.invoke(api, ...args)) as ApiResp<T>
    if (res.code == ApiRespCode.SUCCESS) {
      return res.data as T
    } else {
      if (res.code == ApiRespCode.user_exit) {
        messageApi.error(LangHelper.getString('register.userexist'))
      } else if (res.code == ApiRespCode.user_notfind) {
        messageApi.error(LangHelper.getString('auth.login.user_notfind'))
      } else if (res.code == ApiRespCode.ver_not_match || res.code == ApiRespCode.key_not_found) {
        messageApi.error(LangHelper.getString('auth.login.needinit'))
        window.location.href = PagePath.register
      } else if (res.code == ApiRespCode.db_err) {
        messageApi.error(LangHelper.getString('err.dberr'))
      } else if (res.code == ApiRespCode.Password_err) {
        messageApi.error(LangHelper.getString('auth.login.passworderr'))
      } else if (res.code == ApiRespCode.Other_err) {
        messageApi.error(LangHelper.getString('err.unkwn'))
      }
      return Promise.reject(res)
    }
  } catch (e) {
    ConsoleLog.LogError(e)
    messageApi.error(LangHelper.getString('err.unkonwn'))
  }
}
