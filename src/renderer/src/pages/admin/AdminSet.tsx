import { defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { LogLevel } from '@common/entitys/log.entity'
import { Icon_type } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import ShortKeyInput from '@renderer/components/ShortKeyInput'
import { NormalSetFiledList, SetMenuItem } from '@renderer/entitys/set.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { ChangeAppset, ipc_call_normal, UpdateMenu } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { use_appset } from '@renderer/models/appset.model'
import { Form, Button, message, Switch } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'

export default function AdminSet() {
  const [form] = useForm<UserSetInfo>(null)
  const appstore = use_appstore() as AppStore
  const getText = use_appset((state) => state.getText)
  const open_dev = use_appset((state) => state.GetOpenDev)
  const show_log = use_appset((state) => state.GetShowLog)
  const set_open_dev = use_appset((state) => state.SetOpenDev)
  const set_show_log = use_appset((state) => state.SetShowLog)
  const [messageApi, messageContext] = message.useMessage()
  const [select_item, set_select_item] = useState<string>(SetMenuItem.normal)
  const onSave = () => {
    form.validateFields().then(async (values) => {
      const setinfo = appstore.cur_user.user_set as UserSetInfo
      const newset = { ...setinfo, ...values }
      if (select_item == SetMenuItem.shortcut_global) {
        Object.keys(values).map(async (key) => {
          if (setinfo[key] != values[key]) {
            const res = await ipc_call_normal(webToManMsg.CheckShortKey, values[key])
            if (res) {
              messageApi.error(getText(`set.key_conflict`, values[key]))
              return
            }
          }
        })
      }
      await ChangeAppset(appstore, getText, newset, messageApi)
      if (select_item == SetMenuItem.shortcut_global) {
        await ipc_call_normal(webToManMsg.ShortCutKeyChange)
      }
      await UpdateMenu(appstore, getText)
    })
  }
  ConsoleLog.info('AdminSet render', appstore.cur_user?.user_set)

  return (
    <div className=" flex flex-row h-full">
      {messageContext}
      {appstore.cur_user && appstore.cur_user.user_set && (
        <>
          {/* left menu */}
          <div className=" w-[250px] flex flex-col border-solid border-r-2 border-gray-300">
            {Object.keys(SetMenuItem).map((item) => {
              return (
                <div
                  key={item}
                  onClick={() => {
                    set_select_item(item)
                  }}
                  className={` rounded-sm text-sm font-bold font-sans flex flex-row items-center cursor-pointer p-2 ${item == select_item ? 'bg-gray-200' : ''} h-[50px]`}
                >
                  <Icon
                    className="w-[30px] h-[30px] mr-2"
                    type={Icon_type[`${item}_set`]}
                    svg
                  ></Icon>
                  <span> {getText(`set.menu.${item}`)}</span>
                </div>
              )
            })}
          </div>
          {/* right content */}
          <div className="flex-grow flex flex-col p-4">
            <Form
              form={form}
              initialValues={appstore.cur_user?.user_set as UserSetInfo}
              onFieldsChange={async () => {
                if (select_item == SetMenuItem.normal) {
                  await onSave()
                }
              }}
            >
              {select_item == SetMenuItem.normal && (
                <div>
                  {NormalSetFiledList.map((item) => {
                    return (
                      <Form.Item
                        key={item.field_name}
                        label={getText(`set.menu.${item.field_name}`)}
                        name={item.field_name}
                      >
                        <item.render></item.render>
                      </Form.Item>
                    )
                  })}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <label>{getText('set.menu.normal_open_dev')}</label>
                      <Switch
                        checked={open_dev()}
                        onChange={(value) => {
                          ipc_call_normal(webToManMsg.OpenDev, value)
                          set_open_dev(value)
                        }}
                      ></Switch>
                    </div>
                    <div className="flex flex-row gap-2">
                      <label>{getText('set.menu.open_log')}</label>
                      <Switch
                        checked={show_log()}
                        onChange={(value) => {
                          ConsoleLog.log_level = value ? LogLevel.Info : LogLevel.Error
                          ipc_call_normal(webToManMsg.OpenLog, value)
                          set_show_log(value)
                        }}
                      ></Switch>
                    </div>
                  </div>
                </div>
              )}
              {(select_item == SetMenuItem.shortcut_global ||
                select_item == SetMenuItem.shortcut_local) &&
                Object.keys(defaultUserSetInfo).map((key) => {
                  if (key.startsWith(select_item)) {
                    return (
                      <Form.Item key={key} label={getText(`set.menu.${key}`)} name={key}>
                        <ShortKeyInput></ShortKeyInput>
                      </Form.Item>
                    )
                  }
                  return null
                })}
              {/* save button */}
              {(select_item == SetMenuItem.shortcut_global ||
                select_item == SetMenuItem.shortcut_local) && (
                <Form.Item>
                  <div className=" flex flex-row-reverse">
                    <Button onClick={onSave} type="primary" htmlType="submit" className="">
                      {getText('save')}
                    </Button>
                    <Button
                      className="mr-3"
                      onClick={() => {
                        Object.keys(defaultUserSetInfo).map((key) => {
                          if (key.startsWith(select_item)) {
                            const setvalue = { [key]: defaultUserSetInfo[key] }
                            form.setFieldsValue(setvalue)
                          }
                        })
                      }}
                    >
                      {getText('recover_default')}
                    </Button>
                  </div>
                </Form.Item>
              )}
            </Form>
          </div>
        </>
      )}
    </div>
  )
}
