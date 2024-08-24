/*
desc: 密码生成器
© 2024 zyx
date:2024/08/02 16:14:17
*/
import { Button, Modal } from 'antd'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import Icon from '@renderer/components/Icon'
import { Icon_type } from '@common/gloabl'
import { PasswordGenContent, PasswordGenContentRef } from './PasswordGenContent'
import { useRef, useState } from 'react'
interface PasswordGenPanelProps {
  show: boolean
  className?: string
  showUse?: boolean
  style?: React.CSSProperties
  onOk: (value: string) => void
  onClose: () => void
}
export default function PasswordGenPanel(props: PasswordGenPanelProps): JSX.Element {
  const [value, setValue] = useState<string>('')
  const appset = use_appset() as AppsetStore
  const passwordContenRef = useRef<PasswordGenContentRef>(null)
  return (
    <Modal
      className={props.className ? props.className : ''}
      open={props.show}
      style={props.style}
      closable={false}
      mask={false}
      onCancel={() => {
        props.onClose()
      }}
      footer={null}
      title={
        <div className="flex flex-row justify-between">
          <Button
            onClick={() => {
              props.onClose()
            }}
          >
            {appset.getText('cancel')}
          </Button>
          <Icon
            onClick={() => {
              passwordContenRef.current.ReFresh()
            }}
            type={Icon_type.icon_refresh}
            className="text-[20px] cursor-pointer"
            svg
          ></Icon>
          {props.showUse && (
            <Button
              type="primary"
              onClick={async () => {
                await passwordContenRef.current.UpdateSet()
                props.onOk(value)
              }}
            >
              {appset.getText('use')}
            </Button>
          )}
        </div>
      }
    >
      <PasswordGenContent
        onChange={(newvalue) => {
          setValue(newvalue)
        }}
        ref={passwordContenRef}
      />
    </Modal>
  )
}
