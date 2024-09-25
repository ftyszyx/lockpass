import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { Icon_type } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { use_appset } from '@renderer/models/appset.model'
import { Button } from 'antd'

export default function AdminAbout() {
  const appset = use_appset()
  return (
    <div className=" p-4 font-sans text-lg">
      <div className="font-bold flex flex-row space-x-2 mb-2">
        <div>lockpass V{appset.version}</div>
        <Icon type={Icon_type.icon_logo} svg></Icon>
        <Button
          type="primary"
          onClick={async () => {
            await ipc_call_normal(webToManMsg.checkUpdate)
          }}
        >
          {appset.getText('admin_about.checkupdate')}
        </Button>
      </div>
      <div className=" flex flex-col space-y-2">
        <div> {`copyright@${new Date().getFullYear()}`}</div>
        <div> {`author:whyzi@qq.com`}</div>
        <div className=" flex flex-row">
          <div>github:</div>
          <a
            className="text-blue-500 cursor-pointer"
            onClick={async () => {
              await ipc_call_normal(webToManMsg.OpenShell, 'https://github.com/ftyszyx/lockpass')
            }}
          >
            https://github.com/ftyszyx/lockpass
          </a>
        </div>
      </div>
    </div>
  )
}
