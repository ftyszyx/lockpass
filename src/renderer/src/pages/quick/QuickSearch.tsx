import { renderViewType } from '@common/entitys/app.entity'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Icon_type, VaultItemType } from '@common/gloabl'
import { GetTrueKey, KEY_MAP } from '@common/keycode'
import Icon from '@renderer/components/Icon'
import {
  GetPasswordInfoString,
  GetPasswordRenderDetailList,
  IsVaultItemMatchSearch,
  PasswordRenderDetailKey
} from '@renderer/entitys/Vault_item.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { shortKeys } from '@renderer/libs/tools/shortKeys'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, Input, InputRef, message } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function QuickSearch() {
  const getText = use_appset((state) => state.getText) as AppsetStore['getText']
  const appstore = use_appstore() as AppStore
  const [search, setSearch] = useState('')
  const [selectItem, setSelectItem] = useState<VaultItem>(null)
  const [messageApi, contextHolder] = message.useMessage()
  const [show_detail, setShowDetail] = useState(false)
  const [select_detail_item, setSelectDetailItem] = useState('selectItem')
  const selectDetailItemRef = useRef(select_detail_item)
  const inputref = useRef<InputRef>(null)
  const showitems = useMemo(() => {
    let items = []
    if (search && search.trim().length > 0) {
      items = appstore.vault_items.filter((item) => {
        if (IsVaultItemMatchSearch(item, search)) return true
        return false
      })
    }
    return items
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
    window.electron.ipcRenderer.on(MainToWebMsg.WindowsShow, () => {
      foucsInput()
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.WindowsShow)
    }
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.WindowsHide, () => {
      setSearch('')
      setShowDetail(false)
      setSelectItem(null)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.WindowsHide)
    }
  }, [])
  useEffect(() => {
    if (show_detail == false) foucsInput()
  }, [show_detail])

  const selectItemRef = useRef(selectItem)
  // ConsoleLog.info(`QuickSearch render:selenctItem:${selectItem ? JSON.stringify(selectItem) : ''}`)
  const showitemsRef = useRef(showitems)
  const showDetailRef = useRef(show_detail)
  useEffect(() => {
    if (selectItem == null && showitems.length > 0) {
      setSelectItem(showitems[0])
    }
    if (showitems.length == 0) {
      setShowDetail(false)
      setSelectItem(null)
    }
  }, [showitems])

  useEffect(() => {
    showDetailRef.current = show_detail
  }, [show_detail])

  useEffect(() => {
    selectItemRef.current = selectItem
  }, [selectItem])

  useEffect(() => {
    showitemsRef.current = showitems
  }, [showitems])

  async function autoInput(info: VaultItem) {
    await ipc_call_normal(webToManMsg.AutoFill, info).catch((err) => {
      messageApi.error(getText(`err.${err.code}`))
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
    if (show_detail) {
      const new_list = [SELECT_ITEM_STR]
      if (selectItem == null) return
      GetPasswordRenderDetailList(selectItem).forEach((item) => {
        new_list.push(item.key)
      })
      new_list.push(GOTO_STR)
      let curindex2 = new_list.findIndex((item) => item == selectDetail)
      if (dir == 'up') {
        curindex2 = getIndex(curindex2 - 1, new_list.length)
      } else {
        curindex2 = getIndex(curindex2 + 1, new_list.length)
      }
      setSelectDetailItem(new_list[curindex2])
      selectDetailItemRef.current = new_list[curindex2]
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
    const value = selectItemRef.current.info[key]
    ConsoleLog.info(`copy and close ${key} ${value}`)
    navigator.clipboard.writeText(value)
    messageApi.success(getText('copy_success_arg', getText(`vaultitem.label.${key}`)))
    setTimeout(async () => {
      await HideWin()
    }, 300)
  }

  useEffect(() => {
    shortKeys.bindShortKey(KEY_MAP.esc, () => {
      HideWin()
      return true
    })
    return () => {
      shortKeys.unbindShortKey(KEY_MAP.esc)
    }
  }, [])

  function handlerCopy(keytype: PasswordRenderDetailKey) {
    ConsoleLog.info(`handlerCopy ${keytype}`)
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
      if (event.ctrlKey && event.key == 'c') {
        ConsoleLog.info('ctrl c')
        handlerCopy(PasswordRenderDetailKey.ctrl_C)
        return
      }
      if (event.ctrlKey && event.altKey && event.key == 'c') {
        ConsoleLog.info('ctrl alt c')
        handlerCopy(PasswordRenderDetailKey.ctrl_alt_c)
        return
      }
      if (event.ctrlKey && event.shiftKey && event.key == 'c') {
        ConsoleLog.info('ctrl shift c')
        handlerCopy(PasswordRenderDetailKey.ctrl_shift_C)
        return
      }
      const truekey = GetTrueKey(event)
      switch (truekey) {
        case KEY_MAP.up:
          // 处理向上箭头键
          moveSelectPos('up')
          break
        case KEY_MAP.down:
          // 处理向下箭头键
          moveSelectPos('down')
          break
        case KEY_MAP.right:
          if (selectItem) setShowDetail(true)
          break
        case KEY_MAP.left:
          setShowDetail(false)
          setSelectItem(null)
          break
        case KEY_MAP.esc:
          break
        case KEY_MAP.enter:
          ConsoleLog.info(`enter show_detail:${show_detail} selectItemDetail:${selectItemDetail}`)
          if (show_detail) {
            if (selectItemDetail == SELECT_ITEM_STR) {
              setShowDetail(false)
              setSelectItem(null)
            } else if (selectItemDetail == GOTO_STR) {
              GotoMain(selectItem)
              HideWin()
            } else {
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
      const show_detail = showDetailRef.current
      const selectItem = selectItemRef.current
      if (event.key == 'Enter') {
        if (selectItem && !show_detail) {
          if (selectItem.vault_item_type != VaultItemType.Login) {
            setShowDetail(true)
          } else {
            await autoInput(selectItem)
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
        placeholder={getText('quicksearch.input.placeholder')}
      ></Input>
      <div className="flex flex-col">
        {!show_detail &&
          showitems.map((item) => {
            return (
              <div
                key={item.id}
                className={`flex flex-row items-center p-2 font-sans  text-sm text-nowrap overflow-hidden  space-x-2 ${selectItem?.id == item.id ? 'text-white bg-blue-500' : ''}`}
                onClick={() => {
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
                        <div>{getText('quicksearch.autoinput')}</div>
                      </>
                    ) : (
                      <>
                        <div>{getText('quicksearch.viewDetail')}</div>
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
                      ConsoleLog.info(`click ${item.key}`)
                      CopyAndClose(item.key)
                    }}
                  >
                    <div>{getText('quicksearch.copy', getText(`vaultitem.label.${item.key}`))}</div>
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
                {getText('quicksearch.gotoView')}
              </Button>
            </div>
          </div>
        )}
        {selectItem && (
          <div className="flex flex-row justify-between border-solid border-gray-200 border-t-2 py-2">
            {!show_detail && (
              <div className=" flex flex-row items-center space-x-2 font-sans font-bold">
                <div className=" bg-gray-200 py-1 px-2 rounded-md">{'→'}</div>
                <div>{getText('quicksearch.rightclick')}</div>
              </div>
            )}
            {show_detail && (
              <div className=" flex flex-row items-center space-x-2 font-sans font-bold">
                <div className=" bg-gray-200 py-1 px-2 rounded-md">{'←'}</div>
                <div>{getText('quicksearch.leftclick')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
