import { Vault } from '@common/entitys/valuts.entity'
import { BaseService } from './base.service'

export class ValutService extends BaseService<Vault> {
  constructor() {
    super(new Vault())
  }
}
