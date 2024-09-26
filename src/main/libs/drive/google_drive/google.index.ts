import { DriveType, DriveBase, DriveFileItemBase, DriveUserSetBase } from '../drive.base'
export interface GoogleDriveFileItem extends DriveFileItemBase {}

export interface GoogleDriveUserSet extends DriveUserSetBase {}
export class GoogleDrive extends DriveBase<GoogleDriveFileItem, GoogleDriveUserSet> {
  constructor() {
    super(DriveType.google)
  }
  async deeplinkProcess(_params: URLSearchParams) {}
  async Login(): Promise<void> {}

  async upLoadFile(_file: string, _local_path: string): Promise<void> {}

  async downLoadFile(_file: string, _local_path: string): Promise<void> {}

  async GetFileList(): Promise<GoogleDriveFileItem[]> {
    return []
  }

  async DeleteFile(_file_id: string): Promise<void> {}

  async TrashFile(_file_id: string): Promise<void> {}
}
