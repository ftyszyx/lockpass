import { ChildProps } from '@renderer/entitys/other.entity'
import MyMenu from '@renderer/components/MyMenu'

function AdminLayout(props: ChildProps): JSX.Element {
  return (
    <div className="h-screen flex flex-row ">
      <MyMenu />
      {/* right side */}
      <div className=" flex-grow">
        <div className=" h-[100vh] min-h-[280px]">{props.children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
