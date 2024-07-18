import { AppStore, use_appstore } from '@renderer/models/app.model'
import logo from '@renderer/assets/logo.png'
import { Dropdown, Input, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { VaultItem } from '@common/entitys/valut_item.entity'
import Icon from '@renderer/components/icon'
import ValutItemInfo from './ValutItemInfo'

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
      <div className="flex flex-row h-16 w-full">
        <img src={logo} />
        {/* select vault */}
        <Select onChange={() => {}}>
          <Select.Option value={SelectAll}>ALL</Select.Option>
          {appstore.vaults.map((vault) => (
            <Select.Option value={vault}>{vault.name}</Select.Option>
          ))}
        </Select>
        {/* user settings */}
        <Dropdown
          menu={{
            onClick: () => {},
            items: [
              {
                key: 'settings',
                label: 'Settings'
              }
            ]
          }}
        >
          <div>{appstore.cur_user.username}</div>
        </Dropdown>
      </div>

      {/* content */}
      <div className=" flex flex-row flex-grow">
        {/*  left side menu*/}
        <div className="flex w-40 flex-col">
          <Input placeholder="Search the item" />
          <div className=" flex flex-col">
            {show_items.map((vault_item) => (
              <div
                onClick={() => set_select_vault_item(vault_item)}
                className="flex flex-row"
                key={vault_item.id}
              >
                <Icon type={vault_item.icon} />
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
