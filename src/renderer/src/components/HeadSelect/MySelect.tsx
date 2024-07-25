import { ReactNode, useState } from 'react'
import { MySelectContext } from './MySelectContext'

/*
desc: a head select component
© 2024 zyx
date:2024/07/24 10:25:34
*/
interface HeadSelectProps<T> {
  value: T
  onChange: (newvalue: T) => void // 添加一个onChange回调函数来传递数据
  children: ReactNode
  className?: string | undefined
}
export default function HeadSelect<T>(props: HeadSelectProps<T>) {
  const [cur_value, setvalue] = useState<T>(props.value)
  return (
    <div className={`${props.className || ''}`}>
      <MySelectContext.Provider
        value={{
          cur_value,
          value_change: (newvalue) => {
            setvalue(newvalue)
            props.onChange(newvalue)
          }
        }}
      >
        {props.children}
      </MySelectContext.Provider>
    </div>
  )
}
