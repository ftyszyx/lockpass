import { useState } from 'react'
import { Dropdown, Modal } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import PasswordGenPanel from '@renderer/pages/Vault/PasswordGenPanel'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import FileListSelectDialog from './FileListSelectDialog'
import { BackupFileItem } from '@common/entitys/backup.entity'
const { confirm } = Modal
interface MyDropDownProps {
  className?: string
}
export default function MyDropDown(props: MyDropDownProps): JSX.Element {
  const [showPasswordGen, setShowPasswordGen] = useState(false)
  const [showSelectBackupFile, setShowSelectBackupFile] = useState(false)
  const [BackupList, SetBackupList] = useState<BackupFileItem[]>([])
  const appset = use_appset() as AppsetStore
  return (
    <>
      <Dropdown
        menu={{
          onClick: async (item) => {
            if (item.key === 'password_gen') {
              setShowPasswordGen(true)
            } else if (item.key === 'local_backup_do') {
              ipc_call_normal<string>(webToManMsg.Backup_local).then((filepath) => {
                if (filepath == null) return
                confirm({
                  title: appset.getText('menu.backup.ok.title'),
                  icon: <ExclamationCircleOutlined />,
                  content: appset.getText('menu.backup.ok.content', filepath),
                  okText: appset.getText('ok'),
                  cancelText: appset.getText('cancel')
                })
              })
            } else if (item.key === 'backup_drive_alidrive_do') {
              ipc_call_normal<boolean>(webToManMsg.Backup_alidrive).then((res) => {
                if (res) {
                  confirm({
                    title: appset.getText('menu.backup.ok.title'),
                    icon: <ExclamationCircleOutlined />,
                    content: appset.getText('menu.backup.ok.content', res),
                    okText: appset.getText('ok'),
                    cancelText: appset.getText('cancel')
                  })
                }
              })
            } else if (item.key === 'recover_drive_alidrive_do') {
              ipc_call_normal<BackupFileItem[]>(webToManMsg.GetAllBackups_alidrive).then((res) => {
                if (res == null || res.length <= 0) return
                SetBackupList(res)
                setShowSelectBackupFile(true)
              })
              return
            } else if (item.key === 'local_recover_do') {
              confirm({
                title: appset.getText('menu.recover.sure.title'),
                icon: <ExclamationCircleOutlined />,
                content: appset.getText('menu.recover.sure.content'),
                okText: appset.getText('ok'),
                cancelText: appset.getText('cancel'),
                onOk: () => {
                  ipc_call_normal<boolean>(webToManMsg.Recover_local).then((res) => {
                    if (res) {
                      confirm({
                        title: appset.getText('menu.recover.ok.title'),
                        icon: <ExclamationCircleOutlined />,
                        content: appset.getText('menu.recover.ok.content'),
                        okText: appset.getText('ok'),
                        cancelText: appset.getText('cancel'),
                        onOk: async () => {
                          await ipc_call_normal(webToManMsg.QuitAPP)
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
              label: appset.getText('menu.password_gen')
            },
            {
              key: 'backup_local',
              label: appset.getText('menu.backup_local'),
              children: [
                {
                  key: 'local_backup_do',
                  label: appset.getText('menu.systembackup')
                },
                {
                  key: 'local_recover_do',
                  label: appset.getText('menu.systemRecover')
                }
              ]
            },
            {
              key: 'backup_drive',
              label: appset.getText('menu.backup_drive'),
              children: [
                {
                  key: 'backup_drive_alidrive',
                  label: appset.getText('menu.backup_drive_alidrive'),
                  children: [
                    {
                      key: 'backup_drive_alidrive_do',
                      label: appset.getText('menu.backup_drive_alidrive_do')
                    },
                    {
                      key: 'recover_drive_alidrive_do',
                      label: appset.getText('menu.backup_drive_alidrive_recover')
                    }
                  ]
                }
              ]
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
          onClose={() => {
            setShowSelectBackupFile(false)
          }}
          onOk={(item) => {
            setShowSelectBackupFile(false)
            confirm({
              title: appset.getText('menu.recover.sure.title'),
              icon: <ExclamationCircleOutlined />,
              content: appset.getText('menu.recover.sure.content_alidrive', item.name),
              okText: appset.getText('ok'),
              cancelText: appset.getText('cancel'),
              onOk: () => {
                ipc_call_normal<boolean>(webToManMsg.Recover_alidrive, item.name).then((res) => {
                  if (res) {
                    confirm({
                      title: appset.getText('menu.recover.ok.title'),
                      icon: <ExclamationCircleOutlined />,
                      content: appset.getText('menu.recover.ok.content'),
                      okText: appset.getText('ok'),
                      cancelText: appset.getText('cancel'),
                      onOk: async () => {
                        await ipc_call_normal(webToManMsg.QuitAPP)
                      }
                    })
                  }
                })
              }
            })
          }}
        ></FileListSelectDialog>
      )}
    </>
  )
}
