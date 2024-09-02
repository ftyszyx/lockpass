import fs from 'fs'
import path from 'path'
import { randomBytes, createHash, createCipheriv, createDecipheriv } from 'crypto'
import { PathHelper } from './path'
import { User } from '@common/entitys/user.entity'
import { ApiRespCode } from '@common/entitys/app.entity'
import { Log } from './log'
import { SECRET_VER_CODE } from '@common/gloabl'
interface SecretyItemInfo {
  uid: number
  key: string
  valid_data: string
}
interface SecretySet {
  users: SecretyItemInfo[]
  ver: number
}

export class MyEncode {
  private _pass_hash: Buffer | null = null
  private _encode_alg = 'aes-256-cbc'
  private _set: SecretySet = { ver: SECRET_VER_CODE, users: [] }
  private _set_path: string = ''
  constructor() {
    this._set_path = this.getKeyPath()
    if (fs.existsSync(this._set_path)) {
      this.LoadSet()
    } else {
      this.saveSet()
    }
  }

  private saveSet() {
    fs.writeFileSync(this._set_path, JSON.stringify(this._set))
  }

  LoadSet() {
    this._set = JSON.parse(fs.readFileSync(this._set_path).toString())
  }

  getKeyPath() {
    return path.join(PathHelper.getHomeDir(), `secret.key`)
  }

  public HasLogin() {
    return this._pass_hash != null
  }

  public LoginOut() {
    this._pass_hash = null
  }

  public hasKey(userid: number) {
    return this._set.users.some((item) => item.uid == userid)
  }

  public Login(user: User, password: string): ApiRespCode {
    this._pass_hash = null
    if (this._set.ver != SECRET_VER_CODE) {
      return ApiRespCode.ver_not_match
    }
    const res = this.CheckMainPass(user, password)
    if (res.code == ApiRespCode.SUCCESS) {
      this._pass_hash = res.hash
    }
    return res.code
  }

  public CheckMainPass(user: User, password: string): { code: ApiRespCode; hash: Buffer } {
    const keyinfo = this._set.users.find((item) => item.uid == user.id)
    const resp = { code: ApiRespCode.SUCCESS, hash: null }
    if (keyinfo == null) {
      resp.code = ApiRespCode.key_not_found
      return resp
    }
    const hash = this.getPassHash(keyinfo.key, password)
    try {
      const encode_data = this.Decode2(keyinfo.valid_data, hash)
      if (encode_data !== this.getUserValidStr(user)) {
        resp.code = ApiRespCode.password_err
        return resp
      }
    } catch (e: any) {
      Log.Exception(e)
      resp.code = ApiRespCode.password_err
      return resp
    }
    resp.hash = hash
    return resp
  }

  public Register(user: User, password: string) {
    // prettier-ignore
    const key_data = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
    const rand_len = 25
    const randbytes = randomBytes(rand_len)
    let key = ''
    for (let i = 0; i < rand_len; i++) {
      key += key_data[randbytes[i] % key_data.length]
      if (i % 5 == 4 && i < rand_len - 1) {
        key += '-'
      }
    }
    const hash = this.getPassHash(key, password)
    const valid_data = this.Encode2(this.getUserValidStr(user), hash)
    const keyinfo: SecretyItemInfo = { key, valid_data, uid: user.id }
    this._set.users.push(keyinfo)
    this.saveSet()
  }

  private getUserValidStr(user: User) {
    return JSON.stringify({ username: user.username, id: user.id })
  }

  public getPassHash(key: string, password: string) {
    return createHash('sha256').update(`${key}-${password}`).digest()
  }

  public getPassHashStr(key: string, password: string) {
    return createHash('sha256').update(`${key}-${password}`).digest('base64')
  }

  public Encode(data: string): string {
    return this.Encode2(data, this._pass_hash)
  }

  Encode2(data: string, key: Buffer): string {
    try {
      if (key == null) {
        Log.Error('key is null')
        return ''
      }
      const iv = randomBytes(16)
      const cliper = createCipheriv(this._encode_alg, key, iv)
      let encrypted = cliper.update(data, 'utf8', 'base64url')
      encrypted += cliper.final('base64url')
      encrypted += '|' + iv.toString('base64url')
      return encrypted
    } catch (e: any) {
      Log.Exception(e)
    }
    return data
  }

  public Decode(data: string): string {
    return this.Decode2(data, this._pass_hash)
  }

  Decode2(data: string, key: Buffer): string {
    try {
      if (key == null) {
        Log.Error('key is null')
        return ''
      }
      const [data_str, iv_str] = data.split('|')
      const iv = Buffer.from(iv_str, 'base64url')
      const decipher = createDecipheriv(this._encode_alg, key, iv)
      let decrypted = decipher.update(data_str, 'base64url', 'utf8')
      decrypted += decipher.final('utf8')
      return decrypted
    } catch (e: any) {
      Log.Exception(e, data)
    }
    return data
  }
}
