import { Vault } from '@common/entitys/vault.entity'
import { BaseService } from './base.service'

export class ValutService extends BaseService<Vault> {
  constructor() {
    super(new Vault())
  }
}
