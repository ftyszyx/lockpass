import { EntityType, renderViewType } from '@common/entitys/app.entity'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { User } from '@common/entitys/user.entity'
import { ChildProps } from '@renderer/entitys/other.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import {
  FixWindowSize,
  getAllVault,
  getAllVaultItem,
  ipc_call_normal
} from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { use_appset } from '@renderer/models/appset.model'
import { message } from 'antd'
import { useEffect } from 'react'

export default function QucickLayout(props: ChildProps): JSX.Element {
  const appstore = use_appstore() as AppStore
  const getText = use_appset((state) => state.getText)
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    const timer = setInterval(() => {
      FixWindowSize(renderViewType.Quickview)
    }, 300)
    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    initUserData()
    window.electron.ipcRenderer.on(MainToWebMsg.DataChange, (_, changetype: EntityType) => {
      ConsoleLog.info('data change', changetype)
      if (changetype == EntityType.vault) getAllVault(appstore, getText, messageApi)
      else if (changetype == EntityType.vault_item) initvaultData()
    })
    window.electron.ipcRenderer.on(MainToWebMsg.LoginOK, () => {
      ConsoleLog.info('LoginOK')
      initUserData()
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.DataChange)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LoginOK)
    }
  }, [])

  async function initUserData() {
    ConsoleLog.info('initUserData')
    const curuser = await ipc_call_normal<User>(webToManMsg.getCurUserInfo)
    appstore.Login(curuser)
  }

  async function initvaultData() {
    ConsoleLog.info(`initVaultData:${appstore.HaveLogin()}`)
    if (appstore.HaveLogin() == false) return
    await getAllVault(appstore, getText, messageApi)
    await getAllVaultItem(appstore, getText, messageApi)
  }

  useEffect(() => {
    initvaultData()
  }, [appstore.cur_user])

  return (
    <div tabIndex={0} className=" overflow-auto">
      {contextHolder}
      {props.children}
    </div>
  )
}
