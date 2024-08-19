import { BackupFileItem } from '@common/entitys/backup.entity'
import { FormatTime, getFileSize } from '@common/help'
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
        <div className=" flex flex-row">
          <span className=" flex-1">{appset.getText('filelistselect.name')}</span>
          <span>{appset.getText('filelistselect.size')}</span>
          <span>{appset.getText('filelistselect.updatetime')}</span>
        </div>
        {props.filelist.map((item) => {
          const updateat = new Date(item.updated_at)
          return (
            <div
              onClick={() => {
                props.onOk(item)
              }}
              key={item.file_id}
              className="flex flex-row items-center"
            >
              <span className="flex-1">{item.name}</span>
              <span className=" w-[100px]">{getFileSize(item.size)}</span>
              <span>{FormatTime(updateat)}</span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
