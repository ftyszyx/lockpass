import { DriveType, DriveBase, DriveFileItemBase, DriveUserSetBase } from '../drive.base'
export interface BaiduDriveFileItem extends DriveFileItemBase {}

export interface BaiduDriveUserSet extends DriveUserSetBase {}
export class BaiduDrive extends DriveBase<BaiduDriveFileItem, BaiduDriveUserSet> {
  constructor() {
    super(DriveType.baidu)
  }
  async deeplinkProcess(_params: URLSearchParams) {}
  async Login(): Promise<void> {}

  async upLoadFile(_file: string, _local_path: string): Promise<void> {}

  async downLoadFile(_file: string, _local_path: string): Promise<void> {}

  async GetFileList(): Promise<BaiduDriveFileItem[]> {
    return []
  }

  async DeleteFile(_file_id: string): Promise<void> {}

  async TrashFile(_file_id: string): Promise<void> {}
}
