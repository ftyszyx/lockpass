import { VaultItem } from '@common/entitys/vault_item.entity'
import { BaseService } from './base.service'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { EntityType } from '@common/entitys/app.entity'

export class VaultItemService extends BaseService<VaultItem> {
  constructor() {
    super(new VaultItem())
  }

  AfterChange(): void {
    AppEvent.emit(AppEventType.VaultItemChange)
    AppEvent.emit(AppEventType.DataChange, EntityType.vault_item)
  }
}
