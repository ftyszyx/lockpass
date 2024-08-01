import { DownOutlined } from '@ant-design/icons'
import { Icon_type, ModalType } from '@common/gloabl'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, Dropdown, message } from 'antd'
import React, { HtmlHTMLAttributes, InputHTMLAttributes, useState } from 'react'
import Icon from './Icon'

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
  const [messageApi, contextHolder] = message.useMessage()
  const [showPassword, setShowPassword] = useState(false)
  const getPasswordVisible = () => {
    if (!props.is_password) return null
    return {
      visibilityToggle: { visible: showPassword, onVisibleChange: setShowPassword }
    }
  }

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
        value={props.value}
        onChange={props.onChange}
        {...props.inputProps}
        {...getPasswordVisible()}
        readOnly={props.show_type == ModalType.View}
      ></props.inputElement>
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
              onClick={(e: any) => {
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
