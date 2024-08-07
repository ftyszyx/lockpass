import { Vault } from '@common/entitys/vault.entity'
import { BaseService } from './base.service'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { EntityType } from '@common/entitys/app.entity'

export class ValutService extends BaseService<Vault> {
  constructor() {
    super(new Vault())
  }

  AfterChange(): void {
    AppEvent.emit(AppEventType.VaultChange)
    AppEvent.emit(AppEventType.DataChange, EntityType.vault)
  }
}
