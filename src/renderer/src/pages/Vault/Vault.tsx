/*
desc: 密码管理页面
© 2024 zyx
date:2024/07/23 11:45:04
*/
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Button, Form, Input, message, Select, Space } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import Icon from '@renderer/components/Icon'
import { Icon_type, ModalType, PasswordType } from '@common/gloabl'
import AddPasswordPanel from './AddPasswordPanel'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { getAllVaultItem } from '@renderer/libs/tools/other'
import { useRouterStore } from '@renderer/libs/router'
import PaswordDetail from './PasswordDetail'
import { ConsoleLog } from '@renderer/libs/Console'
import { useForm } from 'antd/es/form/Form'

export default function Vault() {
  ConsoleLog.LogInfo('Vault render')
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  const [form] = useForm<VaultItem>()
  const [messageApi, contextHolder] = message.useMessage()
  const SelectAll = 'ALL'
  const [search_Password_type, set_Search_password_type] = useState(SelectAll)
  const [gloal_search_keyword, set_gloal_search_keyword] = useState('')
  const [select_vault_item, set_select_vault_item] = useState<VaultItem>(null)
  const [show_add_vault, set_show_add_vault] = useState(false)
  const route_data = useRouterStore()
  const cur_vault_id = parseInt(route_data.match?.params['id'])
  const show_items = useMemo(() => {
    if (gloal_search_keyword && gloal_search_keyword.length > 0) {
      return appstore.vaut_items.filter((item) => {
        if (item.name.includes(gloal_search_keyword)) return true
        if (item.info) {
          const keys = Object.keys(item.info)
          const ok = keys.some((key) => {
            if (item.info[key].includes(gloal_search_keyword)) return true
            return false
          })
          if (ok) return true
        }
        return false
      })
    }
    if (search_Password_type === SelectAll) {
      return appstore.vaut_items.filter((item) => item.valut_id == cur_vault_id)
    } else {
      return appstore.vaut_items.filter(
        (item) => item.passwordType === search_Password_type && item.valut_id == cur_vault_id
      )
    }
  }, [
    appstore.vaults,
    search_Password_type,
    appstore.vaut_items,
    cur_vault_id,
    gloal_search_keyword
  ])

  useEffect(() => {
    if (show_items.length > 0) {
      set_select_vault_item(show_items[0])
    } else {
      set_select_vault_item(null)
    }
  }, [show_items])

  return (
    <>
      <div className="flex flex-col bg-gray-100 h-screen">
        {contextHolder}
        {/* header */}
        <div className="flex flex-row h-12 items-center px-4 space-x-2 border-gray-300 border-b-[1px] border-solid">
          <Icon
            type={Icon_type.icon_fold}
            className={`cursor-pointer ${appset.fold_menu ? ' rotate-180' : 'rotate-0'} font-[40px]`}
            onClick={() => {
              appset.ToggleFoldMenu()
            }}
          ></Icon>
          <Input
            placeholder={appset.lang.getText('vault.global_search', appstore.cur_user.username)}
            className="flex-grow"
            onChange={(newvalue) => {
              if (newvalue.target.value) {
                set_gloal_search_keyword(newvalue.target.value.trim())
              }
            }}
          />
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
                {Object.keys(PasswordType).map((key) => {
                  const type_value = PasswordType[key]
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
                    set_select_vault_item(vault_item)
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
          {/*  right side content*/}
          <div className="flex flex-grow">
            {select_vault_item && (
              <div className=" flex flex-col w-full p-4">
                <div className="flex flex-row-reverse">
                  <Button type="primary">{appset.lang.getText('edit')}</Button>
                </div>
                <Form
                  form={form}
                  className="flex-grow"
                  initialValues={select_vault_item}
                  layout="vertical"
                  wrapperCol={{}}
                >
                  <PaswordDetail
                    passwordType={select_vault_item.passwordType as PasswordType}
                    modal_type={ModalType.View}
                  ></PaswordDetail>
                </Form>
              </div>
            )}
            {!select_vault_item && (
              <div className="flex flex-col items-center justify-center flex-grow">
                {/* <Icon type={Icon_type.icon_no_data} svg className=" w-[100px] h-[100px]" /> */}
                <Button
                  type="primary"
                  onClick={() => {
                    set_show_add_vault(true)
                  }}
                >
                  {appset.lang.getText('vault.empty_add')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {show_add_vault && (
        <AddPasswordPanel
          show={show_add_vault}
          title="新增项目"
          onOk={async () => {
            set_show_add_vault(false)
            await getAllVaultItem(appstore, appset.lang, messageApi)
          }}
          onClose={() => {
            set_show_add_vault(false)
          }}
        ></AddPasswordPanel>
      )}
    </>
  )
}
