import { AppEntity } from '@common/entitys/app.entity'
import { BaseService } from './base.service'

export class AppService extends BaseService<AppEntity> {
  constructor() {
    super(new AppEntity())
  }
}
