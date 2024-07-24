interface HeadSelectItemProps {
  value: any
  children: React.ReactNode
  onchange: (newValue: any) => void
}

export default function HeadSelectItem(props: HeadSelectItemProps) {
  return (
    <div
      onClick={() => {
        props.onchange(props.value)
      }}
    >
      {props.children}
    </div>
  )
}
