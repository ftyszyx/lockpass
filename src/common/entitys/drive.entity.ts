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
}

export type FileCateGory = 'video' | 'doc' | 'audio' | 'zip' | 'others' | 'image'
export type FileType = 'file' | 'folder' | 'all'

export enum DriveType {
  aliyun = 'aliyun',
  baidu = 'baidu',
  google = 'google'
}
