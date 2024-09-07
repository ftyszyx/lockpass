import { ChildProps } from '@renderer/entitys/other.entity'
import { useHistory } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { useEffect } from 'react'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { message, Modal } from 'antd'
import { GetAllVaultData, ipc_call_normal, UpdateMenu } from '@renderer/libs/tools/other'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { User } from '@common/entitys/user.entity'
import { UpdateEventType, MyUpdateInfo, MyReleaseNoteInfo } from '@common/entitys/update.entity'

export default function BaseLayout(props: ChildProps): JSX.Element {
  const [messageApi, messageContex] = message.useMessage()
  const history = useHistory()
  const getText = use_appset((state) => state.getText) as AppsetStore['getText']
  const lang = use_appset((state) => state.lang) as AppsetStore['lang']
  const appstore = use_appstore() as AppStore
  ConsoleLog.LogInfo('baselayout render')
  useEffect(() => {
    if (lang != null) {
      UpdateMenu(appstore, lang)
    }
  }, [lang])
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
    window.electron.ipcRenderer.on(
      MainToWebMsg.UpdateEvent,
      (_, type: UpdateEventType, info: any) => {
        ConsoleLog.LogInfo('UpdateEvent', type, info)
        if (type == UpdateEventType.updateAvaliable) {
          var updateinfo = info as MyUpdateInfo
          Modal.confirm({
            title: getText('update.title'),
            cancelText: getText('cancel'),
            okText: getText('update.download'),
            content: (
              <div>
                <p className=" font-bold font-sans ">
                  {getText('update.content.releaseName', updateinfo.releaseName)}
                </p>
                <p className=" font-bold font-sans ">
                  {getText('update.content.version', updateinfo.version)}
                </p>
                <p className=" font-bold font-sans ">
                  {getText('update.content.releaseDate', updateinfo.releaseDate)}
                </p>
                <hr></hr>
                <div>
                  {typeof updateinfo.releaseNotes === 'string' && (
                    <div dangerouslySetInnerHTML={{ __html: updateinfo.releaseNotes }}></div>
                  )}
                  {typeof updateinfo.releaseNotes !== 'string' &&
                    updateinfo.releaseNotes.map((note: MyReleaseNoteInfo, index: number) => {
                      return (
                        <div key={index}>
                          <p className=" font-bold font-sans ">
                            {getText('update.content.version', note.version)}
                          </p>
                          <div dangerouslySetInnerHTML={{ __html: note.note }}></div>
                        </div>
                      )
                    })}
                </div>
                <div></div>
              </div>
            ),
            onOk: async () => {
              await ipc_call_normal(webToManMsg.Downloadupdate)
            },
            onCancel: () => {
              ConsoleLog.LogInfo('update cancel')
            }
          })
        } else if (type == UpdateEventType.Checking) {
          message.info(getText('update.checking'))
        } else if (type == UpdateEventType.UpdateDownOk) {
          Modal.confirm({
            title: getText('update.downloadok.title'),
            okText: getText('update.downloadok.ok'),
            content: getText('update.downloadok.content', info as string),
            onOk: async () => {
              await ipc_call_normal(webToManMsg.InstallUpdate)
            },
            onCancel: () => {
              ConsoleLog.LogInfo('update cancel')
            }
          })
        } else if (type == UpdateEventType.UpdateError) {
          message.error(getText('update.error', info as string))
        } else if (type == UpdateEventType.UpdateEmpty) {
          message.info(getText('update.noupdate'))
        }
      }
    )
    window.electron.ipcRenderer.on(MainToWebMsg.LoginOut, () => {
      ConsoleLog.LogInfo('LoginOut event')
      appstore.LoginOut()
      history.push(PagePath.Login)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LockApp)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowVaulteItem)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LoginOut)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.UpdateEvent)
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
    ConsoleLog.LogInfo(`initAllData havelogin:${appstore.HaveLogin()} `)
    if (appstore.HaveLogin()) {
      await GetAllVaultData(appstore, getText, messageApi)
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
