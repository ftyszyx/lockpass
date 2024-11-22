/*
desc: vault left side view
© 2024 zyx
date:2024/07/31 17:08:51
*/

import { VaultItem } from '@common/entitys/vault_item.entity'
import { Icon_type, VaultItemType } from '@common/gloabl'
import { KEY_MAP } from '@common/keycode'
import Icon from '@renderer/components/Icon'
import { MenuParamNull } from '@renderer/entitys/menu.entity'
import { ViewFocusType } from '@renderer/entitys/other.entity'
import { IsVaultItemMatchSearch } from '@renderer/entitys/Vault_item.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { useHistory, useRouterStore } from '@renderer/libs/router'
import { useKeyboardNavigation } from '@renderer/libs/tools/keyboardNavigation'
import { shortKeys } from '@renderer/libs/tools/shortKeys'
import { use_appstore } from '@renderer/models/app.model'
import { use_appset } from '@renderer/models/appset.model'
import { Select } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

interface VaultSideProps {
  onSelect: (item: VaultItem) => void
  global_search_keyword: string
  default_select_item?: VaultItem
}

export default function VaultSide(props: VaultSideProps) {
  const SelectAll = 'ALL'
  const [search_Password_type, set_Search_password_type] = useState(SelectAll)
  const [select_vault_item, set_select_vault_item] = useState<VaultItem>(null)
  const [rank_time_desc, set_rank_time_desc] = useState(true)
  const appstore = use_appstore()
  const appset = use_appset()
  const route_data = useRouterStore()
  const history = useHistory()
  const cur_vault_id = parseInt(route_data.match?.params['vault_id'])
  const selectedItemRef = useRef<HTMLDivElement>(null)
  const cur_vault_item_id = parseInt(route_data.match?.params['vault_item_id'])
  const [side_select_focus, set_side_select_focus] = useState(false)
  const getViewFoucs = use_appset((state) => state.GetViewFoucs)
  const setViewFoucs = use_appset((state) => state.SetViewFoucs)

  const show_items = useMemo(() => {
    let items = []
    if (props.global_search_keyword && props.global_search_keyword.length > 0) {
      items = appstore.vault_items.filter((item) => {
        if (IsVaultItemMatchSearch(item, props.global_search_keyword)) return true
        return false
      })
    } else {
      if (search_Password_type === SelectAll) {
        items = appstore.vault_items.filter((item) => item.vault_id == cur_vault_id)
      } else {
        items = appstore.vault_items.filter(
          (item) => item.vault_item_type === search_Password_type && item.vault_id == cur_vault_id
        )
      }
    }
    if (rank_time_desc) return items.sort((a, b) => b.create_time - a.create_time)
    return items.sort((a, b) => a.create_time - b.create_time)
  }, [
    appstore.vaults,
    search_Password_type,
    appstore.vault_items,
    cur_vault_id,
    rank_time_desc,
    props.global_search_keyword
  ])

  const { selectedIndex, setSelectedIndex, setTotalCount, setIsFocus } = useKeyboardNavigation()

  useEffect(() => {
    setTotalCount(show_items.length)
  }, [show_items.length])

  useEffect(() => {
    setIsFocus(side_select_focus)
    // console.log('side_select_focus', side_select_focus)
  }, [side_select_focus])

  useEffect(() => {
    const keycomba = KEY_MAP.ctrl + '+2'
    shortKeys.bindShortKey(keycomba, () => {
      // console.log('bindShortKey', keycomba)
      set_side_select_focus(true)
      setViewFoucs(ViewFocusType.VaultItem)
      return false
    })
    return () => {
      shortKeys.unbindShortKey(keycomba)
    }
  }, [])

  useEffect(() => {
    const view_focus = getViewFoucs()
    if (view_focus !== ViewFocusType.VaultItem) {
      set_side_select_focus(false)
    }
  }, [getViewFoucs()])

  useEffect(() => {
    // console.log('selectedIndex', selectedIndex)
    if (show_items.length > 0) {
      doSelectItem2(show_items[selectedIndex])
    }
  }, [selectedIndex])
  ConsoleLog.info(`render VaultSide `)
  useEffect(() => {
    if (show_items.length > 0) {
      if (
        select_vault_item == null ||
        !show_items.some((item) => item.id == select_vault_item.id)
      ) {
        DoSelectItem(show_items[0])
      }
    } else {
      DoSelectItem(null)
    }
  }, [show_items])

  useEffect(() => {
    if (cur_vault_item_id.toString() != MenuParamNull) {
      const item = show_items.find((item) => item.id == cur_vault_item_id)
      if (item) {
        DoSelectItem(item)
      }
    }
  }, [history.PathName])

  const DoSelectItem = (vault_item: VaultItem) => {
    setSelectedIndex(show_items.findIndex((item) => item.id == vault_item.id))
    doSelectItem2(vault_item)
  }

  const doSelectItem2 = (vault_item: VaultItem) => {
    set_select_vault_item(vault_item)
    props.onSelect(vault_item)
  }

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [select_vault_item])

  useEffect(() => {
    if (props.default_select_item) {
      if (show_items.some((item) => item.id == props.default_select_item.id)) {
        DoSelectItem(props.default_select_item)
      }
    }
  }, [props.default_select_item])

  return (
    <div
      className={` h-[var(--content-height)] flex w-[250px] flex-col bg-white border-r-2 border-solid  relative ${
        side_select_focus ? 'border-blue-500 border-solid border-4' : ''
      }`}
    >
      {/* first line */}
      <div className="flex flex-row justify-between items-center p-2">
        <Select
          value={search_Password_type}
          size="middle"
          // className="h-[40px] flex flex-row items-center"
          onChange={(value) => {
            set_Search_password_type(value)
          }}
          defaultValue={SelectAll}
        >
          <Select.Option value={SelectAll} key={SelectAll}>
            <div className="flex flex-row items-center space-x-1 w-[80px]">
              <Icon type={Icon_type.icon_type} svg className="" />
              <div>{appset.getText('vault.sider.all')}</div>
            </div>
          </Select.Option>
          {Object.keys(VaultItemType).map((key) => {
            const type_value = VaultItemType[key]
            return (
              <Select.Option key={key} value={type_value}>
                <div className="flex flex-row items-center space-x-1 w-[80px]">
                  <Icon type={`icon-${type_value}`} svg className="" />
                  <div>{type_value}</div>
                </div>
              </Select.Option>
            )
          })}
        </Select>
        <Icon
          type={Icon_type.icon_rank}
          className={` cursor-pointer ${rank_time_desc ? '' : 'rotate-180'}`}
          onClick={() => {
            set_rank_time_desc(!rank_time_desc)
          }}
        />
      </div>
      {/* item list */}
      <div className=" flex flex-col flex-1  overflow-y-auto scroll_enabled focus:bg-black ">
        {show_items.map((vault_item) => (
          <div
            onClick={() => {
              DoSelectItem(vault_item)
            }}
            ref={select_vault_item?.id == vault_item.id ? selectedItemRef : null}
            className={`relative flex flex-row items-center  space-x-2 py-2 px-1 m-2  ${select_vault_item?.id == vault_item.id ? 'bg-gray-200' : ''} hover:bg-gray-200`}
            key={vault_item.id}
          >
            <Icon type={`${vault_item.icon}`} svg className=" w-[40px] h-[40px]" />
            <div className="flex flex-col">
              <div className=" font-sans font-bold truncate w-[170px]">{vault_item.name}</div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-500 ">
                  {new Date(vault_item.create_time * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="  font-bold text-sm flex flex-row items-center justify-between  bg-gray-100 ">
        <p className="">{appset.getText('vault.sider.total', show_items.length)}</p>
        <p className=" kbd bg-gray-100 text-black">ctrl+2</p>
      </div>
    </div>
  )
}
