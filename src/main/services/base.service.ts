import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { BaseEntity, WhereDef } from '@common/entitys/db.entity'
import DbHlper from '@main/libs/db_help'
import { Log } from '@main/libs/log'

export class BaseService<Entity extends BaseEntity> {
  constructor(public entity: Entity) {}
  public async GetAll(): Promise<ApiResp<Entity[]>> {
    const res: ApiResp<Entity[]> = { code: ApiRespCode.SUCCESS, data: [] }
    try {
      res.data = await DbHlper.instance().GetAll(this.entity, null)
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
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async GetOne(key: string, value: any) {
    const items = await DbHlper.instance().GetOne(this.entity, { cond: { [key]: value } })
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
      await DbHlper.instance().AddOne(entity)
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async UpdateOne(old: Entity, chang_values: Entity): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.SUCCESS }
    try {
      await DbHlper.instance().UpdateOne(this.entity, old, chang_values)
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
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
