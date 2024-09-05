import { Icon_type } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'

export default function AdminAbout() {
  const appset = use_appset() as AppsetStore
  return (
    <div className=" p-4 font-sans text-lg">
      <div className="font-bold flex flex-row space-x-2 mb-2">
        <div>lockpass V{appset.version}</div>
        <Icon type={Icon_type.icon_logo} svg></Icon>
      </div>
      <div className=" flex flex-col space-y-2">
        <div> {`copyright@${new Date().getFullYear()}`}</div>
        <div> {`author:whyzi@qq.com`}</div>
        <a href={'https://github.com/ftyszyx/lockpass'}>
          github:https://github.com/ftyszyx/lockpass
        </a>
      </div>
    </div>
  )
}
