import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { LoginInfo, User } from '@common/entitys/user.entity'
import { useLang } from '@renderer/libs/AppContext'
import { useHistory } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'

export default function Login(): JSX.Element {
  const [form] = useForm<LoginInfo>()
  const history = useHistory()
  const appstore = use_appstore() as AppStore
  const isLogin = history.PathName == PagePath.Login && !appstore.cur_user
  console.log('curuser', appstore.cur_user)
  const lang = useLang()
  return (
    <div className=" bg-slate-100">
      <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Form<LoginInfo>
          form={form}
          initialValues={{ username: appstore.cur_user?.username }}
          layout="vertical"
          onFinish={() => {}}
        >
          {isLogin && (
            <Form.Item label="你的账号名" required name="username">
              <Input placeholder="请输入你的名字" />
            </Form.Item>
          )}
          <Form.Item label="初始密码" name="password" required>
            <Input.Password placeholder="请输入初始密码" size="large" />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          onClick={() => {
            form.validateFields().then(async (values) => {
              console.log(values)
              try {
                const res = (await window.electron.ipcRenderer.invoke(
                  webToManMsg.Login,
                  values
                )) as ApiResp<User>
                if (res.code == ApiRespCode.SUCCESS) {
                  message.success(lang.getLangText('auth.login.success'))
                  window.location.href = PagePath.Home
                  appstore.Login(res.data)
                } else if (res.code == ApiRespCode.user_notfind) {
                  message.error(lang.getLangText('auth.login.user_notfind'))
                } else if (
                  res.code == ApiRespCode.ver_not_match ||
                  res.code == ApiRespCode.key_not_found
                ) {
                  message.error(lang.getLangText('auth.login.needinit'))
                  history.replace(PagePath.register)
                } else if (res.code == ApiRespCode.Password_err) {
                  message.error(lang.getLangText('auth.login.passworderr'))
                }
              } catch (e: any) {
                message.error(lang.getLangFormat('auth.login.fail', e.message))
              }
            })
          }}
        >
          确定
        </Button>
      </div>
    </div>
  )
}
