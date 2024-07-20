import { AppStore, use_appstore } from '@renderer/models/app.model'
import logo from '@renderer/assets/logo.png'
import { Button, Dropdown, Input, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { VaultItem } from '@common/entitys/valut_item.entity'
import Icon from '@renderer/components/icon'
import ValutItemInfo from './ValutItemInfo'
import { Icon_type, PasswordType } from '@common/gloabl'

export default function Vault() {
  console.log('vault render')
  const appstore = use_appstore() as AppStore
  const SelectAll = 'ALL'
  const [select_vault, set_select_vault] = useState(SelectAll)
  const [select_vault_item, set_select_vault_item] = useState<VaultItem>({} as VaultItem)
  useEffect(() => {
    getAllData()
  }, [])
  const getAllData = async () => {
    await appstore.FetchAllValuts()
    await appstore.FetchValutItems()
  }
  const show_items = useMemo(() => {
    if (select_vault === SelectAll) {
      return appstore.vaut_items
    } else {
      const vault = appstore.vaults.find((vault) => vault.name === select_vault)
      return appstore.vaut_items.filter((item) => item.valut_id === vault.id)
    }
  }, [appstore.vaults, select_vault])
  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      {/* header */}
      <div className="flex flex-row h-12 items-center px-4 space-x-2 border-gray-300 border-b-[1px] border-solid">
        <Input placeholder="Search the vault" className="flex-grow" />
        <Icon type={Icon_type.icon_help} />
        <Button type="primary">新增项目</Button>
      </div>

      {/* content */}
      <div className=" flex flex-row flex-grow">
        {/*  left side menu*/}
        <div className="flex w-[30%] flex-col">
          {/* first line */}
          <div className="flex flex-row justify-between items-center p-2">
            <Select
              value={select_vault}
              onChange={(value) => {
                set_select_vault(value)
              }}
              defaultValue={SelectAll}
            >
              <Select.Option value={SelectAll} key={SelectAll}>
                <Icon type={Icon_type.icon_type} />
                所有类别
              </Select.Option>
              {Object.keys(PasswordType).map((key) => {
                const type_value = PasswordType[key]
                return (
                  <Select.Option key={key} value={type_value}>
                    <Icon type={`icon-${type_value}`} />
                    {type_value}
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
                onClick={() => set_select_vault_item(vault_item)}
                className="flex flex-row"
                key={vault_item.id}
              >
                <Icon type={`icon-${vault_item.passwordType}`} />
                <div> {vault_item.name}</div>
              </div>
            ))}
          </div>
          <div>新增</div>
          <div>导入密码</div>
        </div>
        {/*  right side content*/}
        <div className="flex flex-grow">
          <ValutItemInfo
            info={select_vault_item}
            onDel={() => {
              console.log('del')
            }}
          />
        </div>
      </div>
    </div>
  )
}
