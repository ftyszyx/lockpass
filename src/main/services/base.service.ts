import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { BaseEntity, SearchField, WhereDef } from '@common/entitys/db.entity'
import { Log } from '@main/libs/log'
import AppModel from '@main/models/app.model'

export class BaseService<Entity extends BaseEntity> {
  constructor(public entity: Entity) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fixEntityOut(_: Entity): void {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fixEntityIn(_: Entity): void {
    return
  }

  AfterChange(): void {
    return
  }

  public async GetAll(): Promise<ApiResp<Entity[]>> {
    const res: ApiResp<Entity[]> = { code: ApiRespCode.SUCCESS, data: [] }
    try {
      res.data = await AppModel.getInstance().db_helper.GetMany(this.entity, null)
      res.data.forEach((item) => {
        this.fixEntityOut(item)
      })
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async GetMany(where: WhereDef<Entity>): Promise<Entity[]> {
    const items = await AppModel.getInstance().db_helper.GetMany(this.entity, where)
    items.forEach((item) => {
      this.fixEntityOut(item)
    })
    return items
  }

  public async GetManyApi(where: WhereDef<Entity>): Promise<ApiResp<Entity[]>> {
    const res: ApiResp<Entity[]> = { code: ApiRespCode.SUCCESS, data: [] }
    try {
      res.data = await this.GetMany(where)
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async GetOne(cond: SearchField<Entity>) {
    const items = await AppModel.getInstance().db_helper.GetOne(this.entity, { cond })
    items.forEach((item) => {
      this.fixEntityOut(item)
    })
    if (items.length > 0) {
      return items[0]
    }
    return null
  }

  public async AddMany(list: Entity[]): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.SUCCESS }
    const dbhelpr = AppModel.getInstance().db_helper
    try {
      dbhelpr.beginTransaction()
      for (let i = 0; i < list.length; i++) {
        const entity = this.objToEntity(list[i])
        this.fixEntityIn(entity)
        // Log.info('add one', JSON.stringify(entity))
        await AppModel.getInstance().db_helper.AddOne(entity)
      }
      dbhelpr.commitTransaction()
      this.AfterChange()
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
      dbhelpr.rollbackTransaction()
    }
    return res
  }

  objToEntity(obj: Record<string, any>): Entity {
    const co_fun = this.entity.constructor as new () => Entity
    const entity = new co_fun()
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      const value = obj[key]
      if (value) entity[key] = value
    })
    return entity
  }

  public async AddOne(obj: Record<string, any>): Promise<Entity> {
    const entity = this.objToEntity(obj)
    this.fixEntityIn(entity)
    const res = await AppModel.getInstance().db_helper.AddOne(entity)
    this.AfterChange()
    return res
  }

  public async AddOneApi(obj: Record<string, any>): Promise<ApiResp<Entity>> {
    const res: ApiResp<Entity> = { code: ApiRespCode.SUCCESS }
    try {
      res.data = await this.AddOne(obj)
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
      const old = await AppModel.getInstance().db_helper.GetOne(this.entity, {
        cond: { id: chang_values.id }
      })
      if (old.length <= 0) {
        res.code = ApiRespCode.data_not_find
        return res
      }
      this.fixEntityIn(chang_values)
      await AppModel.getInstance().db_helper.UpdateOneById(this.entity, old[0], chang_values)
      const newInfos = await AppModel.getInstance().db_helper.GetOne(this.entity, {
        cond: { id: chang_values.id }
      })
      if (newInfos && newInfos.length > 0) {
        this.fixEntityOut(newInfos[0])
        if (return_new) {
          res.data = newInfos[0]
        }
      } else {
        res.code = ApiRespCode.data_not_find
      }
      this.AfterChange()
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }

  public async UpdateOne(chang_values: Entity): Promise<ApiResp<null | Entity>> {
    return this.UpdateOne2(chang_values, false)
  }

  public async DeleteById(id: number) {
    await AppModel.getInstance().db_helper.DelMany(this.entity, { cond: { id } })
    this.AfterChange()
  }

  public async DeleteMany(cond: WhereDef<Entity>) {
    await AppModel.getInstance().db_helper.DelMany(this.entity, cond)
    this.AfterChange()
  }

  public async DeleteByIdApi(id: number): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.SUCCESS }
    try {
      await this.DeleteById(id)
    } catch (e: any) {
      Log.Exception(e)
      res.code = ApiRespCode.db_err
    }
    return res
  }
}
