import { Icon_type, ModalType } from '@common/gloabl'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, InputRef, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { PasswordGenContent, PasswordGenContentRef } from '@renderer/pages/Vault/PasswordGenContent'

interface MyInputProps<InputPropsT> {
  value?: any
  onChange?: (value: any) => void
  show_type?: ModalType
  className?: string
  inputProps?: InputPropsT
  inputElement: React.ElementType
  is_password?: boolean
}
export default function MyInputWrapper<InputPropsT>(props: MyInputProps<InputPropsT>): JSX.Element {
  const appset = use_appset() as AppsetStore
  const [hoverState, setHoverState] = useState(false)
  const [showPasswordGen, setShowPasswordGen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const [passwordValue, setPasswordValue] = useState<string>('')
  const passwordContenRef = useRef<PasswordGenContentRef>(null)
  console.log('show type', props.show_type, props.is_password)
  const isedit = props.show_type == ModalType.Edit || props.show_type == ModalType.Add
  const getPasswordVisible = () => {
    if (!props.is_password) return null
    return {
      visibilityToggle: { visible: showPassword, onVisibleChange: setShowPassword }
    }
  }
  useEffect(() => {
    function handleFocus() {
      if (isedit && props.is_password) {
        console.log('focus')
        setShowPasswordGen(true)
      }
    }
    function handleBlur() {
      if (isedit && props.is_password) {
        console.log('blur')
        // setShowPasswordGen(false)
      }
    }
    const inputElement = inputRef.current.input
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus)
      inputElement.addEventListener('blur', handleBlur)
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus)
        inputElement.removeEventListener('blur', handleBlur)
      }
    }
  }, [])
  return (
    <div
      className="relative"
      onMouseOver={() => {
        setHoverState(true)
      }}
      onMouseLeave={() => {
        setHoverState(false)
      }}
    >
      {contextHolder}

      <props.inputElement
        ref={inputRef}
        value={props.value}
        onChange={props.onChange}
        {...props.inputProps}
        {...getPasswordVisible()}
        readOnly={props.show_type == ModalType.View}
      ></props.inputElement>
      {showPasswordGen && (
        <div className=" absolute top-[40px] z-10 bg-white p-4 space-y-1 w-[300px] ">
          <div className="flex flex-row justify-between">
            <Button
              onClick={() => {
                setShowPasswordGen(false)
              }}
            >
              {appset.lang.getText('cancel')}
            </Button>
            <Icon
              onClick={() => {
                passwordContenRef.current.ReFresh()
              }}
              type={Icon_type.icon_refresh}
              className="text-[20px]"
              svg
            ></Icon>
            <Button
              type="primary"
              onClick={async () => {
                await passwordContenRef.current.UpdateSet()
                props.onChange(passwordValue)
                setShowPasswordGen(false)
              }}
            >
              {appset.lang.getText('use')}
            </Button>
          </div>
          <PasswordGenContent
            onChange={(newvalue) => {
              setPasswordValue(newvalue)
            }}
            ref={passwordContenRef}
          ></PasswordGenContent>
        </div>
      )}
      {props.show_type == ModalType.View && (
        <div className=" z-10 absolute w-full h-full left-0 right-0 top-0 bottom-0 flex flex-row items-center">
          <Button
            type="text"
            onClick={() => {
              navigator.clipboard.writeText(props.value)
              console.log('get text', props.value)
              messageApi.success(appset.lang.getText('copy_success'))
            }}
            className={` flex-grow  font-bold h-full ${hoverState ? ' visible' : 'hidden'}`}
          >
            {appset.lang.getText('copy')}
          </Button>
          {
            <Icon
              type={showPassword ? Icon_type.icon_eye_fill : Icon_type.icon_eyeclose_fill}
              onClick={() => {
                console.log('show password', !showPassword)
                setShowPassword(!showPassword)
              }}
              className={`w-[40px] cursor-pointer ${hoverState && props.is_password ? ' visible' : 'hidden'}`}
              svg
            ></Icon>
          }
        </div>
      )}
    </div>
  )
}
