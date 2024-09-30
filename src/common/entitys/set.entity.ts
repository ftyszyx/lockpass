import { CurUseBackupInfo, DriveUserSet } from './drive.entity'
import { LogLevel } from './log.entity'

export interface AppSetInfo {
  lang?: string
  sql_ver: number
  app_ver: number
  cur_user_uid?: number
  log_level?: LogLevel
  window_width: number
  window_height: number
  open_dev?: boolean
  drive_user_set?: DriveUserSet
  cur_use_backup_info?: CurUseBackupInfo
}
