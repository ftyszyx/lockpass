import { ChildProps } from '@renderer/entitys/other.entity'
import { useHistory } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { useEffect, useState } from 'react'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { message, Modal, Progress } from 'antd'
import { GetAllVaultData, ipc_call_normal, UpdateMenu } from '@renderer/libs/tools/other'
import { use_appset } from '@renderer/models/appset.model'
import { User } from '@common/entitys/user.entity'
import {
  UpdateEventType,
  MyUpdateInfo,
  MyReleaseNoteInfo,
  MyUpdateProgress
} from '@common/entitys/update.entity'
import { AppSetInfo } from '@common/entitys/set.entity'

export default function BaseLayout(props: ChildProps): JSX.Element {
  const [messageApi, messageContex] = message.useMessage()
  const history = useHistory()
  const getText = use_appset((state) => state.getText)
  const setVaultChangeNotBackup = use_appset((state) => state.SetVaultChangeNotBackup)
  const getLang = use_appset((state) => state.getLang)
  const setAppSet = use_appset((state) => state.setAppSet)
  const [showProgress, setShowProgress] = useState(false)
  const [progressInfo, setProgress_info] = useState<MyUpdateProgress>(null)
  const appstore = use_appstore() as AppStore
  ConsoleLog.info('baselayout render')
  useEffect(() => {
    const lang = getLang()
    if (lang != null) {
      UpdateMenu(appstore, getText)
    }
  }, [getLang()])
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.LockApp, () => {
      ConsoleLog.info('LockApp event')
      history.push(PagePath.Lock)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.ShowVaulteItem, (_, vaultid, vault_item_id) => {
      ConsoleLog.info('ShowVaulteItem', vaultid, vault_item_id)
      history.push(
        PagePath.Vault_full.replace(':vault_id', vaultid).replace(':vault_item_id', vault_item_id)
      )
    })
    window.electron.ipcRenderer.on(
      MainToWebMsg.AppUpdateEvent,
      (_, type: UpdateEventType, info: any) => {
        ConsoleLog.info('UpdateEvent', type, info)
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
                    <div
                      className="update_content"
                      dangerouslySetInnerHTML={{ __html: updateinfo.releaseNotes }}
                    ></div>
                  )}
                  {typeof updateinfo.releaseNotes !== 'string' &&
                    updateinfo.releaseNotes.map((note: MyReleaseNoteInfo, index: number) => {
                      return (
                        <div key={index}>
                          <p className=" font-bold font-sans ">
                            {getText('update.content.version', note.version)}
                          </p>
                          <div
                            className="update_content"
                            dangerouslySetInnerHTML={{ __html: note.note }}
                          ></div>
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
            onCancel: async () => {
              ConsoleLog.info('update cancel')
              await ipc_call_normal(webToManMsg.CancelUpdate)
            }
          })
        } else if (type == UpdateEventType.Checking) {
          message.info(getText('update.checking'))
        } else if (type == UpdateEventType.UpdateDownOk) {
          setShowProgress(false)
          Modal.confirm({
            title: getText('update.downloadok.title'),
            okText: getText('update.downloadok.ok'),
            content: getText('update.downloadok.content', info as string),
            onOk: async () => {
              await ipc_call_normal(webToManMsg.InstallUpdate)
            },
            onCancel: async () => {
              ConsoleLog.info('update cancel')
              await ipc_call_normal(webToManMsg.CancelUpdate)
            }
          })
        } else if (type == UpdateEventType.UpdateProgress) {
          if (showProgress == false) {
            setShowProgress(true)
          }
          setProgress_info(info as MyUpdateProgress)
        } else if (type == UpdateEventType.UpdateError) {
          setShowProgress(false)
          message.error(getText('update.error', info as string))
        } else if (type == UpdateEventType.UpdateEmpty) {
          message.info(getText('update.noupdate'))
        }
      }
    )
    window.electron.ipcRenderer.on(MainToWebMsg.LoginOut, () => {
      ConsoleLog.info('LoginOut event')
      appstore.LoginOut()
      history.push(PagePath.Login)
    })

    window.electron.ipcRenderer.on(MainToWebMsg.VaultChangeNotBackup, (_, flag: boolean) => {
      ConsoleLog.info('VaultChangeNotBackup event', flag)
      setVaultChangeNotBackup(flag)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.AppSetChange, (_, setinfo: AppSetInfo) => {
      ConsoleLog.info('AppSetChange event', setinfo)
      setAppSet(setinfo)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LockApp)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowVaulteItem)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LoginOut)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.AppUpdateEvent)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.VaultChangeNotBackup)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.AppSetChange)
    }
  }, [])

  useEffect(() => {
    getAppset()
    checkStatus()
    checkVaultChangeNotBackup()
  }, [])

  async function getAppset() {
    const setinfo = await ipc_call_normal<AppSetInfo>(webToManMsg.getAppSet)
    setAppSet(setinfo)
  }

  async function checkVaultChangeNotBackup() {
    const isVaultChangeNotBackup = await ipc_call_normal<boolean>(
      webToManMsg.IsVaultChangeNotBackup
    )
    if (isVaultChangeNotBackup === true) {
      setVaultChangeNotBackup(true)
    }
  }

  async function checkStatus() {
    ConsoleLog.info('checkStatus')
    const hasinit = await ipc_call_normal<boolean>(webToManMsg.IsSystemInit)
    if (hasinit === false) {
      ConsoleLog.info('checkStatus no init')
      history.replace(PagePath.register)
      return
    }
    const islogin = await ipc_call_normal<boolean>(webToManMsg.isLogin)
    if (islogin === false) {
      ConsoleLog.info('checkStatus no login')
      history.replace(PagePath.Login)
      return
    }

    const isLock = await ipc_call_normal<boolean>(webToManMsg.isLock)
    if (isLock === true) {
      ConsoleLog.info('check status is lock')
      history.push(PagePath.Lock)
      return
    }

    if (appstore.HaveLogin() == false) {
      await initUserData()
    }
  }

  async function initUserData() {
    ConsoleLog.info('initUserData')
    const curuser = await ipc_call_normal<User>(webToManMsg.getCurUserInfo)
    appstore.Login(curuser)
  }

  useEffect(() => {
    initAllData()
  }, [appstore.cur_user])

  async function initAllData() {
    ConsoleLog.info(`initAllData havelogin:${appstore.HaveLogin()} `)
    if (appstore.HaveLogin()) {
      await GetAllVaultData(appstore, getText, messageApi)
    }
  }

  return (
    <div>
      <div>
        {messageContex}
        {props.children}
      </div>
      {showProgress && (
        <Modal
          title={getText('update.title')}
          open={showProgress}
          onCancel={() => setShowProgress(false)}
          footer={null}
        >
          <div className="flex flex-col">
            <Progress percent={Math.floor(progressInfo.percent)} />
            <p>{getText('update.modal.content', progressInfo.percent.toFixed(2))}</p>
            <p>{getText('update.modal.total', (progressInfo.total / 1024 / 1024).toFixed(2))}</p>
            <p>
              {getText(
                'update.modal.transferred',
                (progressInfo.transferred / 1024 / 1024).toFixed(2)
              )}
            </p>
            <p>
              {getText(
                'update.modal.speed',
                (progressInfo.bytesPerSecond / 1024 / 1024).toFixed(2)
              )}
            </p>
          </div>
        </Modal>
      )}
    </div>
  )
}
