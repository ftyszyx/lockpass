import { Dropdown } from 'antd'
import { ReactNode, useMemo } from 'react'

interface IconSelectProps {
  value: string | number
  onChange: (value: string | number) => void
  items: { value: string | number; label: ReactNode }[]
}
export default function IconSelect(props: IconSelectProps): JSX.Element {
  const menus = useMemo(() => {
    return props.items.map((item) => {
      return { key: item.value, value: item.value, label: item.label }
    })
  }, [props.items])

  const curItem = useMemo(() => {
    const res = props.items.find((item) => item.value == props.value)
    return res
  }, [props.value, props.items])
  return (
    <Dropdown menu={{ items: menus }}>
      <curItem.label key={curItem.value} />
    </Dropdown>
  )
}
