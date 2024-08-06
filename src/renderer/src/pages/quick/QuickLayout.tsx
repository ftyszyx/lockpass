import { EntityType, renderViewType } from '@common/entitys/app.entity'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { User } from '@common/entitys/user.entity'
import { ChildProps } from '@renderer/entitys/other.entity'
import { getAllVault, getAllVaultItem, ipc_call_normal } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { message } from 'antd'
import { useEffect, useState } from 'react'

export default function QucickLayout(props: ChildProps): JSX.Element {
  const appstore = use_appstore() as AppStore
  const appset = use_appset() as AppsetStore
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    const timer = setInterval(() => {
      checkSize()
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    initData()
    window.electron.ipcRenderer.on(MainToWebMsg.DataChange, (_, changetype: EntityType) => {
      if (changetype == EntityType.vault) getAllVault(appstore, appset.lang, messageApi)
      else if (changetype == EntityType.vault_item)
        getAllVaultItem(appstore, appset.lang, messageApi)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.DataChange)
    }
  }, [])

  async function initData() {
    const curuser = await ipc_call_normal<User>(webToManMsg.getCurUserInfo)
    appstore.SetUser(curuser)
    await getAllVault(appstore, appset.lang, messageApi)
    await getAllVaultItem(appstore, appset.lang, messageApi)
  }

  async function checkSize() {
    const rect = document.body.getBoundingClientRect()
    if (rect.height == window.innerHeight) return
    await window.electron.ipcRenderer.invoke(
      webToManMsg.ResizeWindow,
      renderViewType.Quickview,
      0,
      rect.height
    )
  }
  return (
    <div>
      {contextHolder}
      {props.children}
    </div>
  )
}
