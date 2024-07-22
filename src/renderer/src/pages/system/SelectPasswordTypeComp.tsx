import { Icon_type, PasswordType } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { Modal, Space } from 'antd'

interface SelectPasswordTypeProps {
  show: boolean
  onOk?: (password_type: PasswordType) => Promise<void>
}
export default function SelectPasswordTypeComp(props: SelectPasswordTypeProps): JSX.Element {
  return (
    <div>
      <Modal width={400} title="选择密码类型" open={props.show}>
        <div className="flex flex-row flex-wrap">
          {Object.keys(PasswordType).map((key) => {
            return (
              <div
                className="flex flex-row justify-between items-center"
                key={key}
                onClick={() => {
                  props.onOk?.(PasswordType[key])
                }}
              >
                <Space>
                  <Icon type={`icon-${PasswordType[key]}`} />
                  {PasswordType[key]}
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
