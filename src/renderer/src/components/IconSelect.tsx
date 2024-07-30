import { DownOutlined } from '@ant-design/icons'
import { ModalType } from '@common/gloabl'
import { Dropdown, MenuProps } from 'antd'
import { ReactNode, useMemo, useState } from 'react'

interface IconSelectProps {
  value?: string | number
  onChange?: (value: string | number) => void
  show_type: ModalType
  items: { value: string | number; label: ReactNode }[]
}
export default function IconSelect(props: IconSelectProps): JSX.Element {
  const [curValue, setCurValue] = useState(props.value)
  const menus: MenuProps['items'] = useMemo(() => {
    return props.items.map((item) => {
      return { key: item.value, value: item.value, label: item.label }
    })
  }, [props.items])

  const curItem = useMemo(() => {
    const res = props.items.find((item) => item.value == curValue)
    return res
  }, [curValue, props.items])
  return props.show_type == ModalType.View ? (
    <>{curItem.label}</>
  ) : (
    <Dropdown
      overlayClassName=" h-[300px] overflow-y-auto"
      menu={{
        items: menus,
        onClick: (selectinfo) => {
          setCurValue(selectinfo?.key)
          props.onChange?.(selectinfo?.key)
        }
      }}
    >
      <div className=" relative p-0">
        {curItem.label}
        <DownOutlined className=" absolute bottom-0 right-0 bg-gray-100" />
      </div>
    </Dropdown>
  )
}
