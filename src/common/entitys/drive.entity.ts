export interface BackupFileItem {
  drive_id: string
  file_id: string
  parent_file_id: string
  name: string
  type: string
  size: number
  category: string
  file_extension: string
  content_hash: string
  created_at: string
  updated_at: string
  full_path: string
}

export type FileCateGory = 'video' | 'doc' | 'audio' | 'zip' | 'others' | 'image'
export type FileType = 'file' | 'folder' | 'all'

export enum DriveType {
  aliyun = 'aliyun',
  baidu = 'baidu',
  google = 'google'
}

export interface CurUseBackupInfo {
  drive_type: DriveType
  file_name: string
  time: string
}

export interface DriveUserSet {
  aliyun?: AliyunData
}

export interface AliyunData extends DriveUserSetBase {
  token_type: string
  drive_info?: AliyunDriveInfo
}

export interface DriveUserSetBase {
  access_token: string
  refresh_token: string
  refresh_token_expire_time: number
  expires_in: number
}

export interface AliyunDriveInfo {
  user_id: string
  name: string
  avatar: string
  default_drive_id: string
}
