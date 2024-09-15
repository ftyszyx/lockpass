import { Vault } from '@common/entitys/vault.entity'
import { BaseService } from './base.service'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { ApiResp, ApiRespCode, EntityType } from '@common/entitys/app.entity'
import AppModel from '@main/models/app.model'

export class ValutService extends BaseService<Vault> {
  constructor() {
    super(new Vault())
  }

  async DeleteByIdApi(id: number): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.other_err, data: null }
    const db = AppModel.getInstance().db_helper
    try {
      db.beginTransaction()
      AppModel.getInstance().vaultItem.DeleteMany({ cond: { vault_id: id } })
      super.DeleteById(id)
      db.commitTransaction()
      res.code = ApiRespCode.SUCCESS
    } catch (e: any) {
      db.rollbackTransaction()
      res.code = ApiRespCode.db_err
    }
    return res
  }

  AfterChange(): void {
    AppEvent.emit(AppEventType.VaultChange)
    AppEvent.emit(AppEventType.DataChange, EntityType.vault)
    AppModel.getInstance().set.set_vault_change_not_backup(true)
  }
}
