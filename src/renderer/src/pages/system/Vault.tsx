/*
desc: 密码管理页面
© 2024 zyx
date:2024/07/23 11:45:04
*/
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Button, Input, Select, Space } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import Icon from '@renderer/components/icon'
import ValutItemInfo from './ValutItemInfo'
import { Icon_type, PasswordType } from '@common/gloabl'
import AdminAddPassword from './AdminAddPassword'
import { VaultItem } from '@common/entitys/vault_item.entity'

export default function Vault() {
  const appstore = use_appstore() as AppStore
  const SelectAll = 'ALL'
  const [select_vault, set_select_vault] = useState(SelectAll)
  const [select_vault_item, set_select_vault_item] = useState<VaultItem>({} as VaultItem)
  const [show_add_vault, set_show_add_vault] = useState(false)
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
      if (!vault) {
        return []
      }
      return appstore.vaut_items.filter((item) => item.valut_id === vault.id)
    }
  }, [appstore.vaults, select_vault])
  return (
    <>
      <div className="flex flex-col bg-gray-100 h-screen">
        {/* header */}
        <div className="flex flex-row h-12 items-center px-4 space-x-2 border-gray-300 border-b-[1px] border-solid">
          <Input placeholder="Search the vault" className="flex-grow" />
          <Icon type={Icon_type.icon_help} />
          <Button
            type="primary"
            onClick={() => {
              set_show_add_vault(true)
            }}
          >
            新增项目
          </Button>
        </div>

        {/* content */}
        <div className=" flex flex-row flex-grow">
          {/*  left side menu*/}
          <div className="flex w-[250px] flex-col bg-white border-r-2 border-solid border-gray-200">
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
                  <Space>
                    <Icon type={Icon_type.icon_type} />
                    所有类别
                  </Space>
                </Select.Option>
                {Object.keys(PasswordType).map((key) => {
                  const type_value = PasswordType[key]
                  return (
                    <Select.Option key={key} value={type_value}>
                      <Space>
                        <Icon type={`icon-${type_value}`} />
                        {type_value}
                      </Space>
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
                    console.log('select ', vault_item)
                    set_select_vault_item(vault_item)
                  }}
                  className={`flex flex-row items-center space-x-2 p-2 m-2 hover:bg-gray-200 ${select_vault_item.id == vault_item.id ? 'bg-green-200' : ''}}`}
                  key={vault_item.id}
                >
                  <Icon type={`${vault_item.icon}`} svg className=" w-[40px] h-[40px]" />
                  <div> {vault_item.name}</div>
                </div>
              ))}
            </div>
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
      {show_add_vault && (
        <AdminAddPassword
          show={show_add_vault}
          title="新增项目"
          onOk={async () => {
            set_show_add_vault(false)
            await appstore.FetchValutItems()
          }}
          onClose={() => {
            set_show_add_vault(false)
          }}
        ></AdminAddPassword>
      )}
    </>
  )
}
