import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { BaseEntity, WhereDef } from '@common/entitys/db.entity'
import DbHlper from '@main/libs/db_help'
import { Log } from '@main/libs/log'

export class BaseService<Entity extends BaseEntity> {
  constructor(public entity: Entity) {}
  fixEntityPost(entity: Entity): void {}
  fiexEntityPre(entity: Entity): void {}
  public async GetAll(): Promise<ApiResp<Entity[]>> {
    const res: ApiResp<Entity[]> = { code: ApiRespCode.SUCCESS, data: [] }
    try {
      res.data = await DbHlper.instance().GetAll(this.entity, null)
      res.data.forEach((item) => {
        this.fixEntityPost(item)
      })
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async FindAll(where: WhereDef<Entity>): Promise<ApiResp<Entity[]>> {
    const res: ApiResp<Entity[]> = { code: ApiRespCode.SUCCESS, data: [] }
    try {
      res.data = await DbHlper.instance().GetAll(this.entity, where)
      res.data.forEach((item) => {
        this.fixEntityPost(item)
      })
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async GetOne(key: string, value: any) {
    const items = await DbHlper.instance().GetOne(this.entity, { cond: { [key]: value } })
    items.forEach((item) => {
      this.fixEntityPost(item)
    })
    return items
  }

  public async AddOne(obj: Record<string, any>): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.SUCCESS }
    const co_fun = this.entity.constructor as new () => Entity
    const entity = new co_fun()
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      const value = obj[key]
      if (value) entity[key] = value
    })
    try {
      this.fiexEntityPre(entity)
      await DbHlper.instance().AddOne(entity)
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async UpdateOne2(
    chang_values: Entity,
    return_new: boolean
  ): Promise<ApiResp<null | Entity>> {
    const res: ApiResp<null | Entity> = { code: ApiRespCode.SUCCESS }
    try {
      const old = await DbHlper.instance().GetOne(this.entity, { cond: { id: chang_values.id } })
      if (old.length <= 0) {
        res.code = ApiRespCode.data_not_find
        return res
      }
      this.fiexEntityPre(chang_values)
      await DbHlper.instance().UpdateOne(this.entity, old[0], chang_values)
      if (return_new) {
        const users = await DbHlper.instance().GetOne(this.entity, {
          cond: { id: chang_values.id }
        })
        if (users && users.length > 0) {
          this.fixEntityPost(users[0])
          res.data = users[0]
        } else {
          res.code = ApiRespCode.data_not_find
        }
      }
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async UpdateOne(chang_values: Entity): Promise<ApiResp<null | Entity>> {
    return this.UpdateOne2(chang_values, false)
  }

  public async DeleteOne(id: number): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.SUCCESS }
    try {
      await DbHlper.instance().DelOne(this.entity, 'id', id)
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }
}
