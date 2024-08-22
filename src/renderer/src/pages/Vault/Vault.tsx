/*
desc: 密码管理页面
© 2024 zyx
date:2024/07/23 11:45:04
*/
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Button, Form, Input, message, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'
import Icon from '@renderer/components/Icon'
import { Icon_type, ModalType, VaultItemType } from '@common/gloabl'
import AddPasswordPanel from './AddPasswordPanel'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { getAllVaultItem, ipc_call } from '@renderer/libs/tools/other'
import PaswordDetail from './PasswordDetail'
import { ConsoleLog } from '@renderer/libs/Console'
import { useForm } from 'antd/es/form/Form'
import VaultSide from './VaultSide'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'

export default function Vault() {
  ConsoleLog.LogInfo('Vault render')
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  const [form] = useForm<VaultItem>()
  const [messageApi, contextHolder] = message.useMessage()
  const [global_search_keyword, set_gloal_search_keyword] = useState('')
  const [select_vault_item, set_select_vault_item] = useState<VaultItem>(null)
  const [show_add_vault, set_show_add_vault] = useState(false)
  const [show_edit, set_show_edit] = useState(false)
  useEffect(() => {
    if (select_vault_item) {
      form.resetFields()
    }
  }, [select_vault_item])

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
            placeholder={appset.getText('vault.global_search', appstore.cur_user?.username)}
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
          <VaultSide
            global_search_keyword={global_search_keyword}
            onSelect={(item) => {
              set_select_vault_item(item)
            }}
          ></VaultSide>
          {/*  right side content*/}
          <div className="flex flex-grow  overflow-auto">
            {select_vault_item && (
              <div className=" flex flex-col w-full">
                <div className="flex flex-row-reverse   p-4 border-b-2 border-solid border-gray-200">
                  <Button
                    type="primary"
                    onClick={() => {
                      set_show_edit(!show_edit)
                    }}
                  >
                    {show_edit ? appset.lang.getText('cancel') : appset.lang.getText('edit')}
                  </Button>
                </div>
                <div className="p-2">
                  <Form
                    form={form}
                    className="flex-grow"
                    initialValues={select_vault_item}
                    layout="vertical"
                  >
                    <PaswordDetail
                      passwordType={select_vault_item.vault_item_type as VaultItemType}
                      modal_type={show_edit ? ModalType.Edit : ModalType.View}
                    ></PaswordDetail>
                    <div className=" flex flex-row-reverse mt-2">
                      {show_edit && (
                        <Form.Item>
                          <Popconfirm
                            title={appset.lang.getText('vault.edit_title')}
                            description={appset.lang.getText(
                              'vault.sure_edit',
                              select_vault_item.name
                            )}
                            okText={appset.lang.getText('ok')}
                            cancelText={appset.lang.getText('cancel')}
                            onConfirm={async () => {
                              const values = await form.validateFields()
                              values.id = select_vault_item.id
                              await ipc_call(webToManMsg.updateValutItem, values)
                                .then(async () => {
                                  set_show_edit(false)
                                  await getAllVaultItem(appstore, appset.lang, messageApi)
                                })
                                .catch((err) => {
                                  messageApi.error(appset.lang.getText(`err.${err.code}`), 5)
                                })
                            }}
                          >
                            <Button type="primary" htmlType="submit">
                              {appset.lang.getText('save')}
                            </Button>
                          </Popconfirm>
                        </Form.Item>
                      )}
                      {show_edit && (
                        <Form.Item className=" mr-3">
                          <Popconfirm
                            title={appset.lang.getText('vault.delete_title')}
                            description={appset.lang.getText(
                              'vault.sure_delete',
                              select_vault_item.name
                            )}
                            onConfirm={async () => {
                              await ipc_call(webToManMsg.DeleteValutItem, select_vault_item.id)
                                .then(async () => {
                                  set_show_edit(false)
                                  await getAllVaultItem(appstore, appset.lang, messageApi)
                                })
                                .catch((err) => {
                                  messageApi.error(appset.lang.getText(`err.${err.code}`), 5)
                                })
                            }}
                            okText={appset.lang.getText('ok')}
                            cancelText={appset.lang.getText('cancel')}
                          >
                            <Button type="dashed">{appset.lang.getText('delete')}</Button>
                          </Popconfirm>
                        </Form.Item>
                      )}
                    </div>
                  </Form>
                </div>
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
