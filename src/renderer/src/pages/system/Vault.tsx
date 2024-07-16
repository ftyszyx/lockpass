import { AppStore, use_appstore } from '@renderer/models/app.model'
import logo from '@renderer/assets/logo.png'
import { Dropdown, Input, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { VaultItem } from '@common/entitys/valut_item.entity'
import Icon from '@renderer/components/icon'

export default function Vault() {
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
        />
      </div>

      {/* content */}
      <div className=" flex flex-row flex-grow">
        {/*  left side menu*/}
        <div className="flex w-40 flex-col">
          <Input placeholder="Search the item" />
          <div className=" flex flex-col">
            {show_items.map((vault) => (
              <div onClick={() => set_select_vault_item(vault)} className="flex flex-row">
                {/* <Icon type={vault.} /> */}
                {vault.name}
              </div>
            ))}
          </div>
        </div>
        {/*  right side content*/}
        <div className="flex flex-grow"></div>
      </div>
    </div>
  )
}
