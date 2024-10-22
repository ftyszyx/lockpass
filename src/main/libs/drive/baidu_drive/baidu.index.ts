import { DriveBase, DriveFileItemBase } from '../drive.base'
import { BackupFileItem, DriveType, DriveUserSetBase } from '@common/entitys/drive.entity'
export interface BaiduDriveFileItem extends DriveFileItemBase {}

export interface BaiduDriveUserSet extends DriveUserSetBase {}
export class BaiduDrive extends DriveBase<BaiduDriveFileItem, BaiduDriveUserSet> {
  constructor() {
    super(DriveType.baidu)
  }
  async deeplinkProcess(_params: URLSearchParams) {}
  async Login(): Promise<void> {}

  async UploadFile(_file: string, _local_path: string): Promise<BackupFileItem> {
    return {
      drive_id: '',
      file_id: '',
      parent_file_id: '',
      name: '',
      type: '',
      size: 0,
      category: '',
      file_extension: '',
      content_hash: '',
      created_at: '',
      updated_at: '',
      full_path: ''
    }
  }

  async DownLoadFile(_file: string, _local_path: string): Promise<void> {}

  async GetFileList(): Promise<BaiduDriveFileItem[]> {
    return []
  }

  async DeleteFile(_file_id: string): Promise<void> {}

  async TrashFile(_file_id: string): Promise<void> {}
}
