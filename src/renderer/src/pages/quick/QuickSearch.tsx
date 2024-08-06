import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Icon_type, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import { GetPasswordInfoString, IsVaultItemMatchSearch } from '@renderer/entitys/VaultItem.entity'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Input, message } from 'antd'
import { useMemo, useState } from 'react'

export default function QuickSearch() {
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  const [search, setSearch] = useState('')
  const [selectItem, setSelectItem] = useState<VaultItem>(null)
  const [messageApi, contextHolder] = message.useMessage()
  const [show_dettail, setShowDetail] = useState(false)
  const showitems = useMemo(() => {
    if (search && search.trim().length <= 0) return []
    return appstore.vaut_items.filter((item) => {
      if (IsVaultItemMatchSearch(item, search)) return true
      return false
    })
  }, [appstore, search])

  async function autoInput(info: VaultItem) {
    await ipc_call_normal(webToManMsg.AutoFill, info).catch((err) => {
      messageApi.error(appset.lang.getText(`err.${err.code}`))
    })
  }

  return (
    <div className="p-4">
      {contextHolder}
      <Input
        value={search}
        onChange={(event: any) => {
          setSearch(event.target.value)
        }}
        placeholder={appset.lang?.getText('quicksearch.input.placeholder')}
      ></Input>
      <div className="flex flex-col">
        {showitems.map((item) => {
          return (
            <div
              key={item.id}
              className={`flex flex-row items-center space-x-2 ${selectItem?.id == item.id ? ' bg-green-300' : ''}`}
              onClick={() => {
                console.log('click')
                if (selectItem?.id == item.id) {
                  if (item.vault_item_type != VaultItemType.Login) {
                    setShowDetail(true)
                  } else {
                    autoInput(item)
                  }
                }
              }}
            >
              <Icon type={item.icon} svg></Icon>
              <div>{item.name}</div>
              <div>{GetPasswordInfoString(item)}</div>
              {selectItem?.id == item.id && (
                <>
                  {item.vault_item_type == VaultItemType.Login && (
                    <>
                      <div>{appset.lang.getText('quicksearch.autoinput')}</div>
                      <Icon
                        type={Icon_type.icon_detail}
                        svg
                        onClick={() => {
                          setShowDetail(true)
                        }}
                      ></Icon>
                    </>
                  )}
                  {<div>{appset.lang.getText('quicksearch.viewDetail')}</div>}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
