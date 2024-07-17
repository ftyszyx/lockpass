import { ChildProps } from '@renderer/entitys/other.entity'
import { useEffect } from 'react'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useHistory } from '@renderer/libs/router'
import { PagePath } from '@common/entitys/page.entity'
import MyMenu from '@renderer/components/MyMenu'

function BaseLayout(props: ChildProps): JSX.Element {
  console.log('basiclayout render')
  const history = useHistory()
  useEffect(() => {
    console.log('useEffect')
    window.electron.ipcRenderer.invoke(webToManMsg.needInitKey).then((res) => {
      console.log('get res', res)
      if (res === true) {
        history.replace(PagePath.initKey)
      }
    })
  }, [])
  return (
    <div className="w-full min-h-screen flex flex-col">
      <MyMenu />
      {/* right side */}
      <div className=" flex-grow">
        <div className=" h-full min-h-[280px]">{props.children}</div>
      </div>
    </div>
  )
}

export default BaseLayout
