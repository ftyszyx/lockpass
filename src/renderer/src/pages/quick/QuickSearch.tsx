import { renderViewType } from '@common/entitys/app.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Icon_type, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import {
  GetPasswordInfoString,
  GetPasswordRenderDetailList,
  IsVaultItemMatchSearch,
  PasswordRenderDetailKey
} from '@renderer/entitys/VaultItem.entity'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, Input, InputRef, message } from 'antd'
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
    if (showitems.length == 0) {
      setShowDetail(false)
      setSelectItem(null)
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

  async function CopyAndClose(key: string) {
    navigator.clipboard.writeText(selectItem[key])
    messageApi.success(appset.getText('copy_success_arg', appset.getText(`vaultitem.label.${key}`)))
    await HideWin()
  }

  function handlerCopy(keytype: PasswordRenderDetailKey) {
    if (selectItem == null) return
    const keyinfo = GetPasswordRenderDetailList(selectItem).find((item) => item.shortCut == keytype)
    if (keyinfo) {
      CopyAndClose(keyinfo.key)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key == 'c') {
        handlerCopy(PasswordRenderDetailKey.ctrl_C)
        return
      }
      if (event.ctrlKey && event.altKey && event.key == 'c') {
        handlerCopy(PasswordRenderDetailKey.ctrl_alt_c)
        return
      }
      if (event.ctrlKey && event.shiftKey && event.key == 'c') {
        handlerCopy(PasswordRenderDetailKey.ctrl_shift_C)
        return
      }
      switch (event.key) {
        case 'ArrowUp':
          // 处理向上箭头键
          moveSelectPos('up')
          break
        case 'ArrowDown':
          // 处理向下箭头键
          moveSelectPos('down')
          break
        case 'ArrowRight':
          if (selectItem) setShowDetail(true)
          break
        case 'ArrowLeft':
          setShowDetail(false)
          setSelectItem(null)
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
        {show_dettail && selectItem && (
          <div>
            {/* hader */}
            <div className=" flex flex-row items-center py-2 border-solid border-b-gray-200 border-b-2">
              <Icon
                type={selectItem?.icon}
                className="w-[30px] h-[30px] bg-gray-200 rounded-md mr-2"
                svg
              ></Icon>
              <div className=" flex flex-grow flex-col">
                <div className=" font-sans font-bold">{selectItem?.name}</div>
                <div>{GetPasswordInfoString(selectItem)}</div>
              </div>
              <Icon
                type={Icon_type.icon_close1}
                className="nodrag hover:bg-green-400 cursor-pointer w-[40px] h-[40px] p-2 rounded-md"
                onClick={() => {
                  setShowDetail(false)
                }}
                svg
              ></Icon>
            </div>
            {/* body */}
            <div className=" flex flex-col space-y-2 text-sm font-sans border-b-2 border-solid border-gray-200">
              {GetPasswordRenderDetailList(selectItem).map((item) => {
                return (
                  <div
                    key={item.key}
                    className=" rounded-sm flex flex-row items-center justify-between hover:bg-green-300 nodrag cursor-pointer p-2"
                    onClick={() => {
                      CopyAndClose(item.key)
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
            <div className=" py-2 ">
              <Button
                className=" m-auto w-full nodrag"
                type="primary"
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
        {selectItem && (
          <div className="flex flex-row justify-between border-solid border-gray-200 border-t-2 py-2">
            {!show_dettail && (
              <div className=" flex flex-row items-center space-x-2 font-sans font-bold">
                <div className=" bg-gray-200 py-1 px-2 rounded-md">{'→'}</div>
                <div>{appset.getText('quicksearch.rightclick')}</div>
              </div>
            )}
            {show_dettail && (
              <div className=" flex flex-row items-center space-x-2 font-sans font-bold">
                <div className=" bg-gray-200 py-1 px-2 rounded-md">{'←'}</div>
                <div>{appset.getText('quicksearch.leftclick')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
