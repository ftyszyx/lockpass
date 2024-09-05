export enum UpdateEventType {
  updateAvaliable = 'updateAvaliable',
  UpdateEmpty = 'UpdateEmpty',
  UpdateError = 'UpdateError',
  UpdateProgress = 'UpdateProgress',
  UpdateDownOk = 'UpdateDownOk'
}

export interface UpdateInfo {
  version: string
  releaseDate: string
  releaseName: string
  releaseNotes: string
}
