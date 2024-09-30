import { useState } from 'react'
import { Dropdown, message, Modal, Spin } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { use_appset } from '@renderer/models/appset.model'
import PasswordGenPanel from '@renderer/pages/Vault/PasswordGenPanel'
import { GetAllVaultData, ipc_call_normal, useIpcInvoke } from '@renderer/libs/tools/other'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import FileListSelectDialog from './FileListSelectDialog'
import { BackupFileItem } from '@common/entitys/drive.entity'
import ImportCsvSelectType from './ImportCsvSelectType'
import { GetImportVaultName } from '@common/help'
import { use_appstore } from '@renderer/models/app.model'
import { useHistory } from '@renderer/libs/router'
import { PagePath } from '@common/entitys/page.entity'
import ChangeMainPassword from './ChangeMainPass'
import InputDialog from './InputDialog'
import { DriveType } from '@common/entitys/drive.entity'
const { confirm } = Modal
interface MyDropDownProps {
  className?: string
}
export default function MyDropDown(props: MyDropDownProps): JSX.Element {
  const [showPasswordGen, setShowPasswordGen] = useState(false)
  const [showSelectBackupFile, setShowSelectBackupFile] = useState(false)
  const [showSelectImportType, setShowSelectImportType] = useState(false)
  const [showChangeMainPass, setShowChangeMainPass] = useState(false)
  const [showInputDialog, setShowInputDialog] = useState(false)
  const [BackupList, SetBackupList] = useState<BackupFileItem[]>([])
  const { loading, invoke } = useIpcInvoke<any>()
  const [messageApi, contextHolder] = message.useMessage()
  const history = useHistory()
  const getText = use_appset((state) => state.getText)
  const appstore = use_appstore()
  const getAllBackups = async () => {
    await invoke(webToManMsg.GetFilelistByDrive, DriveType.aliyun).then((res: BackupFileItem[]) => {
      if (res == null || res.length <= 0) return
      SetBackupList(res)
    })
  }
  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{
          onClick: async (item) => {
            if (item.key === 'password_gen') {
              setShowPasswordGen(true)
            } else if (item.key === 'app_restart') {
              await ipc_call_normal(webToManMsg.RestartApp)
            } else if (item.key == 'change_account') {
              await ipc_call_normal(webToManMsg.Logout)
            } else if (item.key == 'exit') {
              await ipc_call_normal(webToManMsg.QuitAPP)
            } else if (item.key == 'importcsv') {
              setShowSelectImportType(true)
            } else if (item.key == 'app_set') {
              history.push(PagePath.Admin_set)
            } else if (item.key == 'app_restart') {
              await ipc_call_normal(webToManMsg.RestartApp)
            } else if (item.key == 'check_update') {
              await ipc_call_normal(webToManMsg.checkUpdate)
            } else if (item.key == 'exportcsv') {
              const res = await ipc_call_normal<string>(webToManMsg.ExputCSV)
              if (res == null) return
              confirm({
                title: getText('mydropmenu.exportcsv.title'),
                icon: <ExclamationCircleOutlined />,
                content: getText('mydropmenu.exportcsv.content', res),
                okText: getText('ok'),
                cancelText: getText('cancel'),
                onOk: async () => {}
              })
            } else if (item.key == 'change_mainpass') {
              setShowChangeMainPass(true)
            } else if (item.key === 'local_backup_do') {
              await ipc_call_normal<string>(webToManMsg.Backup_local).then((filepath) => {
                if (filepath == null) return
                confirm({
                  title: getText('menu.backup.ok.title'),
                  icon: <ExclamationCircleOutlined />,
                  content: getText('menu.backup.ok.content', filepath),
                  okText: getText('ok'),
                  cancelText: getText('cancel')
                })
              })
            } else if (item.key === 'backup_drive_alidrive_do') {
              setShowInputDialog(true)
            } else if (item.key === 'recover_drive_alidrive_do') {
              await getAllBackups()
              setShowSelectBackupFile(true)
              return
            } else if (item.key === 'local_recover_do') {
              confirm({
                title: getText('menu.recover.sure.title'),
                icon: <ExclamationCircleOutlined />,
                content: getText('menu.recover.sure.content'),
                okText: getText('ok'),
                cancelText: getText('cancel'),
                onOk: async () => {
                  await ipc_call_normal<boolean>(webToManMsg.Recover_local).then((res) => {
                    if (res) {
                      confirm({
                        title: getText('menu.recover.ok.title'),
                        icon: <ExclamationCircleOutlined />,
                        content: getText('menu.recover.ok.content'),
                        okText: getText('ok'),
                        cancelText: getText('cancel'),
                        onOk: async () => {
                          await ipc_call_normal(webToManMsg.RestartApp)
                        }
                      })
                    }
                  })
                }
              })
            }
          },
          items: [
            {
              key: 'password_gen',
              label: getText('menu.password_gen')
            },
            {
              type: 'divider'
            },
            {
              key: 'backup_local',
              label: getText('menu.backup_local'),
              children: [
                {
                  key: 'local_backup_do',
                  label: getText('menu.systembackup')
                },
                {
                  key: 'local_recover_do',
                  label: getText('menu.systemRecover')
                }
              ]
            },
            {
              key: 'backup_drive',
              label: getText('menu.backup_drive'),
              children: [
                {
                  key: 'backup_drive_alidrive',
                  label: getText('menu.backup_drive_alidrive'),
                  children: [
                    {
                      key: 'backup_drive_alidrive_do',
                      label: getText('menu.backup_drive_alidrive_do')
                    },
                    {
                      key: 'recover_drive_alidrive_do',
                      label: getText('menu.backup_drive_alidrive_recover')
                    }
                  ]
                }
              ]
            },
            {
              type: 'divider'
            },
            {
              key: 'importcsv',
              label: getText('mydropmenu.importcsv')
            },
            {
              key: 'exportcsv',
              label: getText('mydropmenu.exportcsv')
            },
            {
              type: 'divider'
            },
            {
              key: 'app_exit',
              label: getText('app_exit')
            },
            {
              key: 'change_account',
              label: getText('mydropmenu.change_account')
            },
            {
              key: 'change_mainpass',
              label: getText('mydropmenu.change_mainpass')
            },
            {
              type: 'divider'
            },
            {
              key: 'app_set',
              label: getText('mydropmenu.set')
            },
            // {
            //   key: 'app_restart',
            //   label: 'app_restart'
            // },
            {
              key: 'check_update',
              label: getText('mydropmenu.checkupdate')
            }
          ]
        }}
      >
        <div className={` text-lg  ${props.className || ''}`}>
          <DownOutlined className=" text-sm" />
        </div>
      </Dropdown>
      {showPasswordGen && (
        <PasswordGenPanel
          show={showPasswordGen}
          onClose={() => {
            setShowPasswordGen(false)
          }}
          onOk={() => {
            setShowPasswordGen(false)
          }}
        ></PasswordGenPanel>
      )}
      {showSelectBackupFile && (
        <FileListSelectDialog
          show={showSelectBackupFile}
          filelist={BackupList}
          className="w-[80%]"
          onDelete={async (item) => {
            await invoke(webToManMsg.DeleteByDrive, DriveType.aliyun, item.file_id)
            await getAllBackups()
            message.success(getText('success'))
          }}
          onTrash={async (item) => {
            await invoke(webToManMsg.TrashByDrive, DriveType.aliyun, item.file_id)
            await getAllBackups()
            message.success(getText('success'))
          }}
          onClose={() => {
            setShowSelectBackupFile(false)
          }}
          onOk={(item) => {
            setShowSelectBackupFile(false)
            confirm({
              title: getText('menu.recover.sure.title'),
              icon: <ExclamationCircleOutlined />,
              content: getText('menu.recover.sure.content_alidrive', item.name),
              okText: getText('ok'),
              cancelText: getText('cancel'),
              onOk: () => {
                invoke(webToManMsg.RecoverByDrive, DriveType.aliyun, item).then((res: boolean) => {
                  if (res) {
                    confirm({
                      title: getText('menu.recover.ok.title'),
                      icon: <ExclamationCircleOutlined />,
                      content: getText('menu.recover.ok.content'),
                      okText: getText('ok'),
                      cancelText: getText('cancel'),
                      onOk: async () => {
                        await ipc_call_normal(webToManMsg.RestartApp)
                      }
                    })
                  }
                })
              }
            })
          }}
        ></FileListSelectDialog>
      )}
      {showSelectImportType && (
        <ImportCsvSelectType
          show={showSelectImportType}
          onClose={() => {
            setShowSelectImportType(false)
          }}
          onOk={async (type) => {
            setShowSelectImportType(false)
            const res = await ipc_call_normal<boolean>(webToManMsg.ImportCSV, type)
            if (res) {
              await GetAllVaultData(appstore, getText, messageApi)
              confirm({
                title: getText('mydropmenu.importcsv.title'),
                icon: <ExclamationCircleOutlined />,
                content: getText('mydropmenu.importcsv.content', GetImportVaultName(type)),
                okText: getText('ok'),
                cancelText: getText('cancel'),
                onOk: async () => {}
              })
            }
          }}
        ></ImportCsvSelectType>
      )}
      {showChangeMainPass && (
        <ChangeMainPassword
          show={showChangeMainPass}
          onOk={() => {
            setShowChangeMainPass(false)
          }}
          onClose={() => {
            setShowChangeMainPass(false)
          }}
        ></ChangeMainPassword>
      )}
      {showInputDialog && (
        <InputDialog
          show={showInputDialog}
          title={getText('mydropmenu.inputbackup_name.title')}
          input_text={`backup_${Math.ceil(new Date().getTime() / 1000)}`}
          onOk={async (value) => {
            setShowInputDialog(false)
            await invoke(webToManMsg.BackupByDrive, DriveType.aliyun, value).then(
              (res: boolean) => {
                if (res) {
                  confirm({
                    title: getText('menu.backup.ok.title'),
                    icon: <ExclamationCircleOutlined />,
                    content: getText('menu.backup.ok.content', res),
                    okText: getText('ok'),
                    cancelText: getText('cancel')
                  })
                }
              }
            )
          }}
          onClose={() => {
            setShowInputDialog(false)
          }}
        ></InputDialog>
      )}
      {loading && <Spin size="large" fullscreen />}
    </>
  )
}
