import { ChildProps } from '@renderer/entitys/other.entity'
import { useHistory } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { useEffect } from 'react'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { message } from 'antd'
import {
  getAllVault,
  getAllVaultItem,
  ipc_call_normal,
  UpdateMenu
} from '@renderer/libs/tools/other'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'

export default function BaseLayout(props: ChildProps): JSX.Element {
  const [messageApi, messageContex] = message.useMessage()
  const history = useHistory()
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  ConsoleLog.LogInfo('baselayout render')
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.LockApp, () => {
      history.push(PagePath.Lock)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.ShowVaulteItem, (_, vaultid) => {
      history.push(PagePath.Admin_valutitem_full.replace(':id', vaultid))
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LockApp)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowVaulteItem)
    }
  }, [])

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    const hasinit = await ipc_call_normal<boolean>(webToManMsg.IsSystemInit)
    if (hasinit === false) {
      history.replace(PagePath.register)
      return
    }
    const islogin = await ipc_call_normal<boolean>(webToManMsg.isLogin)
    if (islogin === false) {
      history.replace(PagePath.Login)
      return
    }
    const isLock = await ipc_call_normal<boolean>(webToManMsg.isLock)
    if (isLock === true) {
      history.push(PagePath.Lock)
    }
  }

  useEffect(() => {
    initAllData()
  }, [appstore.cur_user])

  async function initAllData() {
    if (appstore.HaveLogin()) {
      await getAllVault(appstore, appset.lang, messageApi)
      await getAllVaultItem(appstore, appset.lang, messageApi)
    }
  }

  return (
    <div>
      {messageContex}
      {/* <button
        onClick={async () => {
          await UpdateMenu(appstore, appset.lang)
        }}
      >
        test
      </button> */}
      {props.children}
    </div>
  )
}
