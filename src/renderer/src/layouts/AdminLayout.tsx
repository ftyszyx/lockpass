import { ChildProps } from '@renderer/entitys/other.entity'
import MyMenu from '@renderer/components/MyMenu'

function AdminLayout(props: ChildProps): JSX.Element {
  console.log('admin layout render')
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

export default AdminLayout
