import { VaultItem } from '@common/entitys/vault_item.entity'
import { BaseService } from './base.service'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { EntityType } from '@common/entitys/app.entity'
import AppModel from '@main/models/app.model'

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
    AppModel.getInstance().set.set_vault_change_not_backup(true)
  }
}
