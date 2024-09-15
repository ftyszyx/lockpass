import { VaultItem } from '@common/entitys/vault_item.entity'
import { BaseService } from './base.service'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { EntityType } from '@common/entitys/app.entity'

export class VaultItemService extends BaseService<VaultItem> {
  constructor() {
    super(new VaultItem())
  }

  fixEntityIn(info: VaultItem): void {
    if (info.info) {
      info.info = JSON.stringify(info.info)
      if (!info.create_time) {
        info.create_time = Math.floor(Date.now() / 1000)
      }
    }
  }

  fixEntityOut(info: VaultItem): void {
    info.info = JSON.parse((info.info as string) || '{}')
  }

  AfterChange(): void {
    AppEvent.emit(AppEventType.VaultItemChange)
    AppEvent.emit(AppEventType.DataChange, EntityType.vault_item)
  }
}
