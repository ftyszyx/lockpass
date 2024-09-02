import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { LastUserInfo, RegisterInfo, User } from '@common/entitys/user.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { useHistory } from '@renderer/libs/router'
import { GetAllUsers, ipc_call, UpdateMenu } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { AutoComplete, AutoCompleteProps, Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
interface RegisterInfo2 extends RegisterInfo {
  password_repeat: string
}

export default function Register(): JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = useForm<RegisterInfo2>()
  const history = useHistory()
  const [options, setOptions] = useState<AutoCompleteProps['options']>([])
  const [lastUser, setLastUser] = useState<User>(null)
  const appstore = use_appstore() as AppStore
  const isReigster = history.PathName == PagePath.register
  const isLogin = history.PathName == PagePath.Login
  const isLock = history.PathName == PagePath.Lock
  ConsoleLog.LogInfo('register render', history.PathName, isLogin, isLock)
  const appset = use_appset() as AppsetStore
  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    await GetAllUsers(appstore, appset.lang, messageApi)
    await ipc_call<LastUserInfo>(webToManMsg.GetLastUserInfo)
      .then((res) => {
        setLastUser(res.user)
      })
      .catch((e) => {
        ConsoleLog.LogError('GetLastUserInfo', e)
      })
  }
  useEffect(() => {
    setOptions(
      appstore.user_list.map((user) => {
        return { value: user.username, label: user.username }
      })
    )
  }, [appstore.user_list])

  async function OnRegister() {
    form.validateFields().then(async (values) => {
      console.log(values)
      if (values.password_repeat !== values.password) {
        message.error(appset.getText('auth.login.password_not_match'))
        return
      }
      await ipc_call<null>(webToManMsg.Register, values)
        .then(() => {
          history.replace(PagePath.Login)
        })
        .catch((err) => {
          messageApi.error(appset.getText(`err.${err.code}`))
        })
    })
  }

  async function onLogin() {
    form.validateFields().then(async (values) => {
      if (!values.username) {
        values.username = lastUser?.username
      }
      const user = await ipc_call<User>(webToManMsg.Login, values).catch((error) => {
        messageApi.error(appset.getText(`err.${error.code}`))
      })
      if (user) {
        message.success(appset.getText('auth.login.success'))
        appstore.Login(user)
        await UpdateMenu(appstore, appset.lang)
        if (isLock) {
          history.go(-1)
        } else {
          history.replace(PagePath.Home)
        }
      }
    })
  }
  return (
    <div className=" bg-slate-100">
      {contextHolder}
      <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col items-center">
          <div className=" text-4xl text-black mb-3 font-bold font-sans">
            {isReigster
              ? appset.getText('register.title')
              : isLogin
                ? appset.getText('auth.login.title')
                : appset.getText('auth.lock.title')}
          </div>
          <Form form={form} layout="vertical" onFinish={() => {}}>
            {(isReigster || isLogin) && (
              <Form.Item label={appset.getText('auth.login.account')} required name="username">
                <AutoComplete
                  options={options}
                  placeholder={appset.getText('auth.login.placeholder.account')}
                />
              </Form.Item>
            )}
            <Form.Item label={appset.getText('auth.login.main_password')} name="password" required>
              <Input.Password
                placeholder={appset.getText('auth.login.placeholder.main_password')}
                size="large"
              />
            </Form.Item>
            {isReigster && (
              <Form.Item
                label={appset.getText('auth.login.main_password_repeat')}
                name="password_repeat"
                required
              >
                <Input.Password
                  placeholder={appset.getText('auth.login.placeholder.main_password_repeat')}
                  size="large"
                />
              </Form.Item>
            )}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                onClick={async () => {
                  if (isReigster) {
                    await OnRegister()
                  } else {
                    await onLogin()
                  }
                }}
              >
                {appset.getText('ok')}
              </Button>
            </Form.Item>
            {isLogin && (
              <Button
                className="w-full"
                onClick={() => {
                  history.replace(PagePath.register)
                }}
              >
                {appset.getText('auth.login.gotoRegister')}
              </Button>
            )}
            {isReigster && (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  history.push(PagePath.Login)
                }}
              >
                {appset.getText('register.skiptoLogin')}
              </Button>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}
