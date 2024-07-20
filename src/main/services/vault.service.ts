import { Vault } from '@common/entitys/vaults.entity'
import { BaseService } from './base.service'

export class ValutService extends BaseService<Vault> {
  constructor() {
    super(new Vault())
  }
}
