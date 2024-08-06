import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Icon_type, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import { GetPasswordInfoString, IsVaultItemMatchSearch } from '@renderer/entitys/VaultItem.entity'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Input, InputRef, message } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function QuickSearch() {
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  const [search, setSearch] = useState('')
  const [selectItem, setSelectItem] = useState<VaultItem>(null)
  const [messageApi, contextHolder] = message.useMessage()
  const [show_dettail, setShowDetail] = useState(false)
  const inputref = useRef<InputRef>(null)
  const showitems = useMemo(() => {
    if (search && search.trim().length > 0) {
      return appstore.vaut_items.filter((item) => {
        if (IsVaultItemMatchSearch(item, search)) return true
        return false
      })
    }
    return []
  }, [appstore, search])
  const selectItemRef = useRef(selectItem)
  const showitemsRef = useRef(showitems)
  console.log('render', selectItem)
  console.log('render2', selectItemRef.current)
  console.log('render3', showitemsRef.current)

  useEffect(() => {
    if (selectItem == null && showitems.length > 0) {
      console.log('change select')
      setSelectItem(showitems[0])
    }
  }, [showitems])

  async function autoInput(info: VaultItem) {
    await ipc_call_normal(webToManMsg.AutoFill, info).catch((err) => {
      messageApi.error(appset.lang.getText(`err.${err.code}`))
    })
  }

  function moveSelectPos(dir: string) {
    console.log('moveSelectPos', dir, showitems, selectItemRef.current)
    if (showitems.length == 0) return
    var curindex = showitems.findIndex((item) => item.id == selectItemRef.current.id)
    console.log('curindex', curindex, selectItem, showitems.length, showitems, dir)
    if (dir == 'up') {
      if (curindex > 0) {
        console.log('up', showitems[curindex - 1])
        setSelectItem(showitems[curindex - 1])
      }
    } else {
      if (curindex < showitems.length - 1) {
        console.log('down', showitems[curindex + 1])
        setSelectItem(showitems[curindex + 1])
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          // 处理向上箭头键
          moveSelectPos('up')
          break
        case 'ArrowDown':
          // 处理向下箭头键
          moveSelectPos('down')
          break
        case 'Enter':
          // 处理回车键
          if (selectItem) {
            autoInput(selectItem)
          }
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="p-4">
      {contextHolder}
      <Input
        className="nodrag mb-3"
        allowClear
        ref={inputref}
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
              className={`flex flex-row items-center p-2 font-sans font-bold text-sm text-nowrap text-ellipsis overflow-hidden text-white space-x-2 ${selectItem?.id == item.id ? ' bg-blue-500' : ''}`}
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
              <Icon type={item.icon} svg className=" bg-gray-200"></Icon>
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
