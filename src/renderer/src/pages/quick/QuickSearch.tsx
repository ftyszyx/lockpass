import { renderViewType } from '@common/entitys/app.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Icon_type, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import {
  GetPasswordInfoString,
  GetPasswordRenderDetailList,
  IsVaultItemMatchSearch
} from '@renderer/entitys/VaultItem.entity'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, Input, InputRef, message } from 'antd'
import { clipboard } from 'electron'
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

  async function HideWin() {
    await ipc_call_normal(webToManMsg.showWindows, renderViewType.Quickview, false)
  }

  async function GotoMain(info: VaultItem) {
    await ipc_call_normal(webToManMsg.ShowVaultItem, info.id)
  }

  function foucsInput() {
    inputref.current?.focus({
      cursor: 'start'
    })
  }
  useEffect(() => {
    foucsInput()
  }, [])
  const selectItemRef = useRef(selectItem)
  const showitemsRef = useRef(showitems)
  selectItemRef.current = selectItem
  showitemsRef.current = showitems
  useEffect(() => {
    if (selectItem == null && showitems.length > 0) {
      setSelectItem(showitems[0])
    }
  }, [showitems])

  async function autoInput(info: VaultItem) {
    await ipc_call_normal(webToManMsg.AutoFill, info).catch((err) => {
      messageApi.error(appset.lang.getText(`err.${err.code}`))
    })
  }

  function moveSelectPos(dir: string) {
    const showitems = showitemsRef.current
    const selectItem = selectItemRef.current
    if (showitems.length == 0) return
    const curindex = showitems.findIndex((item) => item.id == selectItem.id)
    if (dir == 'up') {
      if (curindex > 0) {
        setSelectItem(showitems[curindex - 1])
      }
    } else {
      if (curindex < showitems.length - 1) {
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
          if (selectItemRef.current) {
            autoInput(selectItemRef.current)
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
        {!show_dettail &&
          showitems.map((item) => {
            return (
              <div
                key={item.id}
                className={`flex flex-row items-center p-2 font-sans  text-sm text-nowrap overflow-hidden  space-x-2 ${selectItem?.id == item.id ? 'text-white bg-blue-500' : ''}`}
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
                <div className={`font-bold`}>{item.name}</div>
                <div className=" flex-grow text-ellipsis text-nowrap">
                  {GetPasswordInfoString(item)}
                </div>
                {selectItem?.id == item.id && (
                  <>
                    {item.vault_item_type == VaultItemType.Login ? (
                      <>
                        <div>{appset.getText('quicksearch.autoinput')}</div>
                      </>
                    ) : (
                      <>
                        <div>{appset.getText('quicksearch.viewDetail')}</div>
                      </>
                    )}
                  </>
                )}
                <Icon
                  type={Icon_type.icon_detail}
                  className={`${selectItem?.id == item.id ? 'fill-white' : ' fill-green-300 '} `}
                  onClick={() => {
                    setShowDetail(true)
                  }}
                ></Icon>
              </div>
            )
          })}
        {show_dettail && (
          <div>
            {/* hader */}
            <div className=" flex flex-row">
              <Icon type={selectItem?.icon} svg></Icon>
              <div className=" flex flex-grow flex-col">
                <div>{selectItem?.name}</div>
                <div>{GetPasswordInfoString(selectItem)}</div>
              </div>
              <Icon
                type={Icon_type.icon_del}
                onClick={() => {
                  setShowDetail(false)
                }}
              ></Icon>
            </div>
            {/* body */}
            <div className=" flex flex-col">
              {GetPasswordRenderDetailList(selectItem).map((item) => {
                return (
                  <div
                    key={item.key}
                    className="flex flex-row items-center justify-between"
                    onClick={() => {
                      clipboard.writeText(selectItem[item.key])
                      messageApi.success(
                        appset.getText(
                          'copy_success_arg',
                          appset.getText(`vaultitem.label.${item.key}`)
                        )
                      )
                      HideWin()
                    }}
                  >
                    <div>
                      {appset.getText(
                        'quicksearch.copy',
                        appset.getText(`vaultitem.label.${item.key}`)
                      )}
                    </div>
                    <div>{item.shortCut}</div>
                  </div>
                )
              })}
            </div>
            <div>
              <Button
                onClick={async () => {
                  await GotoMain(selectItem)
                  await HideWin()
                }}
              >
                {appset.getText('quicksearch.gotoView')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
