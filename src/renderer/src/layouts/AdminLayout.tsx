import { ChildProps } from '@renderer/entitys/other.entity'
import MyMenu from '@renderer/components/MyMenu'

function AdminLayout(props: ChildProps): JSX.Element {
  return (
    <div className="flex flex-row h-screen">
      <MyMenu />
      {/* right side */}
      <div className=" flex-grow ">
        <div className=" min-h-[280px] h-full">{props.children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
