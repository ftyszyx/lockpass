import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'

type MessageType = 'error' | 'info' | 'success' | 'warning'
export function ShowMessageToMain(type: MessageType, msg: string): void {
  AppEvent.emit(AppEventType.MainMessage, type, msg)
}

export function ShowErrToMain(msg: string): void {
  ShowMessageToMain('error', msg)
}

export function ShowInfoToMain(msg: string): void {
  ShowMessageToMain('info', msg)
}
