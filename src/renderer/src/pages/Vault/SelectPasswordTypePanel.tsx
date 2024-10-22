import { Icon_type, VaultItemType } from '@common/gloabl'
import { KEY_MAP } from '@common/keycode'
import Icon from '@renderer/components/Icon'
import { useKeyboardNavigation } from '@renderer/libs/tools/keyboardNavigation'
import { shortKeys } from '@renderer/libs/tools/shortKeys'
import { Modal, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'

interface SelectPasswordTypeProps {
  show: boolean
  onOk?: (password_type: VaultItemType) => Promise<void>
  onClose: () => void
}
export default function SelectPasswordTypePanel(props: SelectPasswordTypeProps): JSX.Element {
  const { selectedIndex, setTotalCount, setIsFocus } = useKeyboardNavigation()
  const [select_type, setSelectType] = useState(VaultItemType.Login)
  const select_type_ref = useRef(VaultItemType.Login)
  useEffect(() => {
    const key = Object.keys(VaultItemType)[selectedIndex]
    const value = VaultItemType[key]
    setSelectType(value)
  }, [selectedIndex])
  useEffect(() => {
    setTotalCount(Object.keys(VaultItemType).length)
    setIsFocus(true)
  }, [])

  useEffect(() => {
    select_type_ref.current = select_type
  }, [select_type])

  useEffect(() => {
    shortKeys.bindShortKey(KEY_MAP.enter, () => {
      props.onOk?.(select_type_ref.current)
      return true
    })
    return () => {
      shortKeys.unbindShortKey(KEY_MAP.enter)
    }
  }, [])
  return (
    <div>
      <Modal
        className="w-[500px]"
        title="选择密码类型"
        open={props.show}
        footer={null}
        onCancel={() => props.onClose()}
        onClose={() => props.onClose}
      >
        <div className="flex flex-row flex-wrap">
          {Object.keys(VaultItemType).map((key) => {
            return (
              <div
                className={` hover:cursor-pointer m-2 p-2 rounded-lg w-[210px] h-[40px] flex flex-row justify-between items-center ${
                  select_type == VaultItemType[key]
                    ? 'bg-blue-300 !important'
                    : 'bg-gray-200 hover:bg-blue-300'
                }`}
                key={key}
                onClick={() => {
                  props.onOk?.(VaultItemType[key])
                }}
              >
                <Space>
                  <Icon svg className="" type={`icon-${VaultItemType[key]}`} />
                  {VaultItemType[key]}
                </Space>
                <Icon type={Icon_type.icon_add} />
              </div>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
