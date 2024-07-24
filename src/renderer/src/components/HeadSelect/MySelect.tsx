import { ReactNode } from 'react'

/*
desc: a head select component
© 2024 zyx
date:2024/07/24 10:25:34
*/
interface HeadSelectProps<T> {
  value: T
  onChange: (newvalue: T) => void // 添加一个onChange回调函数来传递数据
  children: ReactNode
}
export default function HeadSelect<T>(props: HeadSelectProps<T>) {
  return <div>{props.children}</div>
}
