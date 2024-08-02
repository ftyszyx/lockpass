/*
desc: short key input component
© 2024 zyx
date:2024/08/02 17:42:05
*/
import React, { useState, useEffect, useRef } from 'react'
import Icon from './Icon'
import { Icon_type } from '@common/gloabl'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Input } from 'antd'

interface ShortKeyInputProps {
  value?: any
  onChange?: (value: any) => void
  onRemove?: () => void
}

const ShortKeyInput: React.FC<ShortKeyInputProps> = (props: ShortKeyInputProps) => {
  const [shortcut, setShortcut] = useState<string>(props.value || '')
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const appset = use_appset() as AppsetStore
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const shortcutString = Array.from(keys).join('+')
    setShortcut(shortcutString)
    console.log('shortcutString', shortcutString)
    props.onChange(shortcutString)
  }, [keys])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('event', event)
      if (event.ctrlKey) keys.add('Ctrl')
      if (event.shiftKey) keys.add('Shift')
      if (event.altKey) keys.add('Alt')
      if (event.metaKey) keys.add('Meta')

      console.log('keys', keys)
      setKeys(keys)
      event.preventDefault() // 阻止默认行为
    }
    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.addEventListener('keyup', handleKeyDown)
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keyup', handleKeyDown)
      }
    }
  }, [])

  return (
    <div className=" relative">
      <input
        ref={inputRef}
        placeholder={appset.lang.getText('input.placeholder.shortcut')}
        value={shortcut}
        onChange={(e) => setShortcut(e.target.value)} // 允许手动输入
        onKeyDown={(e) => e.preventDefault()} // 阻止默认行为
      />
      <Icon
        type={Icon_type.icon_remove}
        onClick={props.onRemove}
        className=" absolute right-2 text-red-400 text-[20px]  cursor-pointer"
      ></Icon>
    </div>
  )
}

export default ShortKeyInput
