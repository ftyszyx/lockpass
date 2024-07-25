import React, { createContext } from 'react'

export interface MySelectContext<T> {
  cur_value: T
  value_change: (value: T) => void
}
export const MySelectContext = createContext(null)

export function useMySelect() {
  const { cur_value, value_change } = React.useContext(MySelectContext)
  return { cur_value, value_change }
}
