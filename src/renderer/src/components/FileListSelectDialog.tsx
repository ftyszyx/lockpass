import { BackupFileItem } from '@common/entitys/backup.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Modal } from 'antd'

interface FileListSelectDialogProps {
  filelist: BackupFileItem[]
  show: boolean
  className?: string
  style?: React.CSSProperties
  onOk: (value: BackupFileItem) => void
  onClose: () => void
}
export default function FileListSelectDialog(props: FileListSelectDialogProps): JSX.Element {
  const appset = use_appset() as AppsetStore
  return (
    <Modal
      className={props.className ? props.className : ''}
      open={props.show}
      title={appset.getText('backupfilelistselect.title')}
      style={props.style}
      onCancel={() => {
        props.onClose()
      }}
    >
      <div className=" flex flex-col">
        {props.filelist.map((item) => {
          return (
            <div
              onClick={() => {
                props.onOk(item)
              }}
              key={item.file_id}
              className="flex flex-row items-center"
            >
              <span className="flex-1">{item.name}</span>
              <span>{item.updated_at}</span>
              <span>{item.size}</span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
