import { VaultItem } from '@common/entitys/vault_item.entity'
import { BaseService } from './base.service'

export class VaultItemService extends BaseService<VaultItem> {
  constructor() {
    super(new VaultItem())
  }
}
