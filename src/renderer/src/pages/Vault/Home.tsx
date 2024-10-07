import { PagePath } from '@common/entitys/page.entity'
import { ModalType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import { useHistory } from '@renderer/libs/router'
import { use_appstore } from '@renderer/models/app.model'
import { Button, message, Pagination } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import AddValutPanel from './AddVaultPanel'
import { ConsoleLog } from '@renderer/libs/Console'
import { getAllVault } from '@renderer/libs/tools/other'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Vault } from '@common/entitys/vault.entity'
import MyDropDown from '@renderer/components/MyDropDown'
import { MenuParamNull } from '@renderer/entitys/menu.entity'
import { shortKeys } from '@renderer/libs/tools/shortKeys'
import { KEY_MAP } from '@common/keycode'
import { useKeyboardNavigation } from '@renderer/libs/tools/keyboardNavigation'
export default function Home() {
  ConsoleLog.info('home render')
  const history = useHistory()
  const getText = use_appset((state) => state.getText) as AppsetStore['getText']

  const [messageApi, contextHolder] = message.useMessage()
  const [show_edit, setShowEdit] = useState(false)
  const [show_del, setShowDel] = useState(false)
  const [edit_panel_title, setEditPanelTitle] = useState('')
  const [show_type, setShowType] = useState(ModalType.Add)
  const [page_size, setPageNum] = useState(10)
  const [cur_page, setCurPage] = useState(1)
  const [cur_info, setCurInfo] = useState<Vault>({} as Vault)
  const appstore = use_appstore()
  const [select_vault, setSelectVault] = useState<Vault>(null)
  const select_vault_ref = useRef<Vault>(null)
  const showItemsRef = useRef<Vault[]>(null)
  const showitems = useMemo(() => {
    const items = appstore.vaults.slice((cur_page - 1) * page_size, cur_page * page_size)
    showItemsRef.current = items
    return items
  }, [appstore.vaults, cur_page, page_size])
  const { selectedIndex, setTotalCount, setIsFocus } = useKeyboardNavigation()
  useEffect(() => {
    setTotalCount(showitems.length)
  }, [showitems.length])
  useEffect(() => {
    setIsFocus(true)
  }, [])
  useEffect(() => {
    if (showitems.length > 0) {
      setSelectVault(showitems[selectedIndex])
    }
  }, [selectedIndex, showitems])
  useEffect(() => {
    shortKeys.bindShortKey(KEY_MAP.enter, () => {
      const select_item = select_vault_ref.current
      if (select_item) {
        history.push(`${PagePath.vault}/${select_item.id}/${MenuParamNull}`)
      }
      return false
    })
    return () => {
      shortKeys.unbindShortKey(KEY_MAP.enter)
    }
  }, [])

  useEffect(() => {
    if (showitems && showitems.length > 0) {
      if (select_vault == null || showitems.some((valut) => valut.id == select_vault.id) == false) {
        setSelectVault(showitems[0])
      }
    }
  }, [showitems])
  useEffect(() => {
    if (select_vault_ref.current != select_vault) {
      select_vault_ref.current = select_vault
    }
  }, [select_vault])

  function handleShowAdd() {
    setEditPanelTitle(getText('home.add.title'))
    setShowType(ModalType.Add)
    setShowDel(false)
    setShowEdit(true)
  }

  useEffect(() => {
    if (appstore.quick_input.quick_add || appstore.quick_input.quick_search) {
      handleShowAdd()
      appstore.setQuickInput({ quick_add: false, quick_search: false })
    }
  }, [appstore.quick_input])

  return (
    <div className="  bg-gray-100 p-8 h-screen">
      <div className="">
        <div className="">
          <div className=" flex flex-row space-x-1 items-center mb-4">
            <h1 className="text-2xl font-semibold ">{getText('home.title')}</h1>
            <MyDropDown />
          </div>
          <Button
            className="mb-4"
            type="primary"
            onClick={() => {
              handleShowAdd()
            }}
          >
            {getText('home.add.button')}
          </Button>
          <div className="flex  flex-wrap items-center justify-start">
            {showitems.map((valut) => {
              return (
                <div
                  key={valut.id}
                  className={`${select_vault && select_vault.id == valut.id ? 'border-solid  border-purple-400' : ''} flex flex-col bg-white shadow-md rounded-lg p-4 w-64 border-t-4 h-[150px] mr-4 mb-4`}
                  onClick={() => {
                    history.push(`${PagePath.vault}/${valut.id}/${MenuParamNull}`)
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold">{valut.name}</h2>
                    <Icon svg type={valut.icon} className=" w-8 h-8" />
                  </div>
                  <div className=" text-gray-600  w-[100%] text-wrap break-words flex-grow">
                    {valut.info}
                  </div>
                  <div className="flex justify-between items-center ">
                    <Icon
                      type="icon-set"
                      className=" text-gray-400 "
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditPanelTitle('编辑密码库')
                        setCurInfo(valut)
                        setShowType(ModalType.Edit)
                        setShowDel(true)
                        setShowEdit(true)
                      }}
                    ></Icon>

                    <Icon
                      type="icon-goto"
                      className=" text-gray-400"
                      onClick={() => {
                        history.push(`${PagePath.vault}/${valut.id}/${MenuParamNull}`)
                      }}
                    ></Icon>
                  </div>
                </div>
              )
            })}
          </div>
          <Pagination
            style={{ textAlign: 'center' }}
            defaultCurrent={cur_page}
            defaultPageSize={page_size}
            total={appstore.vaults.length}
            onChange={(page) => {
              setCurPage(page)
            }}
            onShowSizeChange={(_, size) => {
              setPageNum(size)
            }}
          />
        </div>
      </div>
      {show_edit && (
        <AddValutPanel
          show={show_edit}
          title={edit_panel_title}
          show_type={show_type}
          edit_info={cur_info}
          show_del={show_del}
          onAddOk={async () => {
            await getAllVault(appstore, getText, messageApi)
            setShowEdit(false)
          }}
          onClose={() => {
            setShowEdit(false)
          }}
          onDelOk={async () => {
            await getAllVault(appstore, getText, messageApi)
            setShowEdit(false)
          }}
        />
      )}
      {contextHolder}
    </div>
  )
}
