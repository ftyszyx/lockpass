import { Icon_type, ModalType } from '@common/gloabl'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, InputRef, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import PasswordGenPanel from '@renderer/pages/Vault/PasswordGenPanel'

interface MyInputProps<InputPropsT> {
  value?: any
  onChange?: (value: any) => void
  show_type?: ModalType
  hide_label?: boolean
  className?: string
  inputProps?: InputPropsT
  placeholder?: string
  inputElement: React.ElementType
  is_password?: boolean
}
export default function MyInputWrapper<InputPropsT>(props: MyInputProps<InputPropsT>): JSX.Element {
  const appset = use_appset() as AppsetStore
  const [hoverState, setHoverState] = useState(false)
  const [showPasswordGen, setShowPasswordGen] = useState(false)
  const [showRandomPasswordBtn, setShowRandomPasswordBtn] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const isedit = props.show_type == ModalType.Edit || props.show_type == ModalType.Add
  const getPasswordVisible = () => {
    if (!props.is_password) return null
    return {
      visibilityToggle: { visible: showPassword, onVisibleChange: setShowPassword }
    }
  }
  useEffect(() => {
    if (showPasswordGen && inputRef.current) {
      const inputElement = inputRef.current.input
      if (inputElement) {
        const rect = inputElement.getBoundingClientRect()
        console.log('rect', rect)
        setModalPosition({ top: rect.y + rect.height + 10, left: rect.x })
        console.log('setModalPosition', modalPosition)
      }
    }
  }, [showPasswordGen])
  useEffect(() => {
    function handleFocus() {
      if (isedit && props.is_password) {
        setShowRandomPasswordBtn(true)
      }
    }
    function handleBlur(event) {
      if (isedit && props.is_password) {
        console.log('handleBlur', event)
        if (event.relatedTarget && event.relatedTarget.id == 'randomPasswordBtn') {
          return
        }
        setShowRandomPasswordBtn(false)
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
      {showRandomPasswordBtn && (
        <div className=" absolute left-1 z-10 bottom-[-35px]">
          <Button
            type="default"
            id="randomPasswordBtn"
            icon={<Icon type={Icon_type.icon_lock2} svg></Icon>}
            className=" text-blue-500 font-sans font-bold"
            onClick={() => {
              console.log('show panel')
              setShowRandomPasswordBtn(false)
              setShowPasswordGen(true)
            }}
          >
            {appset.getText('vaultitem.createrandom')}
          </Button>
        </div>
      )}
      {showPasswordGen && (
        <PasswordGenPanel
          show={showPasswordGen}
          showUse={true}
          className="fixed  w-[300px]"
          style={{ top: modalPosition.top, left: modalPosition.left }}
          onOk={(value) => {
            props.onChange(value)
            setShowPasswordGen(false)
          }}
          onClose={() => {
            setShowPasswordGen(false)
          }}
        />
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
