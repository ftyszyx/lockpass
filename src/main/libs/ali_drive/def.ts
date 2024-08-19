import { BackupFileItem } from '@common/entitys/backup.entity'

export interface AliyunData {
  access_token: string
  refresh_token: string
  refresh_token_expire_time: number
  expires_in: number
  token_type: string
  drive_info: AliyunDriveInfo
}

export interface AliyunDriveInfo {
  user_id: string
  name: string
  avatar: string
  default_drive_id: string
}

export interface AliyunPartInfo {
  part_number: number
  upload_url: string
  part_size: number
}

export interface AliyunCreateFileResp {
  drive_id: string
  status: string
  file_id: string
  file_name: string
  upload_id?: string
  parent_file_id: string
  available: boolean
  exit: boolean
  rapid_upload: boolean
  part_info_list: AliyunPartInfo[]
}

export interface AliyunFileDownloadInfo {
  url: string
  expiration: string
  method: string
  description: string
}

export interface AliyunFileListItem extends BackupFileItem {
  parent_file_id: string
  url?: string
  thumbnail?: string
  play_cursor: string
  video_media_metadata: object
}

export interface AliyunFileInfo {
  drive_id: string
  file_id: string
  name: string
  size: number
  file_extension: string
  content_hash: string
  category: string
  type: string
  created_at: string
  updated_at: string
  url?: string
  thumbnail?: string
  download_url?: string
}

export interface AliyunFilelistResp {
  items: AliyunFileListItem[]
  next_marker: string
}

export type AliyunFileCateGory = 'video' | 'doc' | 'audio' | 'zip' | 'others' | 'image'
export type aliyunFileType = 'file' | 'folder' | 'all'
