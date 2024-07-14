import { BaseEntity } from '@common/entitys/db.entity'
import DbHlper from '@main/libs/db_help'

export class BaseService<Entity extends BaseEntity> {
  constructor(public entity: Entity) {}
  public async GetAll(): Promise<Entity[]> {
    return DbHlper.instance().GetAll(this.entity, null)
  }

  public async AddOne(obj: Record<string, any>): Promise<void> {
    const co_fun = this.entity.constructor as new () => Entity
    const entity = new co_fun()
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      const value = obj[key]
      if (value) entity[key] = value
    })
    await DbHlper.instance().AddOne(entity)
  }

  public async UpdateOne(old: Entity, chang_values: Entity): Promise<void> {
    await DbHlper.instance().UpdateOne(this.entity, old, chang_values)
  }

  public async DeleteOne(id: number): Promise<void> {
    await DbHlper.instance().DelOne(this.entity, 'id', id)
  }
}
