export enum UpdateEventType {
  Checking = 'Checking',
  updateAvaliable = 'updateAvaliable',
  UpdateEmpty = 'UpdateEmpty',
  UpdateError = 'UpdateError',
  UpdateProgress = 'UpdateProgress',
  UpdateDownOk = 'UpdateDownOk'
}

export interface MyReleaseNoteInfo {
  readonly version: string
  readonly note: string | null
}

export interface MyUpdateInfo {
  version: string
  releaseDate: string
  releaseName: string
  releaseNotes: string | MyReleaseNoteInfo[]
}

export interface MyUpdateProgress {
  total: number
  delta: number
  transferred: number
  percent: number
  bytesPerSecond: number
}

export enum UpdateStatus {
  idle = 'idle',
  Checking = 'Checking',
  Downloading = 'Downloading',
  DownloadOk = 'UpdateDownOk'
}
