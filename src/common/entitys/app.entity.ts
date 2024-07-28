export interface ApiResp<T> {
  code: ApiRespCode // 状态，200成功
  data?: T // 返回的数据
  message?: string // 返回的消息
}

export enum ApiRespCode {
  SUCCESS = 200,
  //user
  key_not_found = 1,
  ver_not_match = 2,
  password_err = 3,
  user_notfind = 4,
  user_exit = 5,
  form_err = 6,
  //common
  other_err = 205,
  db_err = 206,
  unkonw = 207
}
