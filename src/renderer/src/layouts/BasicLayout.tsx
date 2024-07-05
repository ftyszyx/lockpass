import { ChildProps } from '@renderer/entitys/other.entity'
import Layout, { Content } from 'antd/es/layout/layout'
import { useEffect } from 'react'
// import MyMenu from '@renderer/components/admin_menu'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'

function BasicLayout(props: ChildProps): JSX.Element {
  console.log('basiclayout render')
  useEffect(() => {
    console.log('useEffect')
    window.electron.ipcRenderer.invoke(webToManMsg.needInitKey).then((res) => {
      console.log('get res', res)
      if (res === true) {
        window.location.href = PagePath.initKey
      }
    })
  }, [])
  return (
    <Layout className="w-full min-h-screen" hasSider>
      <Layout>
        <Content className="mx-1 my-0 mr-0 p-0 bg-white h-full min-h-[280px]">
          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
