/*
desc: short key input component
© 2024 zyx
date:2024/08/02 17:42:05
*/
import { useEffect, useRef } from 'react'
import Icon from './Icon'
import { ControlKey as CONTROL_KEY_MAP, Icon_type } from '@common/gloabl'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Input, InputRef } from 'antd'

interface ShortKeyInputProps {
  value?: any
  onChange?: (value: any) => void
}

export default function ShortKeyInput(props: ShortKeyInputProps) {
  // console.log('short key input', props.value)
  const appset = use_appset() as AppsetStore
  const inputRef = useRef<InputRef>(null)
  useEffect(() => {
    const press_controls = new Set<string>()
    let press_key = ''
    const handleKeyDown = (event: KeyboardEvent) => {
      let eventKey = event.key
      if (event.code == 'Space') eventKey = 'Space'
      if (CONTROL_KEY_MAP[eventKey]) {
        const key = CONTROL_KEY_MAP[eventKey]
        press_key = ''
        press_controls.add(key)
      } else {
        press_key = eventKey
      }
      let shortcutString = Array.from(press_controls).join('+')
      if (press_key) {
        if (press_controls.size > 0) shortcutString += '+'
        shortcutString += press_key
      }
      if (shortcutString != props.value) props.onChange(shortcutString)
      event.preventDefault() // 阻止默认行为
      event.stopPropagation()
    }

    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.input.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      if (inputElement) {
        inputElement.input.addEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  return (
    <div className=" relative">
      <Input
        ref={inputRef}
        placeholder={appset.lang.getText('set.placeholder.shortcut')}
        value={props.value}
        onKeyDown={(e) => e.preventDefault()} // 阻止默认行为
      />
      <Icon
        type={Icon_type.icon_remove}
        onClick={() => {
          props.onChange('')
        }}
        className=" absolute right-2 text-red-400 text-[20px]  cursor-pointer"
      ></Icon>
    </div>
  )
}
