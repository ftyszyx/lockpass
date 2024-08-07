import { useMySelect } from './MySelectContext'

interface HeadSelectItemProps {
  value: any
  children: React.ReactNode
}

export default function MySelectItem(props: HeadSelectItemProps) {
  const { cur_value, value_change } = useMySelect()
  return (
    <div
      onClick={() => {
        value_change(props.value)
      }}
      className={`${cur_value === props.value ? 'active' : ''}`}
    >
      {props.children}
    </div>
  )
}
