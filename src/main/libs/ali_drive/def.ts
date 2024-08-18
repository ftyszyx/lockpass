export interface AliyunData {
  access_token: string
  refresh_token: string
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
