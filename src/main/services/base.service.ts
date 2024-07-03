import { BaseEntity } from '@common/entitys/db.entity'
import DbHlper from '@main/libs/db_help'

export class BaseService<Entity extends BaseEntity> {
  constructor(public entity: Entity) {}

  public async GetAll(): Promise<Entity[]> {
    return DbHlper.instance().GetAll(this.entity, null)
  }

  public async AddOne(value: Entity): Promise<void> {
    return DbHlper.instance().AddOne(value)
  }

  public async UpdateOne(vault: Entity): Promise<void> {
    return DbHlper.instance().UpdateOne(vault)
  }

  public async DeleteOne(id: number): Promise<void> {
    return DbHlper.instance().DelOne(this.entity, 'id', id)
  }
}
