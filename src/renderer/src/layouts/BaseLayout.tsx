import { ChildProps } from '@renderer/entitys/other.entity'
import { useHistory } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { useEffect } from 'react'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { message } from 'antd'
import { getAllVault, getAllVaultItem, ipc_call_normal } from '@renderer/libs/tools/other'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { User } from '@common/entitys/user.entity'

export default function BaseLayout(props: ChildProps): JSX.Element {
  const [messageApi, messageContex] = message.useMessage()
  const history = useHistory()
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  ConsoleLog.LogInfo('baselayout render')
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.LockApp, () => {
      ConsoleLog.LogInfo('LockApp event')
      history.push(PagePath.Lock)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.ShowVaulteItem, (_, vaultid, vault_item_id) => {
      ConsoleLog.LogInfo('ShowVaulteItem', vaultid, vault_item_id)
      history.push(
        PagePath.Vault_full.replace(':vault_id', vaultid).replace(':vault_item_id', vault_item_id)
      )
    })
    window.electron.ipcRenderer.on(MainToWebMsg.LoginOut, () => {
      ConsoleLog.LogInfo('LoginOut event')
      appstore.LoginOut()
      history.push(PagePath.Login)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LockApp)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowVaulteItem)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LoginOut)
    }
  }, [])

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    ConsoleLog.LogInfo('checkStatus')
    const hasinit = await ipc_call_normal<boolean>(webToManMsg.IsSystemInit)
    if (hasinit === false) {
      ConsoleLog.LogInfo('checkStatus no init')
      history.replace(PagePath.register)
      return
    }
    const islogin = await ipc_call_normal<boolean>(webToManMsg.isLogin)
    if (islogin === false) {
      ConsoleLog.LogInfo('checkStatus no login')
      history.replace(PagePath.Login)
      return
    }

    const isLock = await ipc_call_normal<boolean>(webToManMsg.isLock)
    if (isLock === true) {
      ConsoleLog.LogInfo('check status is lock')
      history.push(PagePath.Lock)
      return
    }

    if (appstore.HaveLogin() == false) {
      await initUserData()
    }
  }

  async function initUserData() {
    ConsoleLog.LogInfo('initUserData')
    const curuser = await ipc_call_normal<User>(webToManMsg.getCurUserInfo)
    appstore.Login(curuser)
  }

  useEffect(() => {
    initAllData()
  }, [appstore.cur_user])

  async function initAllData() {
    ConsoleLog.LogInfo(`initAllData havelogin:${appstore.HaveLogin()} `, appstore.cur_user)
    if (appstore.HaveLogin()) {
      await getAllVault(appstore, appset.lang, messageApi)
      await getAllVaultItem(appstore, appset.lang, messageApi)
    }
  }

  return (
    <div>
      {messageContex}
      {
        <div>
          {/* <Button
            type="primary"
            onClick={async () => {
              await ipc_call_normal(webToManMsg.OpenDb)
            }}
          >
            open db
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              await ipc_call_normal(webToManMsg.CloseDb)
            }}
          >
            close db
          </Button> */}
        </div>
      }
      {props.children}
    </div>
  )
}
