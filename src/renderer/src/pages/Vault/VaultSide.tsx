/*
desc: vault left side view
© 2024 zyx
date:2024/07/31 17:08:51
*/

import { VaultItem } from '@common/entitys/vault_item.entity'
import { Icon_type, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import { IsVaultItemMatchSearch } from '@renderer/entitys/VaultItem.entity'
import { useRouterStore } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

interface VaultSideProps {
  onSelect: (item: VaultItem) => void
  global_search_keyword: string
}

export default function VaultSide(props: VaultSideProps) {
  const SelectAll = 'ALL'
  const [search_Password_type, set_Search_password_type] = useState(SelectAll)
  const [select_vault_item, set_select_vault_item] = useState<VaultItem>(null)
  const appstore = use_appstore() as AppStore
  const route_data = useRouterStore()
  const cur_vault_id = parseInt(route_data.match?.params['id'])
  const show_items = useMemo(() => {
    if (props.global_search_keyword && props.global_search_keyword.length > 0) {
      return appstore.vaut_items.filter((item) => {
        if (IsVaultItemMatchSearch(item, props.global_search_keyword)) return true
        return false
      })
    }
    if (search_Password_type === SelectAll) {
      return appstore.vaut_items.filter((item) => item.valut_id == cur_vault_id)
    } else {
      return appstore.vaut_items.filter(
        (item) => item.vault_item_type === search_Password_type && item.valut_id == cur_vault_id
      )
    }
  }, [
    appstore.vaults,
    search_Password_type,
    appstore.vaut_items,
    cur_vault_id,
    props.global_search_keyword
  ])
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

  const DoSelectItem = (vault_item: VaultItem) => {
    set_select_vault_item(vault_item)
    props.onSelect(vault_item)
  }
  return (
    <div className="flex w-[250px] flex-col bg-white border-r-2 border-solid border-gray-200">
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
              <div>所有类别</div>
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
        <Icon type={Icon_type.icon_rank} />
      </div>
      {/* item list */}
      <div className=" flex flex-col">
        {show_items.map((vault_item) => (
          <div
            onClick={() => {
              DoSelectItem(vault_item)
            }}
            className={`flex flex-row items-center  space-x-2 p-2 m-2  ${select_vault_item?.id == vault_item.id ? 'bg-gray-200' : ''} hover:bg-gray-200`}
            key={vault_item.id}
          >
            <Icon type={`${vault_item.icon}`} svg className=" w-[40px] h-[40px]" />
            <div> {vault_item.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
