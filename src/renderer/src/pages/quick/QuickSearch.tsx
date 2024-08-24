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
  const [show_detail, setShowDetail] = useState(false)
  const [select_detail_item, setSelectDetailItem] = useState('selectItem')
  const selectDetailItemRef = useRef(select_detail_item)
  const inputref = useRef<InputRef>(null)
  const showitems = useMemo(() => {
    if (search && search.trim().length > 0) {
      return appstore.vault_items.filter((item) => {
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
    await ipc_call_normal(webToManMsg.ShowVaultItem, info.vault_id, info.id)
  }

  function foucsInput() {
    inputref.current?.focus({
      cursor: 'start'
    })
  }
  useEffect(() => {
    if (show_detail == false) foucsInput()
  }, [show_detail])

  const selectItemRef = useRef(selectItem)
  const showitemsRef = useRef(showitems)
  selectItemRef.current = selectItem
  showitemsRef.current = showitems
  const showDetailRef = useRef(show_detail)
  useEffect(() => {
    showDetailRef.current = show_detail
  }, [show_detail])
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
      messageApi.error(appset.getText(`err.${err.code}`))
    })
  }

  function getIndex(index: number, max: number) {
    if (index < 0) return max + index
    if (index >= max) return index - max
    return index
  }

  const SELECT_ITEM_STR = 'selectItem'
  const GOTO_STR = 'goto'
  function moveSelectPos(dir: string) {
    const showitems = showitemsRef.current
    const selectItem = selectItemRef.current
    const show_detail = showDetailRef.current
    const selectDetail = selectDetailItemRef.current
    console.log('moveSelectPos', dir)
    if (show_detail) {
      const new_list = [SELECT_ITEM_STR]
      if (selectItem == null) return
      GetPasswordRenderDetailList(selectItem).forEach((item) => {
        new_list.push(item.key)
      })
      new_list.push(GOTO_STR)
      console.log('new list', new_list, selectDetail)
      let curindex2 = new_list.findIndex((item) => item == selectDetail)
      if (dir == 'up') {
        curindex2 = getIndex(curindex2 - 1, new_list.length)
      } else {
        curindex2 = getIndex(curindex2 + 1, new_list.length)
      }
      setSelectDetailItem(new_list[curindex2])
      selectDetailItemRef.current = new_list[curindex2]
      console.log('selectdetail', new_list[curindex2], curindex2)
      return
    }
    if (showitems.length == 0) return
    let curindex = 0
    if (selectItem) {
      curindex = showitems.findIndex((item) => item.id == selectItem.id)
    }
    if (dir == 'up') {
      curindex = getIndex(curindex - 1, showitems.length)
    } else {
      curindex = getIndex(curindex + 1, showitems.length)
    }
    setSelectItem(showitems[curindex])
  }

  async function CopyAndClose(key: string) {
    navigator.clipboard.writeText(selectItem[key])
    messageApi.success(appset.getText('copy_success_arg', appset.getText(`vaultitem.label.${key}`)))
    await HideWin()
  }

  function handlerCopy(keytype: PasswordRenderDetailKey) {
    const selectItem = selectItemRef.current
    if (selectItem == null) return
    const keyinfo = GetPasswordRenderDetailList(selectItem).find((item) => item.shortCut == keytype)
    if (keyinfo) {
      CopyAndClose(keyinfo.key)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const selectItem = selectItemRef.current
      const show_detail = showDetailRef.current
      const selectItemDetail = selectDetailItemRef.current
      console.log('handlekeydown', event.key, selectItem)
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
          if (show_detail) {
            if (selectItemDetail == SELECT_ITEM_STR) {
              setShowDetail(false)
              setSelectItem(null)
            } else if (selectItemDetail == GOTO_STR) {
              GotoMain(selectItem)
              HideWin()
            } else {
              console.log('copy and close', selectItemDetail)
              CopyAndClose(selectItemDetail)
            }
          }
          // 处理回车键
          break
        default:
          break
      }
    }
    const handleKeyUP = async (event: KeyboardEvent) => {
      if (event.key == 'Enter') {
        if (selectItemRef.current && !show_detail) {
          if (selectItemRef.current.vault_item_type != VaultItemType.Login) {
            setShowDetail(true)
          } else {
            await autoInput(selectItemRef.current)
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUP)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUP)
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
        placeholder={appset.getText('quicksearch.input.placeholder')}
      ></Input>
      <div className="flex flex-col">
        {!show_detail &&
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
                    k
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
        {show_detail && selectItem && (
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
                className={`nodrag hover:bg-green-400 cursor-pointer w-[40px] h-[40px] p-2 rounded-md ${select_detail_item == SELECT_ITEM_STR ? 'bg-green-300' : ''} `}
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
                    className={`rounded-sm flex flex-row items-center justify-between hover:bg-green-300 nodrag cursor-pointer p-2 ${select_detail_item == item.key ? ' bg-green-400' : ''}`}
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
            <div className={`py-2 ${select_detail_item == GOTO_STR ? ' bg-green-300' : ''}`}>
              <Button
                className=" m-auto w-full nodrag "
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
            {!show_detail && (
              <div className=" flex flex-row items-center space-x-2 font-sans font-bold">
                <div className=" bg-gray-200 py-1 px-2 rounded-md">{'→'}</div>
                <div>{appset.getText('quicksearch.rightclick')}</div>
              </div>
            )}
            {show_detail && (
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
