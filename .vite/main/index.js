"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("reflect-metadata");
const os = require("os");
const stream = require("stream");
const robot = require("robotjs");
const zl = require("zip-lib");
const sqlite3 = require("sqlite3");
const https = require("https");
class PathHelper {
  static initPath() {
    return;
  }
  static getHomeDir() {
    return process.cwd();
  }
}
const APP_VER_CODE = 1;
const SQL_VER_CODE = 1;
const SECRET_VER_CODE = 1;
const Column_Name_KEY = "col_name";
const Column_Type_KEY = "col_type";
const Table_Name_KEY = "table_name";
const COlumn_Encode_key = "encode";
const SYS_TEM_NAME = "lockpass";
const SYS_PROTOL_URL = "lockpass://";
const Default_Lang = "zh-cn";
var Icon_type = /* @__PURE__ */ ((Icon_type2) => {
  Icon_type2["icon_money"] = "icon-money";
  Icon_type2["icon_document"] = "icon-document";
  Icon_type2["icon_note"] = "icon-note";
  Icon_type2["icon_password"] = "icon-password";
  Icon_type2["icon_id"] = "icon-identity";
  Icon_type2["icon_1password"] = "icon-1password";
  Icon_type2["icon_login"] = "icon-login";
  Icon_type2["icon_api"] = "icon-api_key";
  Icon_type2["icon_api2"] = "icon-api_key2";
  Icon_type2["icon_money1"] = "icon-money1";
  Icon_type2["icon_personal"] = "icon-personal";
  Icon_type2["icon_lock"] = "icon-lock";
  Icon_type2["icon_money2"] = "icon-money2";
  Icon_type2["icon_remove"] = "icon-remove";
  Icon_type2["icon_remove1"] = "icon-remove1";
  Icon_type2["icon_lock2"] = "icon-lock2";
  Icon_type2["icon_card"] = "icon-card";
  Icon_type2["icon_chrome"] = "icon-chrome";
  Icon_type2["icon_eye_fill"] = "icon-eye-fill";
  Icon_type2["icon_eyeclose_fill"] = "icon-eyeclose-fill";
  Icon_type2["icon_set"] = "icon-set";
  Icon_type2["normal_set"] = "icon-set2";
  Icon_type2["shortcut_local_set"] = "icon-shortcut";
  Icon_type2["shortcut_global_set"] = "icon-shortcut1";
  Icon_type2["icon_add"] = "icon-add";
  Icon_type2["icon_log"] = "icon-log";
  Icon_type2["icon_help"] = "icon-help";
  Icon_type2["icon_user"] = "icon-user";
  Icon_type2["icon_man"] = "icon-man";
  Icon_type2["icon_type"] = "icon-type";
  Icon_type2["icon_type2"] = "icon-type2";
  Icon_type2["icon_rank"] = "icon-rank";
  Icon_type2["icon_del"] = "icon-delete";
  Icon_type2["icon_fold"] = "icon-fold";
  Icon_type2["icon_refresh"] = "icon-refresh";
  Icon_type2["icon_detail"] = "icon-viewDetail";
  Icon_type2["icon_detail2"] = "icon-viewDetail2";
  Icon_type2["icon_close"] = "icon-close";
  Icon_type2["icon_close1"] = "icon-close1";
  Icon_type2["icon_logo"] = "icon-iconlock";
  Icon_type2["icon_about"] = "icon-about";
  return Icon_type2;
})(Icon_type || {});
var VaultItemType = /* @__PURE__ */ ((VaultItemType2) => {
  VaultItemType2["Login"] = "login";
  VaultItemType2["Card"] = "card";
  VaultItemType2["NoteBook"] = "note";
  return VaultItemType2;
})(VaultItemType || {});
var ConsoleColor = /* @__PURE__ */ ((ConsoleColor2) => {
  ConsoleColor2["Reset"] = "\x1B[0m";
  ConsoleColor2["Bright"] = "\x1B[1m";
  ConsoleColor2["Dim"] = "\x1B[2m";
  ConsoleColor2["Underscore"] = "\x1B[4m";
  ConsoleColor2["Blink"] = "\x1B[5m";
  ConsoleColor2["Reverse"] = "\x1B[7m";
  ConsoleColor2["Hidden"] = "\x1B[8m";
  ConsoleColor2["FgBlack"] = "\x1B[30m";
  ConsoleColor2["FgRed"] = "\x1B[31m";
  ConsoleColor2["FgGreen"] = "\x1B[32m";
  ConsoleColor2["FgYellow"] = "\x1B[33m";
  ConsoleColor2["FgBlue"] = "\x1B[34m";
  ConsoleColor2["FgMagenta"] = "\x1B[35m";
  ConsoleColor2["FgCyan"] = "\x1B[36m";
  ConsoleColor2["FgWhite"] = "\x1B[37m";
  ConsoleColor2["FgGray"] = "\x1B[90m";
  ConsoleColor2["BgBlack"] = "\x1B[40m";
  ConsoleColor2["BgRed"] = "\x1B[41m";
  ConsoleColor2["BgGreen"] = "\x1B[42m";
  ConsoleColor2["BgYellow"] = "\x1B[43m";
  ConsoleColor2["BgBlue"] = "\x1B[44m";
  ConsoleColor2["BgMagenta"] = "\x1B[45m";
  ConsoleColor2["BgCyan"] = "\x1B[46m";
  ConsoleColor2["BgWhite"] = "\x1B[47m";
  ConsoleColor2["BgGray"] = "\x1B[100m";
  return ConsoleColor2;
})(ConsoleColor || {});
var ControlKey = /* @__PURE__ */ ((ControlKey2) => {
  ControlKey2["Control"] = "CommandOrControl";
  ControlKey2["ctrl"] = "Ctrl";
  ControlKey2["Shift"] = "Shift";
  ControlKey2["Alt"] = "Alt";
  ControlKey2["Meta"] = "Meta";
  ControlKey2["Space"] = "Space";
  return ControlKey2;
})(ControlKey || {});
var GenPasswordType = /* @__PURE__ */ ((GenPasswordType2) => {
  GenPasswordType2["random"] = "random";
  GenPasswordType2["Pin"] = "pin";
  GenPasswordType2["Memory"] = "memory";
  return GenPasswordType2;
})(GenPasswordType || {});
const DefaultPasswordTypeConf = {
  random_characters_len: 11,
  random_number: true,
  random_symbol: true,
  random_capitalize: true,
  memory_words_num: 4,
  memory_separator: "-",
  memory_capitalize: true,
  memory_word_full: false,
  pin_code_num: 6
};
function getColumTypeCategory(type) {
  if (type == "BIGINT" || type == "INT" || type == "DOUBLE" || type == "TINYINT" || type == "INTEGER") {
    return "number";
  }
  if (type == "VARCHAR" || type == "BLOB" || type == "TIMESTAMP" || type == "DATE") {
    return "string";
  }
  if (type == "VARCHAR[]") {
    return "array";
  }
  if (type == "BOOLEAN") {
    return "boolean";
  }
  return "unkown";
}
function Column(options) {
  return function(instance, propertyName) {
    if (!options) options = {};
    const col_name = options.name || propertyName.toString();
    const col_type = options.type || "VARCHAR";
    Reflect.defineMetadata(Column_Name_KEY, col_name, instance, propertyName);
    Reflect.defineMetadata(Column_Type_KEY, col_type, instance, propertyName);
    for (const key in options) {
      Reflect.defineMetadata(key, options[key], instance, propertyName);
    }
  };
}
function Entity(options) {
  return function(target) {
    if (!options) options = {};
    const table_name = options.name || target.name;
    target.prototype.table_name = table_name;
  };
}
var __defProp$4 = Object.defineProperty;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = decorator(target, key, result) || result;
  if (result) __defProp$4(target, key, result);
  return result;
};
class BaseEntity {
  constructor() {
    __publicField(this, "id");
  }
}
__decorateClass$4([
  Column({ type: "INTEGER", primary: true, unique: true })
], BaseEntity.prototype, "id");
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
  return result;
};
let AppEntity = class extends BaseEntity {
  constructor() {
    super(...arguments);
    __publicField(this, "app_set");
  }
};
__decorateClass$3([
  Column({ type: "VARCHAR" })
], AppEntity.prototype, "app_set", 2);
AppEntity = __decorateClass$3([
  Entity({ name: "app" })
], AppEntity);
var ApiRespCode = /* @__PURE__ */ ((ApiRespCode2) => {
  ApiRespCode2[ApiRespCode2["SUCCESS"] = 200] = "SUCCESS";
  ApiRespCode2[ApiRespCode2["key_not_found"] = 1] = "key_not_found";
  ApiRespCode2[ApiRespCode2["ver_not_match"] = 2] = "ver_not_match";
  ApiRespCode2[ApiRespCode2["password_err"] = 3] = "password_err";
  ApiRespCode2[ApiRespCode2["user_notfind"] = 4] = "user_notfind";
  ApiRespCode2[ApiRespCode2["user_exit"] = 5] = "user_exit";
  ApiRespCode2[ApiRespCode2["form_err"] = 6] = "form_err";
  ApiRespCode2[ApiRespCode2["data_not_find"] = 7] = "data_not_find";
  ApiRespCode2[ApiRespCode2["update_err"] = 8] = "update_err";
  ApiRespCode2[ApiRespCode2["aliyun_err"] = 100] = "aliyun_err";
  ApiRespCode2[ApiRespCode2["alyun_not_auth"] = 101] = "alyun_not_auth";
  ApiRespCode2[ApiRespCode2["aliyun_file_exit"] = 102] = "aliyun_file_exit";
  ApiRespCode2[ApiRespCode2["aliyun_upload_err"] = 103] = "aliyun_upload_err";
  ApiRespCode2[ApiRespCode2["other_err"] = 205] = "other_err";
  ApiRespCode2[ApiRespCode2["db_err"] = 206] = "db_err";
  ApiRespCode2[ApiRespCode2["unkonw"] = 207] = "unkonw";
  return ApiRespCode2;
})(ApiRespCode || {});
const defaultUserSetInfo = {
  normal_autolock_time: 5,
  normal_lock_with_pc: true,
  shortcut_global_quick_find: `${ControlKey.ctrl}+ ${ControlKey.Shift}+A`,
  shortcut_global_quick_lock: `${ControlKey.ctrl}+ ${ControlKey.Shift}+L`,
  shortcut_global_open_main: `${ControlKey.ctrl}+ ${ControlKey.Shift}+Up`,
  shortcut_local_find: `${ControlKey.ctrl}+F`,
  shortcut_local_view_shortcut: `${ControlKey.ctrl}+/`,
  password_type: GenPasswordType.random,
  password_type_conf: DefaultPasswordTypeConf
};
var renderViewType = /* @__PURE__ */ ((renderViewType2) => {
  renderViewType2["Mainview"] = "mainview";
  renderViewType2["Quickview"] = "quickview";
  return renderViewType2;
})(renderViewType || {});
var EntityType = /* @__PURE__ */ ((EntityType2) => {
  EntityType2["user"] = "user";
  EntityType2["vault"] = "vault";
  EntityType2["vault_item"] = "vault_item";
  return EntityType2;
})(EntityType || {});
class FileLogWriter {
  constructor(path2, writeAync = false) {
    __publicField(this, "asyncWriteQueue", []);
    __publicField(this, "hasActiveAsyncWriting", false);
    this.path = path2;
    this.writeAync = writeAync;
    console.log(`log path: ${path2}`);
  }
  writeAyncNext() {
    if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) {
      return;
    }
    const text = this.asyncWriteQueue.join("");
    this.asyncWriteQueue = [];
    this.hasActiveAsyncWriting = true;
    fs.writeFile(this.path, text, { encoding: "utf-8" }, (e) => {
      this.hasActiveAsyncWriting = false;
      if (e) {
        console.log(`Couldn't write to ${this.path}. ${e.message}`);
      }
      this.writeAyncNext();
    });
  }
  writeLine(text) {
    text += os.EOL;
    if (this.writeAync) {
      this.asyncWriteQueue.push(text);
      this.writeAyncNext();
      return;
    }
  }
}
const _Log = class _Log {
  static initialize() {
    const date = /* @__PURE__ */ new Date();
    const log_dir = `${PathHelper.getHomeDir()}/log`;
    if (!fs.existsSync(log_dir)) {
      fs.mkdirSync(log_dir);
    }
    const log_path = `${log_dir}/lockpass-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
    _Log.logWriter = new FileLogWriter(log_path, true);
  }
  static Debug(...args) {
    const logstr = `[Debug] ${(/* @__PURE__ */ new Date()).toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(" ")}`;
    _Log.logWriter.writeLine(logstr);
    console.log(logstr);
  }
  static Info(...args) {
    const logstr = `[INFO] ${(/* @__PURE__ */ new Date()).toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(" ")}`;
    _Log.logWriter.writeLine(logstr);
    console.log(logstr);
  }
  static Error(...args) {
    const obj = /* @__PURE__ */ Object.create(null);
    Error.captureStackTrace(obj);
    Error.stackTraceLimit = 10;
    const logstr = `[Error] ${(/* @__PURE__ */ new Date()).toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(" ")} 
    
 stack:
 ${obj.stack}`;
    _Log.logWriter.writeLine(logstr);
    console.trace(`${ConsoleColor.FgRed}${logstr}${ConsoleColor.FgRed}`);
  }
  static Exception(e, ...args) {
    const logstr = `[Error] ${(/* @__PURE__ */ new Date()).toLocaleString(this.locale, { timeZone: this.time_zone })} ${e.message} ${args.join(" ")}
    
 stack:
 ${e.stack}`;
    _Log.logWriter.writeLine(logstr);
    console.trace(`${ConsoleColor.FgRed}${logstr}${ConsoleColor.FgRed}`);
  }
};
__publicField(_Log, "logWriter");
__publicField(_Log, "log_level", 0);
__publicField(_Log, "time_zone", "Asia/Shanghai");
__publicField(_Log, "locale", "zh-CN");
let Log = _Log;
class MyEncode {
  constructor() {
    __publicField(this, "_pass_hash", null);
    __publicField(this, "_encode_alg", "aes-256-cbc");
    __publicField(this, "_set", { ver: SECRET_VER_CODE, users: [] });
    __publicField(this, "_set_path", "");
    this._set_path = this.getKeyPath();
    if (fs.existsSync(this._set_path)) {
      this.LoadSet();
    } else {
      this.saveSet();
    }
  }
  saveSet() {
    fs.writeFileSync(this._set_path, JSON.stringify(this._set));
  }
  LoadSet() {
    this._set = JSON.parse(fs.readFileSync(this._set_path).toString());
  }
  getKeyPath() {
    return path.join(PathHelper.getHomeDir(), `secret.key`);
  }
  HasLogin() {
    return this._pass_hash != null;
  }
  LoginOut() {
    this._pass_hash = null;
  }
  hasKey(userid) {
    return this._set.users.some((item) => item.uid == userid);
  }
  Login(user, password) {
    this._pass_hash = null;
    if (this._set.ver != SECRET_VER_CODE) {
      return ApiRespCode.ver_not_match;
    }
    const keyinfo = this._set.users.find((item) => item.uid == user.id);
    if (keyinfo == null) return ApiRespCode.key_not_found;
    const hash = this.getPassHash(keyinfo.key, password);
    try {
      const encode_data = this.Decode2(keyinfo.valid_data, hash);
      if (encode_data !== this.getUserValidStr(user)) {
        return ApiRespCode.password_err;
      }
    } catch (e) {
      Log.Exception(e);
      return ApiRespCode.password_err;
    }
    this._pass_hash = hash;
    return ApiRespCode.SUCCESS;
  }
  Register(user, password) {
    const key_data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const rand_len = 25;
    const randbytes = crypto.randomBytes(rand_len);
    let key = "";
    for (let i = 0; i < rand_len; i++) {
      key += key_data[randbytes[i] % key_data.length];
      if (i % 5 == 4 && i < rand_len - 1) {
        key += "-";
      }
    }
    const hash = this.getPassHash(key, password);
    const valid_data = this.Encode2(this.getUserValidStr(user), hash);
    const keyinfo = { key, valid_data, uid: user.id };
    this._set.users.push(keyinfo);
    this.saveSet();
  }
  getUserValidStr(user) {
    return JSON.stringify({ username: user.username, id: user.id });
  }
  getPassHash(key, password) {
    return crypto.createHash("sha256").update(`${key}-${password}`).digest();
  }
  getPassHashStr(key, password) {
    return crypto.createHash("sha256").update(`${key}-${password}`).digest("base64");
  }
  Encode(data) {
    return this.Encode2(data, this._pass_hash);
  }
  Encode2(data, key) {
    try {
      if (key == null) {
        Log.Error("key is null");
        return "";
      }
      const iv = crypto.randomBytes(16);
      const cliper = crypto.createCipheriv(this._encode_alg, key, iv);
      let encrypted = cliper.update(data, "utf8", "base64url");
      encrypted += cliper.final("base64url");
      encrypted += "|" + iv.toString("base64url");
      return encrypted;
    } catch (e) {
      Log.Exception(e);
    }
    return data;
  }
  Decode(data) {
    return this.Decode2(data, this._pass_hash);
  }
  Decode2(data, key) {
    try {
      if (key == null) {
        Log.Error("key is null");
        return "";
      }
      const [data_str, iv_str] = data.split("|");
      const iv = Buffer.from(iv_str, "base64url");
      const decipher = crypto.createDecipheriv(this._encode_alg, key, iv);
      let decrypted = decipher.update(data_str, "base64url", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (e) {
      Log.Exception(e, data);
    }
    return data;
  }
}
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let Vault = class extends BaseEntity {
  constructor() {
    super(...arguments);
    __publicField(this, "name");
    __publicField(this, "user_id");
    __publicField(this, "icon");
    __publicField(this, "info");
  }
};
__decorateClass$2([
  Column({
    type: "VARCHAR",
    unique_index: true,
    index_name: "name_index",
    notNull: true
  })
], Vault.prototype, "name", 2);
__decorateClass$2([
  Column({ type: "INTEGER", notNull: true })
], Vault.prototype, "user_id", 2);
__decorateClass$2([
  Column({ type: "VARCHAR" })
], Vault.prototype, "icon", 2);
__decorateClass$2([
  Column({ type: "VARCHAR", encode: true })
], Vault.prototype, "info", 2);
Vault = __decorateClass$2([
  Entity({ name: "vault" })
], Vault);
class BaseService {
  constructor(entity) {
    this.entity = entity;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fixEntityOut(_) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fixEntityIn(_) {
    return;
  }
  AfterChange() {
    return;
  }
  async GetAll() {
    const res = { code: ApiRespCode.SUCCESS, data: [] };
    try {
      res.data = await AppModel$1.getInstance().db_helper.GetAll(this.entity, null);
      res.data.forEach((item) => {
        this.fixEntityOut(item);
      });
    } catch (e) {
      Log.Exception(e);
      res.code = ApiRespCode.db_err;
    }
    return res;
  }
  async GetMany(where) {
    const items = await AppModel$1.getInstance().db_helper.GetAll(this.entity, where);
    items.forEach((item) => {
      this.fixEntityOut(item);
    });
    return items;
  }
  async GetManyApi(where) {
    const res = { code: ApiRespCode.SUCCESS, data: [] };
    try {
      res.data = await this.GetMany(where);
    } catch (e) {
      Log.Exception(e);
      res.code = ApiRespCode.db_err;
    }
    return res;
  }
  async GetOne(cond) {
    const items = await AppModel$1.getInstance().db_helper.GetOne(this.entity, { cond });
    items.forEach((item) => {
      this.fixEntityOut(item);
    });
    if (items.length > 0) {
      return items[0];
    }
    return null;
  }
  async AddMany(list) {
    const res = { code: ApiRespCode.SUCCESS };
    const dbhelpr = AppModel$1.getInstance().db_helper;
    try {
      dbhelpr.beginTransaction();
      for (let i = 0; i < list.length; i++) {
        const entity = this.objToEntity(list[i]);
        this.fixEntityIn(entity);
        await AppModel$1.getInstance().db_helper.AddOne(entity);
      }
      dbhelpr.commitTransaction();
      this.AfterChange();
    } catch (e) {
      Log.Exception(e);
      res.code = ApiRespCode.db_err;
      dbhelpr.rollbackTransaction();
    }
    return res;
  }
  objToEntity(obj) {
    const co_fun = this.entity.constructor;
    const entity = new co_fun();
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const value = obj[key];
      if (value) entity[key] = value;
    });
    return entity;
  }
  async AddOne(obj) {
    const entity = this.objToEntity(obj);
    this.fixEntityIn(entity);
    await AppModel$1.getInstance().db_helper.AddOne(entity);
    this.AfterChange();
  }
  async AddOneApi(obj) {
    const res = { code: ApiRespCode.SUCCESS };
    try {
      await this.AddOne(obj);
    } catch (e) {
      Log.Exception(e);
      res.code = ApiRespCode.db_err;
    }
    return res;
  }
  async UpdateOne2(chang_values, return_new) {
    const res = { code: ApiRespCode.SUCCESS };
    try {
      const old = await AppModel$1.getInstance().db_helper.GetOne(this.entity, {
        cond: { id: chang_values.id }
      });
      if (old.length <= 0) {
        res.code = ApiRespCode.data_not_find;
        return res;
      }
      this.fixEntityIn(chang_values);
      await AppModel$1.getInstance().db_helper.UpdateOne(this.entity, old[0], chang_values);
      if (return_new) {
        const users = await AppModel$1.getInstance().db_helper.GetOne(this.entity, {
          cond: { id: chang_values.id }
        });
        if (users && users.length > 0) {
          this.fixEntityOut(users[0]);
          res.data = users[0];
        } else {
          res.code = ApiRespCode.data_not_find;
        }
      }
      this.AfterChange();
    } catch (e) {
      Log.Exception(e);
      res.code = ApiRespCode.db_err;
    }
    return res;
  }
  async UpdateOne(chang_values) {
    return this.UpdateOne2(chang_values, false);
  }
  async DeleteById(id) {
    await AppModel$1.getInstance().db_helper.DelMany(this.entity, { cond: { id } });
    this.AfterChange();
  }
  async DeleteMany(cond) {
    await AppModel$1.getInstance().db_helper.DelMany(this.entity, cond);
    this.AfterChange();
  }
  async DeleteByIdApi(id) {
    const res = { code: ApiRespCode.SUCCESS };
    try {
      await this.DeleteById(id);
    } catch (e) {
      Log.Exception(e);
      res.code = ApiRespCode.db_err;
    }
    return res;
  }
}
var AppEventType = /* @__PURE__ */ ((AppEventType2) => {
  AppEventType2["LockApp"] = "LockApp";
  AppEventType2["windowBlur"] = "windowBlur";
  AppEventType2["LoginOk"] = "LoginOk";
  AppEventType2["LoginOut"] = "LoginOut";
  AppEventType2["Message"] = "Message";
  AppEventType2["MainMessage"] = "MainMessage";
  AppEventType2["VaultChange"] = "VaultChange";
  AppEventType2["UserChange"] = "UserChange";
  AppEventType2["VaultItemChange"] = "VaultItemChange";
  AppEventType2["DataChange"] = "DataChange";
  AppEventType2["DeepLink"] = "DeepLink";
  AppEventType2["AliyuAuthOk"] = "AliyuAuthOk";
  AppEventType2["APPQuit"] = "APPQuit";
  return AppEventType2;
})(AppEventType || {});
const AppEvent = new stream.EventEmitter();
class ValutService extends BaseService {
  constructor() {
    super(new Vault());
  }
  async DeleteByIdApi(id) {
    const res = { code: ApiRespCode.other_err, data: null };
    const db = AppModel$1.getInstance().db_helper;
    try {
      db.beginTransaction();
      AppModel$1.getInstance().vaultItem.DeleteMany({ cond: { vault_id: id } });
      super.DeleteById(id);
      db.commitTransaction();
      res.code = ApiRespCode.SUCCESS;
    } catch (e) {
      db.rollbackTransaction();
      res.code = ApiRespCode.db_err;
    }
    return res;
  }
  AfterChange() {
    AppEvent.emit(AppEventType.VaultChange);
    AppEvent.emit(AppEventType.DataChange, EntityType.vault);
  }
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let User = class extends BaseEntity {
  constructor() {
    super(...arguments);
    __publicField(this, "username");
    __publicField(this, "nickname");
    __publicField(this, "user_set");
  }
};
__decorateClass$1([
  Column({ type: "VARCHAR", unique_index: true, index_name: "username_index" })
], User.prototype, "username", 2);
__decorateClass$1([
  Column({ type: "VARCHAR", unique_index: false, index_name: "nickname_index" })
], User.prototype, "nickname", 2);
__decorateClass$1([
  Column({ type: "VARCHAR" })
], User.prototype, "user_set", 2);
User = __decorateClass$1([
  Entity({ name: "user" })
], User);
class UserService extends BaseService {
  constructor() {
    super(new User());
    __publicField(this, "userinfo", null);
    this.userinfo = null;
  }
  async Login(info) {
    const res = { code: ApiRespCode.other_err };
    if (!info.username || !info.password) {
      res.code = ApiRespCode.form_err;
      return res;
    }
    try {
      const user = await super.GetOne({ username: info.username });
      if (!user) {
        res.code = ApiRespCode.user_notfind;
        return res;
      }
      const res_code = AppModel$1.getInstance().myencode.Login(user, info.password);
      res.code = res_code;
      if (res_code == ApiRespCode.SUCCESS) {
        this.userinfo = user;
        AppModel$1.getInstance().Login(user.id);
        res.data = user;
      }
    } catch (e) {
      Log.Exception(e);
    }
    return res;
  }
  async GetLastUserInfo() {
    const ret = {
      code: ApiRespCode.other_err,
      data: { user: null, has_init_key: false }
    };
    const last_userid = AppModel$1.getInstance().GetLastUserId();
    if (last_userid) {
      const user = await super.GetOne({ id: last_userid });
      if (user != null) {
        ret.data.user = user;
        this.userinfo = user;
        ret.data.has_init_key = AppModel$1.getInstance().myencode.hasKey(user.id);
        ret.code = ApiRespCode.SUCCESS;
      }
    }
    return ret;
  }
  async HasLogin() {
    const res = { code: ApiRespCode.SUCCESS };
    res.data = AppModel$1.getInstance().myencode.HasLogin();
    return res;
  }
  async Logout() {
    const res = { code: ApiRespCode.SUCCESS };
    this.userinfo = null;
    AppModel$1.getInstance().LoginOut();
    return res;
  }
  async Register(info) {
    const res = { code: ApiRespCode.SUCCESS };
    const user = await super.GetOne({ username: info.username });
    if (user) {
      res.code = ApiRespCode.user_exit;
    }
    try {
      await AppModel$1.getInstance().db_helper.beginTransaction();
      await super.AddOneApi({ username: info.username, user_set: "" });
      const userinfo = await super.GetOne({ username: info.username });
      AppModel$1.getInstance().myencode.Register(userinfo, info.password);
      AppModel$1.getInstance().db_helper.commitTransaction();
      res.code = ApiRespCode.SUCCESS;
    } catch (e) {
      res.code = ApiRespCode.db_err;
      Log.Exception(e);
      await AppModel$1.getInstance().db_helper.rollbackTransaction();
    }
    return res;
  }
  async GetAll() {
    return await super.GetAll();
  }
  async UpdateUser(user) {
    return await super.UpdateOne2(user, true);
  }
  fixEntityOut(item) {
    item.user_set = JSON.parse(item.user_set || "{}");
    item.user_set = { ...defaultUserSetInfo, ...item.user_set };
    if (this.userinfo && this.userinfo.id == item.id) {
      this.userinfo = item;
    }
  }
  fixEntityIn(entity) {
    entity.user_set = JSON.stringify(entity.user_set);
  }
  AfterChange() {
    AppEvent.emit(AppEventType.UserChange);
    AppEvent.emit(AppEventType.DataChange, EntityType.user);
  }
}
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp2(target, key, result);
  return result;
};
let VaultItem = class extends BaseEntity {
  constructor() {
    super(...arguments);
    __publicField(this, "user_id");
    __publicField(this, "vault_id");
    __publicField(this, "vault_item_type");
    __publicField(this, "icon");
    __publicField(this, "name");
    __publicField(this, "info");
    __publicField(this, "remarks");
    __publicField(this, "last_use_time");
  }
};
__decorateClass([
  Column({ type: "INTEGER", notNull: true })
], VaultItem.prototype, "user_id", 2);
__decorateClass([
  Column({ type: "INTEGER", notNull: true })
], VaultItem.prototype, "vault_id", 2);
__decorateClass([
  Column({ type: "VARCHAR", notNull: true, comment: "密码类型" })
], VaultItem.prototype, "vault_item_type", 2);
__decorateClass([
  Column({ type: "VARCHAR", notNull: true })
], VaultItem.prototype, "icon", 2);
__decorateClass([
  Column({ type: "VARCHAR", notNull: true })
], VaultItem.prototype, "name", 2);
__decorateClass([
  Column({ type: "VARCHAR", encode: true, default: "" })
], VaultItem.prototype, "info", 2);
__decorateClass([
  Column({ type: "VARCHAR", encode: true, default: "" })
], VaultItem.prototype, "remarks", 2);
__decorateClass([
  Column({ type: "INTEGER", default: 0 })
], VaultItem.prototype, "last_use_time", 2);
VaultItem = __decorateClass([
  Entity({ name: "valut_item" })
], VaultItem);
class VaultItemInfoBase {
}
class LoginPasswordInfo extends VaultItemInfoBase {
  constructor() {
    super(...arguments);
    __publicField(this, "username");
    __publicField(this, "password");
    __publicField(this, "urls");
  }
}
__decorateClass([
  Column({ type: "VARCHAR" })
], LoginPasswordInfo.prototype, "username", 2);
__decorateClass([
  Column({ type: "VARCHAR" })
], LoginPasswordInfo.prototype, "password", 2);
__decorateClass([
  Column({ type: "VARCHAR[]" })
], LoginPasswordInfo.prototype, "urls", 2);
class CardPasswordInfo extends VaultItemInfoBase {
  constructor() {
    super(...arguments);
    __publicField(this, "card_company");
    __publicField(this, "card_number");
    __publicField(this, "card_password");
  }
}
__decorateClass([
  Column({ type: "VARCHAR" })
], CardPasswordInfo.prototype, "card_company", 2);
__decorateClass([
  Column({ type: "VARCHAR" })
], CardPasswordInfo.prototype, "card_number", 2);
__decorateClass([
  Column({ type: "VARCHAR" })
], CardPasswordInfo.prototype, "card_password", 2);
class NoteTextPasswordInfo extends VaultItemInfoBase {
  constructor() {
    super(...arguments);
    __publicField(this, "note_text");
  }
}
__decorateClass([
  Column({ type: "VARCHAR" })
], NoteTextPasswordInfo.prototype, "note_text", 2);
function getVaultImportItems(type) {
  if (type == "edge" || type == "chrome") {
    return {
      name: { db_key: "name", csv_type: "string", db_type: "string" },
      url: { db_key: "info.urls", csv_type: "string", db_type: "array" },
      username: { db_key: "info.username", csv_type: "string", db_type: "string" },
      password: { db_key: "info.password", csv_type: "string", db_type: "string" },
      note: { db_key: "remarks", csv_type: "string", db_type: "string" }
    };
  }
  return {};
}
function Csv2TableCol(table_row, typeinfo, csv_value) {
  if (csv_value == null) return;
  const keys = typeinfo.db_key.split(".");
  let obj = table_row;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]]) obj[keys[i]] = {};
    obj = obj[keys[i]];
  }
  const key = keys[keys.length - 1];
  if (typeinfo.db_type == "array") {
    if (typeinfo.csv_type == "string") {
      if (!obj[key]) obj[key] = [];
      obj[key].push(csv_value);
    } else {
      obj[key] = csv_value.split("|");
    }
  } else {
    obj[key] = csv_value;
  }
}
function TableCol2Csv(obj, fieldinfo) {
  const keys = fieldinfo.db_key.split(".");
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]];
    if (obj == null) return null;
  }
  if (obj === null || obj === void 0) return "";
  if (fieldinfo.db_type == "array") return `${obj.join("|")}`;
  if (fieldinfo.db_type == "string") return `${obj}`;
  return obj.toString();
}
function GetExportFieldList() {
  const fieldlist = [];
  const vault_entity = new VaultItem();
  const vault_login_entity = new LoginPasswordInfo();
  const vault_card_entity = new CardPasswordInfo();
  const vault_note_entity = new NoteTextPasswordInfo();
  const AddFiled = (entity_key, obj, db_key) => {
    const col_type = Reflect.getMetadata(Column_Type_KEY, obj, entity_key);
    const category = getColumTypeCategory(col_type);
    fieldlist.push({ db_key, csv_type: "string", db_type: category });
  };
  Object.keys(vault_entity).forEach((key) => {
    if (key == "info") {
      Object.keys(new LoginPasswordInfo()).forEach((subkey) => {
        AddFiled(subkey, vault_login_entity, `info.${subkey}`);
      });
      Object.keys(new NoteTextPasswordInfo()).forEach((subkey) => {
        AddFiled(subkey, vault_note_entity, `info.${subkey}`);
      });
      Object.keys(new CardPasswordInfo()).forEach((subkey) => {
        AddFiled(subkey, vault_card_entity, `info.${subkey}`);
      });
    } else {
      AddFiled(key, vault_entity, key);
    }
  });
  return fieldlist;
}
class VaultItemService extends BaseService {
  constructor() {
    super(new VaultItem());
  }
  fixEntityIn(info) {
    if (info.info) {
      info.info = JSON.stringify(info.info);
    }
  }
  fixEntityOut(info) {
    info.info = JSON.parse(info.info || "{}");
  }
  AfterChange() {
    AppEvent.emit(AppEventType.VaultItemChange);
    AppEvent.emit(AppEventType.DataChange, EntityType.vault_item);
  }
}
const en_us = {};
const password_name_login = "登陆信息";
const password_name_card = "银行卡信息";
const password_name_note = "笔记信息";
const icon$1 = "图标";
const name = "名字";
const remarks = "备注";
const ok = "确定";
const edit = "编辑";
const copy = "复制";
const save = "保存";
const cancel = "取消";
const use = "使用";
const refresh = "刷新";
const app_exit = "程序退出";
const recover = "恢复";
const recover_default = "恢复默认";
const save_success = "修改成功";
const copy_success = "复制成功";
const copy_success_arg = "{0}复制成功";
const zh_cn = {
  "app.name": "PassLock",
  "menu.help": "帮助",
  password_name_login,
  password_name_card,
  password_name_note,
  "vaultadd.remarks": "备注",
  "inputarr.addmore": "添加更多",
  "valut.search.placeholder": "搜索全部密码",
  "vault.empty_add": "添加一个新的密码",
  "vault.global_search": '在"{0}"中全局搜索',
  "vault.sure_delete": '确定删除"{0}"吗?',
  "vault.delete_title": "删除密码",
  "vault.sure_edit": '确定修改"{0}"吗?',
  "vault.edit_title": "修改密码",
  "vault.sider.total": "总数:{0}",
  "vaultitem.placeholder.password": "请输入密码",
  "vaultitem.placeholder.username": "请输入用户名",
  "vaultitem.placeholder.remarks": "请输入备注",
  "vaultitem.placeholder.url": "请输入网址",
  "vaultitem.placeholder.urls": "请输入网址",
  "vaultitem.placeholder.bank": "请输入银行名",
  "vaultitem.placeholder.card_number": "请输入卡号",
  "vaultitem.placeholder.note_text": "请输入文本",
  "vaultitem.placeholder.shortcut": "请输入快捷键",
  "vaultitem.placeholder.card_password": "请输入密码",
  "vaultitem.placeholder.card_company": "请输入银行名",
  "vaultitem.createrandom": "生成随机密码",
  "vaultitem.label.username": "用户名",
  "vaultitem.label.password": "密码",
  "vaultitem.label.card_password": "密码",
  "vaultitem.label.remarks": "备注",
  "vaultitem.label.url": "网址",
  "vaultitem.label.bank": "银行",
  "vaultitem.label.card_company": "银行",
  "vaultitem.label.card_number": "卡号",
  "vaultitem.label.note": "笔记",
  "vaultitem.label.note_text": "笔记",
  "quicksearch.input.placeholder": "搜索",
  "quicksearch.copy": "复制:{0}",
  "quicksearch.rightclick": "查看详情",
  "quicksearch.leftclick": "返回",
  "set.menu.normal": "常规",
  "set.menu.shortcut_local": "软件内快捷键",
  "set.menu.shortcut_global": "全局快捷键",
  "set.menu.global_shortcut": "全局快捷键",
  "set.menu.local_shortcut": "软件快捷键",
  "set.menu.normal_autolock_time": "自动锁定需要等待系统闲置时间",
  "set.menu.normal_lock_with_pc": "随电脑锁定",
  "set.menu.shortcut_global_quick_find": "全局快速查找",
  "set.menu.shortcut_global_quick_lock": "全局快速锁定",
  "set.menu.shortcut_global_open_main": "全局打开主界面",
  "set.menu.shortcut_local_find": "快速锁定",
  "set.menu.shortcut_local_view_shortcut": "打开快捷列表页面",
  "set.key_conflict": "快捷键冲突:{0}",
  "set.placeholder.shortcut": "请输入快捷键",
  "myencode.passworderror": "账号或密码错误",
  "auth.register.userexist": "用户名重复",
  "auth.login.notfound": "用户不存在",
  "auth.login.passworderr": "密码错误",
  "auth.login.success": "登陆成功",
  "auth.login.needinit": "需要初始化系统",
  "auth.login.fail": "登陆失败: {0}",
  "auth.login.title": "登陆",
  "auth.login.password_not_match": "密码不匹配",
  "auth.login.gotoRegister": "没有账号，去注册",
  "auth.login.account": "账号名",
  "auth.login.main_password": "主密码",
  "auth.login.main_password_repeat": "再次输入主密码",
  "auth.login.placeholder.account": "请输入账号名",
  "auth.login.placeholder.main_password": "请输入主密码",
  "auth.login.placeholder.main_password_repeat": "请输入主密码",
  "auth.lock.title": "解锁",
  "register.title": "初始化你的账号",
  "register.success": "注册成功",
  "register.fail": "注册失败: {0}",
  "register.userexist": "用户名已存在",
  "register.skiptoLogin": "已有账号，去登陆",
  "addvault.input.icon": "选择图标",
  "addvault.input.name": "保险库名字必须",
  "err.1": "密钥不存在",
  "err.2": "版本不匹配",
  "err.3": "密码错误",
  "err.4": "用户不存在",
  "err.5": "用户已存在",
  "err.6": "表单错误",
  "err.7": "数据不存在",
  "err.8": "数据修改失败",
  "err.205": "其他异常",
  "err.206": "数据库异常",
  "err.207": "未知错误",
  "time.second": "{0}秒",
  "time.minute": "{0}分钟",
  "time.hour": "{0}小时",
  "time.day": "{0}天",
  "time.week": "{0}周",
  "time.never": "从不",
  "input.rule.username": "用户名不能为空",
  "input.rule.password": "密码不能为空",
  "input.rule.remarks": "备注不能为空",
  "input.rule.card_number": "卡号不能为空",
  "input.rule.bank": "银行名不能为空",
  "passwordType.random": "随机密码",
  "passwordType.pin": "pin码",
  "passwordType.memory": "易记忆密码",
  icon: icon$1,
  name,
  remarks,
  "passwordSeparator.underline": "下划线",
  "passwordSeparator.hyphen": "连字符",
  "passwordSeparator.dot": "点",
  "passwordSeparator.comma": "逗号",
  "passwordGenPanel.random_characters_len": "随机密码长度",
  "passwordGenPanel.random_number": "需要包含数字",
  "passwordGenPanel.random_symbol": "需要包含符号",
  "passwordGenPanel.random_capitalize": "需要包含大写字母",
  "passwordGenPanel.memory_words_num": "单词个数",
  "passwordGenPanel.memory_separator": "单词连接符",
  "passwordGenPanel.memory_capitalize": "需要包含大写字母",
  "passwordGenPanel.memory_word_full": "完整单词",
  "passwordGenPanel.pin_code_num": "pin码长度",
  "passwordGenPanel.password_type": "密码类型",
  "menu.password_gen": "密码生成器",
  "menu.backup_local": "本地备份",
  "menu.backup_drive": "云备份",
  "menu.backup_drive_alidrive": "阿里云盘",
  "menu.backup_drive_alidrive_do": "备份到阿里云盘",
  "menu.backup_drive_alidrive_recover": "从阿里云盘还原",
  "menu.systembackup": "系统备份",
  "menu.systemRecover": "系统还原",
  "menu.backup.ok.title": "备份成功",
  "menu.backup.ok.content": "文件地址:{0}",
  "menu.recover.sure.title": "注意",
  "menu.recover.sure.content": "还原系统会清空当前数据，确定还原吗?",
  "menu.recover.sure.content_alidrive": "使用{0}还原会清空当前数据，确定还原吗?",
  "menu.recover.ok.title": "还原成功",
  "menu.recover.ok.content": "系统已还原,需要重启软件",
  "tray.menu.openlockpass": "打开lockpass",
  "tray.menu.openquick": "打开快速访问",
  "tray.menu.lock": "锁定",
  "tray.menu.quit": "退出",
  "quicksearch.autoinput": "自动输入",
  "quicksearch.viewDetail": "查看详情",
  "quicksearch.gotoView": "前往查看",
  "backupfilelistselect.title": "选择要还原的备份文件(只显示最近的10个)",
  ok,
  edit,
  "delete": "删除",
  copy,
  save,
  cancel,
  use,
  refresh,
  app_exit,
  recover,
  recover_default,
  save_success,
  copy_success,
  copy_success_arg,
  "main.backup.zipfilenotfound": "备份文件不存在:{0}",
  "main.backup.error": "系统错误",
  "main.backup.filenotselect": "请选择备份文件",
  "mydropmenu.aliyunneedauth": "阿里云盘需要授权",
  "mydropmenu.aliyunauthok": "阿里云授权成功,请重新操作",
  "mydropmenu.change_account": "切换账号",
  "mydropmenu.importcsv": "导入csv",
  "mydropmenu.exportcsv": "导出csv",
  "mydropmenu.importcsv.title": "导入csv成功",
  "mydropmenu.importcsv.content": "导入内容在新的保险库:{0}中",
  "mydropmenu.exportcsv.title": "导出csv成功",
  "mydropmenu.exportcsv.content": "文件路径:{0}",
  "filelistselect.name": "文件名",
  "filelistselect.size": "大小",
  "filelistselect.updatetime": "修改时间",
  "importcsvtype.title": "选择导入类型",
  "importcsvtype.edge": "edge浏览器",
  "importcsvtype.chrome": "chrome浏览器",
  "importcsvtype.opencsvtitle": "请选择从{0}导出的csv文件",
  "importcsvtype.error": "导入失败",
  "alidrive.uploaderror": "上传失败",
  "alidrive.filenotexit": "云盘中不存在文件:{0}",
  "addvaultpanel.del.title": "删除保险库",
  "addvaultpanel.del.content": "会同时删除保险库中的所有项目\n确定删除保险库:{0}吗?",
  "menu.vault": "保险库",
  "menu.setting": "设置",
  "menu.about": "关于",
  "404.title": "404",
  "404.desc": "页面不存在",
  "404.back": "返回首页"
};
class LangItem {
  constructor(name2, locale, lang_dic) {
    __publicField(this, "name");
    __publicField(this, "locale");
    __publicField(this, "lang_dic");
    this.name = name2;
    this.locale = locale;
    this.lang_dic = lang_dic;
  }
  getText(msg, ...args) {
    const res = this.lang_dic[msg];
    if (res == null) {
      console.error(`can't find lang text:${msg}`);
    }
    if (args.length > 0) {
      return res.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != "undefined" ? args[number] : match;
      });
    }
    return res;
  }
}
const Langs = [
  new LangItem("简体中文", "zh-cn", zh_cn),
  new LangItem("English", "en-us", en_us)
];
class LangHelper {
  static setLang(locale) {
    this._lang = Langs.find((item) => item.locale == locale);
  }
  static getString(msg, ...args) {
    var _a;
    return (_a = this._lang) == null ? void 0 : _a.getText(msg, ...args);
  }
  static get lang() {
    return this._lang;
  }
}
__publicField(LangHelper, "_lang");
const icon = "data:image/png;base64,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";
var webToManMsg = /* @__PURE__ */ ((webToManMsg2) => {
  webToManMsg2["SetLang"] = "setLang";
  webToManMsg2["GetLang"] = "getLang";
  webToManMsg2["Login"] = "Login";
  webToManMsg2["getCurUserInfo"] = "getCurUserInfo";
  webToManMsg2["isLogin"] = "isLogin";
  webToManMsg2["Register"] = "Register";
  webToManMsg2["Logout"] = "Logout";
  webToManMsg2["getAllUser"] = "getAllUser";
  webToManMsg2["GetLastUserInfo"] = "getLastUser";
  webToManMsg2["UpdateUser"] = "UpdateUser";
  webToManMsg2["GetAllValuts"] = "GetAllValuts";
  webToManMsg2["UpdateValut"] = "UpdateValut";
  webToManMsg2["DeleteValut"] = "DeleteValut";
  webToManMsg2["AddValut"] = "AddValut";
  webToManMsg2["GetAllValutItems"] = "GetAllValutItems";
  webToManMsg2["updateValutItem"] = "updateValutItem";
  webToManMsg2["DeleteValutItem"] = "DeleteValutItem";
  webToManMsg2["AddValutItem"] = "AddValutItem";
  webToManMsg2["ResizeWindow"] = "ResizeWindow";
  webToManMsg2["isLock"] = "isLock";
  webToManMsg2["LockApp"] = "LockApp";
  webToManMsg2["UnLockApp"] = "UnLockApp";
  webToManMsg2["IsSystemInit"] = "IsSystemInit";
  webToManMsg2["AutoFill"] = "AutoFill";
  webToManMsg2["ShortCutKeyChange"] = "ShortCutKeyChange";
  webToManMsg2["CheckShortKey"] = "CheckShortKey";
  webToManMsg2["getMousePos"] = "getMousePos";
  webToManMsg2["showWindows"] = "showWindows";
  webToManMsg2["ShowVaultItem"] = "ShowItem";
  webToManMsg2["UpdateTrayMenu"] = "UpdateTrayMenu";
  webToManMsg2["Backup_local"] = "BackupFromLocal";
  webToManMsg2["Recover_local"] = "RestoreFromLocal";
  webToManMsg2["Backup_alidrive"] = "BackupFromAliDrive";
  webToManMsg2["Recover_alidrive"] = "RestoreFromAliDrive";
  webToManMsg2["GetAllBackups_alidrive"] = "GetAllBackupsFromAliDrive";
  webToManMsg2["QuitAPP"] = "QuitAPP";
  webToManMsg2["ImportCSV"] = "ImportCSV";
  webToManMsg2["ExputCSV"] = "ExputCSV";
  webToManMsg2["RestartApp"] = "RestartApp";
  webToManMsg2["CloseDb"] = "CloseDb";
  webToManMsg2["OpenDb"] = "OpenDb";
  return webToManMsg2;
})(webToManMsg || {});
var MainToWebMsg = /* @__PURE__ */ ((MainToWebMsg2) => {
  MainToWebMsg2["ShowMsg"] = "ShowMsg";
  MainToWebMsg2["ShowMsgMain"] = "ShowMsgMain";
  MainToWebMsg2["LockApp"] = "lockApp";
  MainToWebMsg2["LoginOK"] = "LoginOk";
  MainToWebMsg2["LoginOut"] = "LoginOut";
  MainToWebMsg2["UserChange"] = "userchange";
  MainToWebMsg2["VaultChange"] = "vaultchange";
  MainToWebMsg2["vaultItemChange"] = "vaultItemChange";
  MainToWebMsg2["DataChange"] = "DataChange";
  MainToWebMsg2["ShowVaulteItem"] = "ShowVaulteItem";
  MainToWebMsg2["AliyunAuthOk"] = "AliyunAuthOk";
  return MainToWebMsg2;
})(MainToWebMsg || {});
class WindowBase {
  constructor() {
    __publicField(this, "witdth", 900);
    __publicField(this, "height", 670);
    __publicField(this, "click_outsize_close", false);
    __publicField(this, "url", "index.html");
    __publicField(this, "resizeable", true);
    __publicField(this, "closeable", true);
    __publicField(this, "haveFrame", true);
    //是否无边框
    __publicField(this, "ontop", false);
    __publicField(this, "wintype", "normal");
    __publicField(this, "window", null);
    AppEvent.on(AppEventType.windowBlur, (windows) => {
      this.CheckBlurClick(windows);
    });
    AppEvent.on(AppEventType.LockApp, () => {
      this.lockapp();
      this.win.webContents.send(MainToWebMsg.LockApp);
    });
    AppEvent.on(AppEventType.LoginOk, () => {
      this.win.webContents.send(MainToWebMsg.LoginOK);
    });
    AppEvent.on(AppEventType.Message, (msagetype, msg, duration) => {
      this.win.webContents.send(MainToWebMsg.ShowMsg, msagetype, msg, duration);
    });
    AppEvent.on(AppEventType.VaultChange, () => {
      this.win.webContents.send(MainToWebMsg.VaultChange);
    });
    AppEvent.on(AppEventType.UserChange, () => {
      this.win.webContents.send(MainToWebMsg.UserChange);
    });
    AppEvent.on(AppEventType.VaultItemChange, () => {
      this.win.webContents.send(MainToWebMsg.vaultItemChange);
    });
    AppEvent.on(AppEventType.DataChange, (type) => {
      this.win.webContents.send(MainToWebMsg.DataChange, type);
    });
    AppEvent.on(AppEventType.APPQuit, () => {
      this.close();
    });
    AppEvent.on(AppEventType.LoginOut, () => {
      this.lockapp();
      this.win.webContents.send(MainToWebMsg.LoginOut);
    });
  }
  get content() {
    return this.window.webContents;
  }
  get win() {
    return this.window;
  }
  get isvisible() {
    return this.window.isVisible();
  }
  lockapp() {
    return;
  }
  initWin() {
    this.window = new electron.BrowserWindow({
      width: this.witdth,
      height: this.height,
      alwaysOnTop: this.ontop,
      type: this.wintype,
      show: false,
      icon,
      resizable: this.resizeable,
      closable: this.closeable,
      frame: this.haveFrame,
      autoHideMenuBar: true,
      ...process.platform === "linux" ? { icon } : {},
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: false
      }
    });
    if (utils.is.dev) this.window.webContents.openDevTools({ mode: "detach" });
    if (utils.is.dev && "http://localhost:5174") {
      this.win.loadURL(`${"http://localhost:5174"}/${this.url}`);
    } else {
      this.win.loadFile(path.join(__dirname, `../render/${this.url}`));
    }
    this.window.on("close", (event) => {
      event.preventDefault();
      this.hide();
    });
  }
  show() {
    Log.Info("show window", this.url);
    AppModel$1.getInstance().setLastPoint(electron.screen.getCursorScreenPoint());
    this.win.show();
  }
  hide() {
    Log.Info("hide window", this.url);
    this.window.hide();
    this.window.setSkipTaskbar(true);
  }
  close() {
    Log.Info("close window", this.url);
    this.window.close();
  }
  showOrHide(show) {
    if (show) this.show();
    else this.hide();
  }
  setSize(width, height) {
    const oldsize = this.win.getSize();
    if (width <= 0) width = oldsize[0];
    if (height <= 0) height = oldsize[1];
    this.win.setMinimumSize(width, height);
    this.window.setSize(width, height, true);
  }
  CheckBlurClick(windows) {
    if (!this.click_outsize_close || this.window.isVisible() == false) return;
    if (this.window != windows) return;
    const { x, y } = electron.screen.getCursorScreenPoint();
    const rect = this.win.getBounds();
    if (x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height) {
      this.hide();
    }
  }
}
class MainWindow extends WindowBase {
  constructor() {
    super();
    this.url = "index.html";
    this.initWin();
    AppEvent.on(AppEventType.MainMessage, (msagetype, msg, duration) => {
      this.win.webContents.send(MainToWebMsg.ShowMsgMain, msagetype, msg, duration);
    });
  }
}
class QuickSearchWindow extends WindowBase {
  constructor() {
    super();
    this.url = "quick.html";
    this.haveFrame = false;
    this.wintype = "toolbar";
    this.resizeable = false;
    this.click_outsize_close = true;
    this.witdth = 600;
    this.height = 50;
    this.initWin();
  }
  lockapp() {
    this.hide();
  }
  show() {
    var _a;
    if (AppModel$1.getInstance().IsLock()) {
      (_a = AppModel$1.getInstance().mainwin) == null ? void 0 : _a.show();
      return;
    }
    super.show();
  }
}
class MyTray {
  constructor() {
    __publicField(this, "tray");
    this.tray = new electron.Tray(path.join(__dirname, "../../resources/icon.png"));
    this.tray.setToolTip("passlock");
    this.updateMenu(null);
    this.tray.on("double-click", () => {
      const mainwin = AppModel$1.getInstance().mainwin;
      if (mainwin.isvisible) {
        mainwin.hide();
      } else {
        mainwin.show();
      }
    });
    AppEvent.on(AppEventType.APPQuit, () => {
      this.tray.destroy();
    });
  }
  getLabelStr(key, tryinfo) {
    if (tryinfo == null) return LangHelper.getString(`tray.menu.${key}`);
    return tryinfo[key] || LangHelper.getString(`tray.menu.${key}`);
  }
  updateMenu(tryinfo) {
    const contextmenu = electron.Menu.buildFromTemplate([
      {
        label: this.getLabelStr("openlockpass", tryinfo),
        click: () => {
          AppModel$1.getInstance().mainwin.show();
        }
      },
      {
        label: this.getLabelStr("openquick", tryinfo),
        click: () => {
          AppModel$1.getInstance().quickwin.show();
        }
      },
      {
        type: "separator"
      },
      {
        label: this.getLabelStr("lock", tryinfo),
        click: () => {
          AppModel$1.getInstance().LockApp();
        }
      },
      {
        label: this.getLabelStr(LangHelper.getString("tray.menu.quit"), null),
        click: () => {
          electron.app.quit();
        }
      }
    ]);
    this.tray.setContextMenu(contextmenu);
  }
}
function initAllApi() {
  electron.ipcMain.handle(webToManMsg.SetLang, (_, lang) => {
    AppModel$1.getInstance().changeLang(lang);
  });
  electron.ipcMain.handle(webToManMsg.GetLang, () => {
    return AppModel$1.getInstance().CurLang();
  });
  electron.ipcMain.handle(webToManMsg.isLock, () => {
    return AppModel$1.getInstance().IsLock();
  });
  electron.ipcMain.handle(webToManMsg.LockApp, () => {
    AppModel$1.getInstance().LockApp();
  });
  electron.ipcMain.handle(webToManMsg.IsSystemInit, () => {
    return AppModel$1.getInstance().IsSystemInit();
  });
  electron.ipcMain.handle(webToManMsg.ResizeWindow, (_, viewtype, width, height) => {
    var _a, _b;
    if (viewtype == renderViewType.Mainview) (_a = AppModel$1.getInstance().mainwin) == null ? void 0 : _a.setSize(width, height);
    else if (viewtype == renderViewType.Quickview)
      (_b = AppModel$1.getInstance().quickwin) == null ? void 0 : _b.setSize(width, height);
  });
  electron.ipcMain.handle(webToManMsg.UpdateTrayMenu, (_, setinfo) => {
    var _a;
    (_a = AppModel$1.getInstance().my_tray) == null ? void 0 : _a.updateMenu(setinfo);
  });
  electron.ipcMain.handle(webToManMsg.showWindows, (_, viewtype, showorHide) => {
    var _a, _b;
    if (viewtype == renderViewType.Mainview) (_a = AppModel$1.getInstance().mainwin) == null ? void 0 : _a.showOrHide(showorHide);
    else if (viewtype == renderViewType.Quickview)
      (_b = AppModel$1.getInstance().quickwin) == null ? void 0 : _b.showOrHide(showorHide);
  });
  electron.ipcMain.handle(webToManMsg.Backup_alidrive, () => {
    return AppModel$1.getInstance().BackupByAliyun();
  });
  electron.ipcMain.handle(webToManMsg.Recover_alidrive, (_, filename) => {
    return AppModel$1.getInstance().RecoverByAliyun(filename);
  });
  electron.ipcMain.handle(webToManMsg.GetAllBackups_alidrive, async () => {
    return await AppModel$1.getInstance().GetAliyunBackupList();
  });
  electron.ipcMain.handle(webToManMsg.ImportCSV, (_, type) => {
    return AppModel$1.getInstance().ImportCsv(type);
  });
  electron.ipcMain.handle(webToManMsg.ExputCSV, () => {
    return AppModel$1.getInstance().ExportCsv();
  });
  electron.ipcMain.handle(webToManMsg.ShowVaultItem, (_, vault_id, vault_item_id) => {
    const mainwin = AppModel$1.getInstance().mainwin;
    if (mainwin) {
      mainwin.show();
      mainwin.content.send(MainToWebMsg.ShowVaulteItem, vault_id, vault_item_id);
    }
  });
  electron.ipcMain.handle(webToManMsg.AutoFill, (_, info) => {
    return AppModel$1.getInstance().AutoFill(info);
  });
  electron.ipcMain.handle(webToManMsg.getMousePos, () => {
    return AppModel$1.getInstance().getScreenPoint();
  });
  electron.ipcMain.handle(webToManMsg.ShortCutKeyChange, () => {
    AppModel$1.getInstance().initGlobalShortcut();
  });
  electron.ipcMain.handle(webToManMsg.CheckShortKey, (_, key) => {
    return AppModel$1.getInstance().IsKeyRegisted(key);
  });
  electron.ipcMain.handle(webToManMsg.Backup_local, async () => {
    return await AppModel$1.getInstance().BackupSystem();
  });
  electron.ipcMain.handle(webToManMsg.Recover_local, async () => {
    return await AppModel$1.getInstance().RecoverSystemFromBackup();
  });
  electron.ipcMain.handle(webToManMsg.QuitAPP, () => {
    AppModel$1.getInstance().Quit();
  });
  electron.ipcMain.handle(webToManMsg.RestartApp, () => {
    electron.app.relaunch();
  });
  electron.ipcMain.handle(webToManMsg.CloseDb, async () => {
    return await AppModel$1.getInstance().db_helper.CloseDB();
  });
  electron.ipcMain.handle(webToManMsg.OpenDb, async () => {
    return await AppModel$1.getInstance().db_helper.OpenDb();
  });
  electron.ipcMain.handle(webToManMsg.getCurUserInfo, () => {
    return AppModel$1.getInstance().curUserInfo();
  });
  electron.ipcMain.handle(webToManMsg.isLogin, () => {
    return AppModel$1.getInstance().IsLogin();
  });
  electron.ipcMain.handle(webToManMsg.Login, async (_, info) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().user) == null ? void 0 : _a.Login(info));
  });
  electron.ipcMain.handle(webToManMsg.Register, async (_, info) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().user) == null ? void 0 : _a.Register(info));
  });
  electron.ipcMain.handle(webToManMsg.Logout, async () => {
    var _a;
    return await ((_a = AppModel$1.getInstance().user) == null ? void 0 : _a.Logout());
  });
  electron.ipcMain.handle(webToManMsg.getAllUser, async () => {
    var _a;
    return await ((_a = AppModel$1.getInstance().user) == null ? void 0 : _a.GetAll());
  });
  electron.ipcMain.handle(webToManMsg.GetLastUserInfo, async () => {
    var _a;
    return await ((_a = AppModel$1.getInstance().user) == null ? void 0 : _a.GetLastUserInfo());
  });
  electron.ipcMain.handle(webToManMsg.UpdateUser, async (_, user) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().user) == null ? void 0 : _a.UpdateOne2(user, true));
  });
  electron.ipcMain.handle(webToManMsg.GetAllValuts, async (_, cond) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vault) == null ? void 0 : _a.GetManyApi(cond));
  });
  electron.ipcMain.handle(webToManMsg.GetAllValutItems, async (_, cond) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vaultItem) == null ? void 0 : _a.GetManyApi(cond));
  });
  electron.ipcMain.handle(webToManMsg.AddValut, async (_, valut) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vault) == null ? void 0 : _a.AddOneApi(valut));
  });
  electron.ipcMain.handle(webToManMsg.AddValutItem, async (_, valutItem) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vaultItem) == null ? void 0 : _a.AddOneApi(valutItem));
  });
  electron.ipcMain.handle(webToManMsg.DeleteValut, async (_, vault_id) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vault) == null ? void 0 : _a.DeleteByIdApi(vault_id));
  });
  electron.ipcMain.handle(webToManMsg.DeleteValutItem, async (_, vault_item_id) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vaultItem) == null ? void 0 : _a.DeleteByIdApi(vault_item_id));
  });
  electron.ipcMain.handle(webToManMsg.UpdateValut, async (_, new_valut) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vault) == null ? void 0 : _a.UpdateOne(new_valut));
  });
  electron.ipcMain.handle(webToManMsg.updateValutItem, async (_, valutItem) => {
    var _a;
    return await ((_a = AppModel$1.getInstance().vaultItem) == null ? void 0 : _a.UpdateOne(valutItem));
  });
}
class BaseDb {
  // Add a comment to explain the purpose of the empty constructor
  constructor() {
    __publicField(this, "show_log", false);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(_) {
    return Promise.resolve();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async all(_) {
    return Promise.resolve([]);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  each(_) {
    return Promise.resolve();
  }
  encode_table_str(obj, key, value) {
    if (value == void 0 || value == null || value == "") return value;
    const col_type = Reflect.getMetadata(Column_Type_KEY, obj, key);
    const category = getColumTypeCategory(col_type);
    const encode_type = Reflect.getMetadata(COlumn_Encode_key, obj, key);
    if (encode_type) {
      if (category !== "number") {
        return AppModel$1.getInstance().myencode.Encode(value.toString());
      }
    }
    return value;
  }
  decode_table_str(obj, key, value) {
    if (value == void 0 || value == null || value == "") return value;
    const col_type = Reflect.getMetadata(Column_Type_KEY, obj, key);
    const category = getColumTypeCategory(col_type);
    const encode_type = Reflect.getMetadata(COlumn_Encode_key, obj, key);
    if (encode_type) {
      if (category !== "number") {
        return AppModel$1.getInstance().myencode.Decode(value.toString());
      }
    }
    return value;
  }
  getColumnValue(obj, key, value) {
    const col_type = Reflect.getMetadata(Column_Type_KEY, obj, key);
    const category = getColumTypeCategory(col_type);
    const isprimary = Reflect.getMetadata("primary", obj, key);
    const default_value = Reflect.getMetadata("default", obj, key);
    if (col_type) {
      if (value === void 0 || value === null) {
        if (default_value != void 0 || default_value != null || isprimary) return void 0;
        else return `''`;
      } else if (category == "number") {
        return `${value.toString()}`;
      } else {
        const res = value.toString();
        return `'${res}'`;
      }
    }
    return null;
  }
  getAddOneSql(obj, keys) {
    let sql_str = "";
    const key_arr = [];
    const value_arr = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let element = obj[key];
      element = this.encode_table_str(obj, key, element);
      const col_value = this.getColumnValue(obj, key, element);
      if (col_value !== null && col_value !== void 0) {
        key_arr.push(key);
        value_arr.push(col_value);
      }
    }
    sql_str += ` (${key_arr.join(",")}) values (${value_arr.join(",")}) `;
    return sql_str;
  }
  getupdateOneSql(entity, obj_old, obj, keys) {
    const changelist = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let element = obj[key];
      const old_value = obj_old[key];
      if (element == void 0 || element == null) continue;
      element = this.encode_table_str(entity, key, element);
      if (old_value == element) continue;
      const col_value = this.getColumnValue(entity, key, element);
      if (col_value) {
        changelist.push(`${key}=${col_value}`);
      }
    }
    return changelist.join(",");
  }
  async _exesql(sql_str) {
    if (this.show_log) Log.Info("exesql:", sql_str);
    await this.run(sql_str);
  }
  async _runSql(sql_str) {
    if (this.show_log) Log.Info("runsql:", sql_str);
    await this.run(sql_str);
  }
  _runSqlWithResult(obj, sql_str) {
    return this._runSqlWithResult2(obj.constructor, obj, sql_str);
  }
  async _runSqlWithResult2(obj_type, obj, sql_str) {
    const keys = Reflect.ownKeys(obj);
    if (this.show_log) Log.Info("runsql:", sql_str);
    const rows = await this.all(sql_str);
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      const item = new obj_type();
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const col_name = Reflect.getMetadata(Column_Name_KEY, obj, key);
        if (col_name) {
          const col_value = rows[i][col_name];
          if (col_value == void 0 || col_value == null) continue;
          item[key] = this.decode_table_str(obj, key, col_value);
        }
      }
      res.push(item);
    }
    return res;
  }
  async DelMany(obj, where) {
    const table_name = obj[Table_Name_KEY];
    let sql_str = `delete from ${table_name} where `;
    sql_str += this.getWhreSql(obj, where);
    return await this._runSql(sql_str);
  }
  async UpdateOne(entity, obj_old, obj) {
    const table_name = entity[Table_Name_KEY];
    if (!obj.id) {
      Log.Error("update entity id is null");
      return Promise.reject(new Error("update entity id is null"));
    }
    let sql_str = "update " + table_name + " set ";
    const keys = Reflect.ownKeys(entity);
    keys.splice(keys.indexOf("id"), 1);
    const update_sql = this.getupdateOneSql(entity, obj_old, obj, keys);
    if (update_sql.trim().length == 0) {
      Log.Info("no update value");
      return;
    }
    sql_str += update_sql;
    sql_str += ` where id=${obj.id}`;
    return await this._exesql(sql_str);
  }
  async AddList(objs) {
    if (objs.length == 0) return;
    const obj = objs[0];
    const table_name = obj[Table_Name_KEY];
    let sql_str = "BEGIN TRANSACTION;\n";
    sql_str += "Insert into " + table_name;
    const keys = Reflect.ownKeys(obj);
    for (let i = 0; i < objs.length; i++) {
      const obj2 = objs[i];
      sql_str += this.getAddOneSql(obj2, keys);
      if (i < objs.length - 1) {
        sql_str += ",\n";
      }
    }
    sql_str += ";\n";
    sql_str += "COMMIT;";
    return await this._runSql(sql_str);
  }
  async beginTransaction() {
    await this._runSql("BEGIN TRANSACTION;");
  }
  async commitTransaction() {
    await this._runSql("COMMIT;");
  }
  async rollbackTransaction() {
    await this._runSql("ROLLBACK;");
  }
  async abortTransaction() {
    await this._runSql("ABORT;");
  }
  AddOne(obj) {
    const table_name = obj[Table_Name_KEY];
    let sql_str = "";
    sql_str += "Insert into " + table_name;
    const keys = Reflect.ownKeys(obj);
    sql_str += this.getAddOneSql(obj, keys);
    sql_str += ";";
    return this._runSql(sql_str);
  }
  getWhreSql(obj, where) {
    const serach_arr = [];
    Object.keys(where.cond).every((key) => {
      let search_val = where.cond[key];
      if (search_val == void 0 || search_val == null)
        throw new Error(`search value is null key:${key}`);
      search_val = this.encode_table_str(obj, key, search_val);
      const col_value = this.getColumnValue(obj, key, search_val);
      if (col_value) {
        serach_arr.push(` ${key}=${col_value}`);
      }
      return true;
    });
    return serach_arr.join(where.andor || " AND ");
  }
  GetOne(obj, where) {
    const table_name = obj[Table_Name_KEY];
    let sql_str = `select * from ${table_name} where `;
    sql_str += this.getWhreSql(obj, where);
    sql_str += " limit 1";
    return this._runSqlWithResult(obj, sql_str);
  }
  GetAll(obj, where) {
    const table_name = obj[Table_Name_KEY];
    let sql_str = `select * from ${table_name}  `;
    if (where) {
      sql_str = `${sql_str} where ${this.getWhreSql(obj, where)}`;
    }
    return this._runSqlWithResult(obj, sql_str);
  }
  async GetTotalCount(obj, where) {
    const table_name = obj[Table_Name_KEY];
    const keystr = "count(*)";
    let sql_str = `select ${keystr} from ${table_name} where `;
    sql_str += this.getWhreSql(obj, where);
    if (this.show_log) Log.Info("runsql:", sql_str);
    const res = await this.all(sql_str);
    return res[0][keystr];
  }
  async SearchAll(obj, where) {
    const total_num = await this.GetTotalCount(obj, where);
    if (total_num == 0) return [];
    const table_name = obj[Table_Name_KEY];
    let sql_str = `select count(*) from ${table_name} where `;
    sql_str += this.getWhreSql(obj, where);
    if (where.page_size && where.page) {
      const offset = where.page_size * (where.page - 1);
      sql_str += ` limit ${where.page_size} offset ${offset}`;
    }
    return this._runSqlWithResult(obj, sql_str);
  }
  async initOneTable(obj) {
    const table_name = obj[Table_Name_KEY];
    Log.Info("init table:", table_name);
    let table_desc = `CREATE TABLE IF NOT EXISTS ${table_name} (
`;
    let index_desc = "";
    const keys = Reflect.ownKeys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const col_type = Reflect.getMetadata(Column_Type_KEY, obj, key);
      const col_name = Reflect.getMetadata(Column_Name_KEY, obj, key);
      const isprimary = Reflect.getMetadata("primary", obj, key);
      if (!col_type) continue;
      table_desc += `${col_name} ${col_type}`;
      if (isprimary) {
        table_desc += " PRIMARY KEY autoincrement";
      }
      const default_value = Reflect.getMetadata("default", obj, key);
      if (default_value != void 0 || default_value != null) {
        table_desc += ` DEFAULT '${default_value}' `;
      }
      if (Reflect.getMetadata("unique", obj, key)) {
        table_desc += " UNIQUE";
      }
      if (Reflect.getMetadata("notNull", obj, key)) {
        table_desc += " NOT NULL";
      }
      if (i < keys.length - 1) {
        table_desc += ",";
      }
      table_desc += "\n";
      const index_name = Reflect.getMetadata("index_name", obj, key);
      if (index_name) {
        const unique_index = Reflect.getMetadata("unique_index", obj, key);
        index_desc += `CREATE ${unique_index ? "UNIQUE" : ""} INDEX IF NOT EXISTS ${index_name} ON ${table_name} (${col_name});
`;
      }
    }
    table_desc += ");";
    const sql_str = table_desc + "\n" + index_desc;
    if (this.show_log) Log.Info("runsql:", sql_str);
    await this.run(sql_str);
  }
}
class SqliteHelper extends BaseDb {
  constructor() {
    super();
    __publicField(this, "_db", null);
  }
  async OpenDb() {
    const dbPath = this.getDbPath();
    return new Promise((resolve, reject) => {
      if (this._db) {
        resolve(this._db);
      }
      this._db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error("open db err", err.message);
          reject(err);
        } else {
          Log.Info("open db success");
          resolve(this._db);
        }
      });
    });
  }
  getDbPath() {
    return `${PathHelper.getHomeDir()}/lockpass.db`;
  }
  async CloseDB() {
    return new Promise((resolve, reject) => {
      if (this._db) {
        this._db.close((err) => {
          if (err) {
            console.error("close db err", err.message);
            reject(err);
          } else {
            Log.Info("close db success");
            this._db = null;
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    });
  }
  async run(sql) {
    return new Promise((resolve, reject) => {
      var _a;
      (_a = this._db) == null ? void 0 : _a.exec(sql, (err) => {
        if (err) {
          Log.Exception(err, `sql:${sql}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  async all(sql) {
    return new Promise((resolve, reject) => {
      var _a;
      (_a = this._db) == null ? void 0 : _a.all(sql, (err, rows) => {
        if (err) {
          Log.Exception(err, `sql:${sql}`);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  async each(sql) {
    return new Promise((resolve, reject) => {
      var _a;
      (_a = this._db) == null ? void 0 : _a.each(sql, (err, row) => {
        if (err) {
          Log.Exception(err, `sql:${sql}`);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}
class AppService extends BaseService {
  constructor() {
    super(new AppEntity());
  }
}
async function SendRequest(url, method, headers, data) {
  return new Promise((resolve, reject) => {
    const request = electron.net.request({
      method,
      url,
      headers
    });
    if (data) {
      if (data instanceof Buffer) request.write(data);
      else request.write(JSON.stringify(data));
    }
    request.on("response", (response) => {
      let data2 = "";
      response.on("data", (chunk) => {
        data2 += chunk.toString();
      });
      response.on("end", () => {
        const res = JSON.parse(data2);
        if (res.code) {
          Log.Error(`req ${url} error ${data2} `);
          reject(new Error(res.message));
          return;
        }
        resolve(res);
      });
    });
    request.on("error", (error) => {
      Log.Error(`req ${url} error `, error.message);
      reject(error);
    });
    request.end();
  });
}
async function downloadFileFromUrl(url, localPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(localPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          resolve();
        });
      });
    }).on("error", (err) => {
      fs.unlink(localPath, () => reject(err));
    });
  });
}
async function uploadFileToUrl(url, option, filer_buffer, pos, size) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, option, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk.toString();
      });
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          Log.Error(`upload part  error ${data}`);
          reject(new Error(`upload part error ${data}`));
        }
      });
    });
    req.on("error", (error) => {
      Log.Error(`upload  error `, error.message);
      reject(new Error(`upload error ${error.message}`));
    });
    req.write(Buffer.from(filer_buffer, pos, size), (error) => {
      if (error) {
        Log.Error(`read file error `, error.message);
        reject(new Error(`upload error  read file error:${error.message}`));
      }
    });
    req.end();
  });
}
function ShowMessageToMain(type, msg) {
  AppEvent.emit(AppEventType.MainMessage, type, msg);
}
function ShowErrToMain(msg) {
  ShowMessageToMain("error", msg);
}
function ShowInfoToMain(msg) {
  ShowMessageToMain("info", msg);
}
class AliDrive {
  constructor() {
    __publicField(this, "_host", "https://openapi.alipan.com");
    __publicField(this, "_clientid", "34cb815617784156a4504565d8c55bd0");
    __publicField(this, "_scope", "user:base,file:all:read,file:all:write");
    __publicField(this, "_callback_path", "auth");
    __publicField(this, "_sceret", "b4dda1481a4e45d28a8372df93a5f475");
    __publicField(this, "_redirect_url", SYS_PROTOL_URL);
    __publicField(this, "server", null);
    __publicField(this, "_authData", null);
    __publicField(this, "_parent_dir_name", "lockpass_backup");
    __publicField(this, "_partsize", 1024 * 1024 * 1024 * 4);
    AppEvent.on(AppEventType.DeepLink, async (url) => {
      console.log("url", url);
      const start_url = `${this.RedirectUrl}/?`;
      if (!url.startsWith(start_url)) return;
      const params = new URLSearchParams(url.replace(start_url, ""));
      const code = params.get("code");
      if (!code) return;
      console.log("code", code);
      await this.getTokenByCode(code);
    });
    this._authData = AppModel$1.getInstance().aliyunData;
  }
  get parent_dir_name() {
    return this._parent_dir_name;
  }
  get RedirectUrl() {
    return `${this._redirect_url}${this._callback_path}`;
  }
  async auth() {
    const redirect_url = encodeURIComponent(this.RedirectUrl);
    const url = `${this._host}/oauth/authorize?client_id=${this._clientid}&scope=${this._scope}&response_type=code&redirect_uri=${redirect_url}`;
    console.log("url", url);
    electron.shell.openExternal(url);
  }
  async getTokenByCode(code) {
    await this.getToken(code, null);
  }
  async getTokenByRefreshToken(refresh_token) {
    await this.getToken(null, refresh_token);
  }
  async getToken(code, refresh_token) {
    const url = new URL(`${this._host}/oauth/access_token`);
    const senddata = {
      client_id: this._clientid,
      client_secret: this._sceret
    };
    if (code) {
      senddata["code"] = code;
      senddata["grant_type"] = "authorization_code";
    }
    if (refresh_token) {
      senddata["refresh_token"] = refresh_token;
      senddata["grant_type"] = "refresh_token";
    }
    const res = await SendRequest(
      url.toString(),
      "POST",
      {
        "Content-Type": "application/json"
      },
      senddata
    );
    this._authData = res;
    this._authData.expires_in = Math.floor(Date.now() / 1e3) + this._authData.expires_in;
    this._authData.refresh_token_expire_time = Math.floor(Date.now() / 1e3) + 90 * 24 * 60 * 60;
    this._authData.drive_info = await this.getDriveInfo();
    AppModel$1.getInstance().setAliyunData(this._authData);
    Log.Info("get authData ok", JSON.stringify(this._authData));
    if (code) {
      ShowInfoToMain(LangHelper.getString("mydropmenu.aliyunauthok"));
    }
  }
  async needAuth() {
    const timenow = Math.floor(Date.now() / 1e3);
    if (!this._authData) return true;
    if (this._authData.expires_in > timenow) return false;
    if (this._authData.refresh_token_expire_time < timenow) return true;
    await this.getTokenByRefreshToken(this._authData.refresh_token);
    return false;
  }
  getHeaders() {
    return {
      Authorization: `${this._authData.token_type} ${this._authData.access_token}`,
      "Content-Type": "application/json"
    };
  }
  async getDriveInfo() {
    const url = `${this._host}/adrive/v1.0/user/getDriveInfo`;
    return await SendRequest(url, "POST", this.getHeaders(), null);
  }
  async createFolderInRoot(folder_name) {
    return await this.createFile2("root", folder_name, "folder");
  }
  async createFolder(parent_file_id, folder_name) {
    return await this.createFile2(parent_file_id, folder_name, "folder");
  }
  async createFile(parentfile_id, file_name) {
    return await this.createFile2(parentfile_id, file_name, "file");
  }
  async createFile2(parentfile_id, file_name, type) {
    const url = `${this._host}/adrive/v1.0/openFile/create`;
    const res = await SendRequest(url, "POST", this.getHeaders(), {
      drive_id: this._authData.drive_info.default_drive_id,
      parent_file_id: parentfile_id,
      name: file_name,
      type,
      check_name_mode: "refuse"
    });
    return res;
  }
  async UploadFile(file_name, local_path) {
    let res = await this.createFolderInRoot(this._parent_dir_name);
    res = await this.createFile(res.file_id, file_name);
    if (res.exist) {
      throw new Error("file exit");
    }
    const file = fs.readFileSync(local_path);
    for (let i = 0; i < res.part_info_list.length; i++) {
      const part = res.part_info_list[i];
      const number = part.part_number;
      const pos = this._partsize * (number - 1);
      const size = Math.min(file.length - pos, this._partsize);
      Log.Info(`upload part ${number} size ${size} pos ${pos} `);
      const res2 = await uploadFileToUrl(
        part.upload_url,
        {
          method: "PUT",
          headers: {
            "Content-Length": size,
            Authorization: `${this._authData.token_type} ${this._authData.access_token}`,
            "Transfer-Encoding": "chunked",
            connection: "keep-alive"
          }
        },
        file,
        pos,
        size
      );
      Log.Info(`upload part ${number} ok res:${res2}`);
    }
    const fileinfo = await SendRequest(
      `${this._host}/adrive/v1.0/openFile/complete`,
      "POST",
      this.getHeaders(),
      {
        drive_id: this._authData.drive_info.default_drive_id,
        file_id: res.file_id,
        upload_id: res.upload_id
      }
    );
    Log.Info("upload file ok", JSON.stringify(fileinfo));
  }
  async downloadFile(file_name, local_path) {
    const res1 = await this.createFolderInRoot(this._parent_dir_name);
    const res = await this.createFile(res1.file_id, file_name);
    if (!res.exist) {
      ShowErrToMain(LangHelper.getString("alidrive.filenotexit", file_name));
      throw new Error(`file not exit:${file_name}`);
    }
    const url = `${this._host}/adrive/v1.0/openFile/getDownloadUrl`;
    const downloadInfo = await SendRequest(url, "POST", this.getHeaders(), {
      drive_id: this._authData.drive_info.default_drive_id,
      file_id: res.file_id,
      expire_sec: 900
    });
    await downloadFileFromUrl(downloadInfo.url, local_path);
  }
  async getLatestFiliList(filetype, type) {
    const parent_info = await this.createFolderInRoot(this._parent_dir_name);
    const url = `${this._host}/adrive/v1.0/openFile/list`;
    const res = await SendRequest(url, "POST", this.getHeaders(), {
      drive_id: this._authData.drive_info.default_drive_id,
      parent_file_id: parent_info.file_id,
      file_cateGory: filetype,
      order_by: "created_at",
      limit: 10,
      order_direction: "DESC",
      type
    });
    return res.items;
  }
}
function GetImportVaultName(type) {
  return `import_${type}`;
}
function str2csv(str) {
  if (str.indexOf(",") !== -1) return `"${str.replace(/"/g, '""')}"`;
  return `${str.replace(/"/g, '""')}`;
}
const [cr] = Buffer.from("\r");
const [nl] = Buffer.from("\n");
const defaults = {
  escape: '"',
  headers: null,
  mapHeaders: ({ header }) => header,
  mapValues: ({ value }) => value,
  newline: "\n",
  quote: '"',
  raw: false,
  separator: ",",
  skipComments: false,
  skipLines: null,
  maxRowBytes: Number.MAX_SAFE_INTEGER,
  strict: false
};
class CsvParser extends stream.Transform {
  constructor(opts = {}) {
    super({ objectMode: true, highWaterMark: 16 });
    __publicField(this, "state");
    __publicField(this, "_prev");
    __publicField(this, "options");
    __publicField(this, "headers");
    const options = Object.assign({}, defaults, opts);
    options.customNewline = options.newline !== defaults.newline;
    for (const key of ["newline", "quote", "separator"]) {
      if (typeof options[key] !== "undefined") {
        [options[key]] = Buffer.from(options[key]);
      }
    }
    this.options.escape = (opts || {}).escape ? Buffer.from(options.escape)[0] : options.quote;
    this.state = {
      empty: options.raw ? Buffer.alloc(0) : "",
      escaped: false,
      first: true,
      lineNumber: 0,
      previousEnd: 0,
      rowLength: 0,
      quoted: false
    };
    this._prev = null;
    if (options.headers) {
      this.state.first = false;
    }
    this.options = options;
    this.headers = options.headers;
  }
  parseCell(buffer, start, end) {
    const { escape, quote } = this.options;
    if (buffer[start] === quote && buffer[end - 1] === quote) {
      start++;
      end--;
    }
    let y = start;
    for (let i = start; i < end; i++) {
      if (buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote) {
        i++;
      }
      if (y !== i) {
        buffer[y] = buffer[i];
      }
      y++;
    }
    return this.parseValue(buffer, start, y);
  }
  parseLine(buffer, start, end) {
    const {
      customNewline,
      escape,
      mapHeaders,
      mapValues,
      quote,
      separator,
      skipComments,
      skipLines
    } = this.options;
    end--;
    if (!customNewline && buffer.length && buffer[end - 1] === cr) {
      end--;
    }
    const comma = separator;
    const cells = [];
    let isQuoted = false;
    let offset = start;
    if (skipComments) {
      const char = typeof skipComments === "string" ? skipComments : "#";
      if (buffer[start] === Buffer.from(char)[0]) {
        return;
      }
    }
    const mapValue = (value) => {
      if (this.state.first) {
        return value;
      }
      const index = cells.length;
      const header = this.headers[index];
      return mapValues({ header, index, value });
    };
    for (let i = start; i < end; i++) {
      const isStartingQuote = !isQuoted && buffer[i] === quote;
      const isEndingQuote = isQuoted && buffer[i] === quote && i + 1 <= end && buffer[i + 1] === comma;
      const isEscape = isQuoted && buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote;
      if (isStartingQuote || isEndingQuote) {
        isQuoted = !isQuoted;
        continue;
      } else if (isEscape) {
        i++;
        continue;
      }
      if (buffer[i] === comma && !isQuoted) {
        let value = this.parseCell(buffer, offset, i);
        value = mapValue(value);
        cells.push(value);
        offset = i + 1;
      }
    }
    if (offset < end) {
      let value = this.parseCell(buffer, offset, end);
      value = mapValue(value);
      cells.push(value);
    }
    if (buffer[end - 1] === comma) {
      cells.push(mapValue(this.state.empty));
    }
    const skip = skipLines && skipLines > this.state.lineNumber;
    this.state.lineNumber++;
    if (this.state.first && !skip) {
      this.state.first = false;
      this.headers = cells.map((header, index) => mapHeaders({ header, index }));
      this.emit("headers", this.headers);
      return;
    }
    if (!skip && this.options.strict && cells.length !== this.headers.length) {
      const e = new RangeError("Row length does not match headers");
      this.emit("error", e);
    } else {
      if (!skip) this.writeRow(cells);
    }
  }
  parseValue(buffer, start, end) {
    if (this.options.raw) {
      return buffer.slice(start, end);
    }
    return buffer.toString("utf-8", start, end);
  }
  writeRow(cells) {
    const headers = this.headers;
    const row = cells.reduce((o, cell, index) => {
      const header = headers[index];
      if (header === null) return o;
      if (header !== void 0) {
        o[header] = cell;
      } else {
        o[`_${index}`] = cell;
      }
      return o;
    }, {});
    this.push(row);
  }
  _flush(cb) {
    if (this.state.escaped || !this._prev) return cb();
    this.parseLine(this._prev, this.state.previousEnd, this._prev.length + 1);
    cb();
  }
  _transform(data, _, cb) {
    if (typeof data === "string") {
      data = Buffer.from(data);
    }
    const { escape, quote } = this.options;
    let start = 0;
    let buffer = data;
    if (this._prev) {
      start = this._prev.length;
      buffer = Buffer.concat([this._prev, data]);
      this._prev = null;
    }
    const bufferLength = buffer.length;
    for (let i = start; i < bufferLength; i++) {
      const chr = buffer[i];
      const nextChr = i + 1 < bufferLength ? buffer[i + 1] : null;
      this.state.rowLength++;
      if (this.state.rowLength > this.options.maxRowBytes) {
        return cb(new Error("Row exceeds the maximum size"));
      }
      if (!this.state.escaped && chr === escape && nextChr === quote && i !== start) {
        this.state.escaped = true;
        continue;
      } else if (chr === quote) {
        if (this.state.escaped) {
          this.state.escaped = false;
        } else {
          this.state.quoted = !this.state.quoted;
        }
        continue;
      }
      if (!this.state.quoted) {
        if (this.state.first && !this.options.customNewline) {
          if (chr === nl) {
            this.options.newline = nl;
          } else if (chr === cr) {
            if (nextChr !== nl) {
              this.options.newline = cr;
            }
          }
        }
        if (chr === this.options.newline) {
          this.parseLine(buffer, this.state.previousEnd, i + 1);
          this.state.previousEnd = i + 1;
          this.state.rowLength = 0;
        }
      }
    }
    if (this.state.previousEnd === bufferLength) {
      this.state.previousEnd = 0;
      return cb();
    }
    if (bufferLength - this.state.previousEnd < data.length) {
      this._prev = data;
      this.state.previousEnd -= bufferLength - data.length;
      return cb();
    }
    this._prev = buffer;
    cb();
  }
}
function CsvParserHelpr(opts) {
  return new CsvParser(opts);
}
async function ParseCsvFile(file_path, opts) {
  return new Promise((resolve, reject) => {
    const parser = CsvParserHelpr(opts);
    const rows = [];
    let csv_headers = [];
    parser.on("data", (row) => rows.push(row));
    parser.on("error", reject);
    parser.on("headers", (headers) => {
      csv_headers = headers;
    });
    parser.on("end", () => resolve({ rows, headers: csv_headers }));
    fs.createReadStream(file_path).pipe(parser);
  });
}
const _AppModel = class _AppModel {
  constructor() {
    __publicField(this, "mainwin", null);
    __publicField(this, "quickwin", null);
    __publicField(this, "my_tray", null);
    __publicField(this, "myencode", null);
    __publicField(this, "vault", null);
    __publicField(this, "vaultItem", null);
    __publicField(this, "appInfo", null);
    __publicField(this, "_lock", false);
    __publicField(this, "ali_drive", null);
    __publicField(this, "_lock_timeout", 0);
    __publicField(this, "_logined", false);
    __publicField(this, "user", null);
    __publicField(this, "db_helper", new SqliteHelper());
    __publicField(this, "_set_path", "");
    __publicField(this, "checkInterval", null);
    __publicField(this, "set", {
      lang: Default_Lang,
      app_ver: APP_VER_CODE,
      sql_ver: SQL_VER_CODE,
      cur_user_uid: 0
    });
    __publicField(this, "last_point", { x: 0, y: 0 });
  }
  static getInstance() {
    if (!_AppModel.instance) {
      _AppModel.instance = new _AppModel();
    }
    return _AppModel.instance;
  }
  Quit() {
    AppEvent.emit(AppEventType.APPQuit);
    electron.globalShortcut.unregisterAll();
    if (this.checkInterval) clearInterval(this.checkInterval);
    electron.app.quit();
  }
  async init() {
    Log.initialize();
    Log.Info("init myencode");
    this.myencode = new MyEncode();
    Log.Info("init entity");
    this.vault = new ValutService();
    this.vaultItem = new VaultItemService();
    this.user = new UserService();
    this.appInfo = new AppService();
    Log.Info("begin open db");
    await this.db_helper.OpenDb();
    Log.Info("init tables");
    await this.db_helper.initOneTable(this.user.entity);
    await this.db_helper.initOneTable(this.vault.entity);
    await this.db_helper.initOneTable(this.vaultItem.entity);
    await this.db_helper.initOneTable(this.appInfo.entity);
    this._initSet();
    this.ali_drive = new AliDrive();
    this.initLang();
    electron.app.setPath("crashDumps", path.join(PathHelper.getHomeDir(), "crashs"));
    electron.crashReporter.start({
      productName: "MyElectron",
      companyName: "MyCompany",
      uploadToServer: false
    });
    this.initWin();
    initAllApi();
    this.initGlobalShortcut();
    electron.app.on("browser-window-blur", (_, windows) => {
      AppEvent.emit(AppEventType.windowBlur, windows);
    });
    this.checkInterval = setInterval(() => {
      this.performLockCheck();
    }, 1e3);
  }
  initWin() {
    this.mainwin = new MainWindow();
    this.mainwin.win.on("ready-to-show", () => {
      this.mainwin.show();
    });
    this.quickwin = new QuickSearchWindow();
    this.my_tray = new MyTray();
  }
  _initSet() {
    this._set_path = path.join(PathHelper.getHomeDir(), "set.json");
    if (!fs.existsSync(this._set_path)) {
      fs.writeFileSync(this._set_path, JSON.stringify(this.set));
    } else {
      const saveinfo = JSON.parse(fs.readFileSync(this._set_path).toString());
      let have_new_property = false;
      Object.keys(this.set).forEach((key) => {
        const initvalue = saveinfo[key];
        if (initvalue === void 0 || initvalue === null) {
          saveinfo[key] = this.set[key];
          have_new_property = true;
        }
      });
      this.set = saveinfo;
      if (have_new_property) {
        this.saveSet();
      }
    }
  }
  saveSet() {
    fs.writeFileSync(this._set_path, JSON.stringify(this.set));
  }
  changeLang(lang) {
    this.set.lang = lang;
    this.initLang();
    this.saveSet();
  }
  get aliyunData() {
    return this.set.aliyun_data;
  }
  setAliyunData(data) {
    this.set.aliyun_data = data;
    this.saveSet();
  }
  GetLastUserId() {
    if (this.set.cur_user_uid && this.set.cur_user_uid > 0) return this.set.cur_user_uid;
    return null;
  }
  IsSystemInit() {
    const lastuserid = this.GetLastUserId();
    if (lastuserid) return _AppModel.getInstance().myencode.hasKey(lastuserid);
    return false;
  }
  CurLang() {
    return this.set.lang;
  }
  initLang() {
    LangHelper.setLang(this.set.lang);
  }
  performLockCheck() {
    if (this.IsLock()) return;
    const setinfo = this.user.userinfo.user_set;
    if (setinfo.normal_autolock_time == 0) return;
    const cuttime = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    if (this._lock_timeout < cuttime) {
      this.LockApp();
    }
  }
  LockApp() {
    this._lock = true;
    AppEvent.emit(AppEventType.LockApp);
  }
  IsLock() {
    return this._lock || !this._logined;
  }
  Login(uid) {
    this.set.cur_user_uid = uid;
    this._logined = true;
    this._lock = false;
    const setinfo = this.user.userinfo.user_set;
    this._lock_timeout = (/* @__PURE__ */ new Date()).getTime() / 1e3 + setinfo.normal_autolock_time * 60;
    this.saveSet();
    this.initGlobalShortcut();
    AppEvent.emit(AppEventType.LoginOk);
  }
  IsLogin() {
    return this._logined;
  }
  LoginOut() {
    var _a;
    (_a = this.myencode) == null ? void 0 : _a.LoginOut();
    this._logined = false;
    this._lock = true;
    AppEvent.emit(AppEventType.LoginOut);
  }
  curUserInfo() {
    return this.user.userinfo;
  }
  initGlobalShortcut() {
    let setinfo = defaultUserSetInfo;
    const curuserinfo = this.curUserInfo();
    if (curuserinfo) {
      setinfo = curuserinfo.user_set;
    }
    electron.globalShortcut.unregisterAll();
    Object.keys(setinfo).forEach((key) => {
      if (key.startsWith("shortcut_global")) {
        const value = setinfo[key];
        if (value && value.length > 0) {
          const res = electron.globalShortcut.register(value, () => {
            var _a, _b;
            if (key == "shortcut_global_open_main") (_a = this.mainwin) == null ? void 0 : _a.show();
            if (key == "shortcut_global_quick_find") (_b = this.quickwin) == null ? void 0 : _b.show();
            if (key == "shortcut_global_quick_lock") this.LockApp();
          });
          Log.Info("register global key:", value, res);
        }
      }
    });
  }
  IsKeyRegisted(key) {
    return electron.globalShortcut.isRegistered(key);
  }
  setLastPoint(point) {
    this.last_point = point;
  }
  async AutoFill(info) {
    this.quickwin.hide();
    if (info.vault_item_type == VaultItemType.Login) {
      const logininfo = info.info;
      robot.moveMouse(this.last_point.x, this.last_point.y);
      robot.mouseClick();
      robot.typeString(logininfo.username);
      robot.keyTap("tab");
      robot.typeString(logininfo.password);
      robot.keyTap("enter");
    }
  }
  getScreenPoint() {
    return electron.screen.getCursorScreenPoint();
  }
  async BackupFile(srcpath, backup_path) {
    Log.Info(`backup file begin:${srcpath}`);
    const filename = path.basename(srcpath);
    const dest = path.join(backup_path, filename);
    return new Promise((resolve, reject) => {
      fs.copyFile(srcpath, dest, (err) => {
        if (err) {
          Log.Error(`backup file error:${srcpath}->${dest}`, err);
          reject(false);
        } else {
          Log.Info(`backup file ok:${srcpath}->${dest}`);
          resolve(true);
        }
      });
    });
  }
  //生成备份
  async BackupSystem() {
    let res = null;
    try {
      const back_dir_name = `backup_${Math.ceil((/* @__PURE__ */ new Date()).getTime() / 1e3)}`;
      const backup_path_dir = path.join(PathHelper.getHomeDir(), "backup");
      if (!fs.existsSync(backup_path_dir)) {
        fs.mkdirSync(backup_path_dir);
      }
      const backup_path = path.join(backup_path_dir, back_dir_name);
      if (!fs.existsSync(backup_path)) {
        fs.mkdirSync(backup_path);
      }
      await this.db_helper.CloseDB();
      const dbpath = this.db_helper.getDbPath();
      await this.BackupFile(dbpath, backup_path);
      await this.BackupFile(this._set_path, backup_path);
      await this.BackupFile(this.myencode.getKeyPath(), backup_path);
      const zip_file = path.join(backup_path_dir, `${back_dir_name}.zip`);
      await zl.archiveFolder(backup_path, zip_file);
      res = zip_file;
    } catch (e) {
      Log.Error("gen backup error:", e);
      AppEvent.emit(AppEventType.Message, "error", LangHelper.getString("main.backup.error"));
    }
    await this.db_helper.OpenDb();
    return res;
  }
  async RecoverSystemFromBackup() {
    let res = true;
    try {
      const { canceled, filePaths } = await electron.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "zip", extensions: ["zip"] }]
      });
      if (canceled || !filePaths || filePaths.length == 0) {
        AppEvent.emit(
          AppEventType.Message,
          "error",
          LangHelper.getString("main.backup.filenotselect")
        );
        return false;
      }
      res = await this.RecoverSystemFromBackupFile(filePaths[0]);
    } catch (e) {
      Log.Error("restore backup error:", e);
      res = false;
      AppEvent.emit(AppEventType.Message, "error", LangHelper.getString("main.backup.error"));
    }
    return res;
  }
  //还原备份
  async RecoverSystemFromBackupFile(zipfile_path) {
    let res = true;
    const fiename = path.basename(zipfile_path.replace(".zip", ""));
    const backup_path = path.join(PathHelper.getHomeDir(), fiename);
    try {
      if (fs.existsSync(zipfile_path) == false) {
        Log.Error("zip file not exists:", zipfile_path);
        AppEvent.emit(
          AppEventType.Message,
          "error",
          LangHelper.getString("main.backup.zipfilenotfound", zipfile_path)
        );
        return false;
      }
      await this.db_helper.CloseDB();
      Log.Info(`extract backup file:${zipfile_path}->${backup_path}`);
      await zl.extract(zipfile_path, backup_path);
      const restoreFile = (dest) => {
        const destfile = path.basename(dest);
        const srcpath = path.join(backup_path, destfile);
        if (fs.existsSync(srcpath) == false) {
          Log.Error("restore file not exists:", srcpath);
          AppEvent.emit(
            AppEventType.Message,
            "error",
            LangHelper.getString("main.backup.zipfilenotfound", srcpath)
          );
          return false;
        }
        fs.copyFileSync(srcpath, dest);
        Log.Info(`restore file ok:${srcpath}->${dest}`);
        return true;
      };
      const restoreAll = () => {
        const dbpath = this.db_helper.getDbPath();
        if (restoreFile(dbpath) == false) return false;
        if (restoreFile(this._set_path) == false) return false;
        if (restoreFile(this.myencode.getKeyPath()) == false) return false;
        return true;
      };
      if (restoreAll() === true) this.myencode.LoadSet();
      else res = false;
    } catch (e) {
      Log.Error("restore backup error:", e);
      res = false;
      AppEvent.emit(AppEventType.Message, "error", LangHelper.getString("main.backup.error"));
    }
    Log.Info("recover system from backup:", res);
    fs.rmSync(backup_path, { recursive: true, force: true });
    await this.db_helper.OpenDb();
    return res;
  }
  //aliyun drive
  async checkAlidriveAuth() {
    var _a;
    const needauth = await ((_a = this.ali_drive) == null ? void 0 : _a.needAuth());
    if (needauth) {
      this.ali_drive.auth();
      AppEvent.emit(
        AppEventType.Message,
        "error",
        LangHelper.getString("mydropmenu.aliyunneedauth")
      );
      return false;
    }
    return true;
  }
  async BackupByAliyun() {
    if (await this.checkAlidriveAuth() == false) return null;
    const zip_file = await this.BackupSystem();
    if (zip_file == null) return null;
    const filename = path.basename(zip_file);
    Log.Info(`begin upload file ${zip_file} to aliyun:`);
    try {
      await this.ali_drive.UploadFile(filename, zip_file);
    } catch (e) {
      Log.Exception(e, "upload file error:", e.message);
      ShowErrToMain(LangHelper.getString("alidrive.uploaderror"));
      return null;
    }
    Log.Info("upload file ok");
    return `${this.ali_drive.parent_dir_name}/${filename}`;
  }
  async RecoverByAliyun(backup_file_name) {
    Log.Info(`begin download file ${backup_file_name} from aliyun:`);
    if (await this.checkAlidriveAuth() == false) return null;
    const backup_path_dir = path.join(PathHelper.getHomeDir(), "backup_aliyun");
    if (fs.existsSync(backup_path_dir) == false) {
      fs.mkdirSync(backup_path_dir);
    }
    const backup_file_path = path.join(backup_path_dir, backup_file_name);
    await this.ali_drive.downloadFile(backup_file_name, backup_file_path);
    const res = await this.RecoverSystemFromBackupFile(backup_file_path);
    if (res) Log.Info("recover system from aliyun ok");
    return res;
  }
  async GetAliyunBackupList() {
    if (await this.checkAlidriveAuth() == false) return [];
    return await this.ali_drive.getLatestFiliList("zip", "file");
  }
  //导入
  async ImportCsv(import_type) {
    const cur_user = this.curUserInfo();
    let res = true;
    try {
      const { canceled, filePaths } = await electron.dialog.showOpenDialog({
        title: LangHelper.getString(
          "importcsvtype.opencsvtitle",
          LangHelper.getString(`importcsvtype.${import_type}`)
        ),
        properties: ["openFile"],
        filters: [{ name: "csv", extensions: ["csv"] }]
      });
      if (canceled || !filePaths || filePaths.length == 0) {
        AppEvent.emit(
          AppEventType.Message,
          "error",
          LangHelper.getString("main.import.filenotselect")
        );
        return false;
      }
      Log.Info("import csv file:", filePaths[0]);
      const add_vault_name = GetImportVaultName(import_type);
      let vault_old = await this.vault.GetOne({ user_id: cur_user.id, name: add_vault_name });
      if (!vault_old) {
        await this.vault.AddOne({
          user_id: cur_user.id,
          name: add_vault_name,
          icon: `icon-${import_type.toString()}`
        });
        vault_old = await this.vault.GetOne({ user_id: cur_user.id, name: add_vault_name });
        if (vault_old == null) {
          throw new Error("add vault error");
        }
      }
      Log.Info(`get vault ok:${add_vault_name}`);
      const filepath = filePaths[0];
      const results = await ParseCsvFile(filepath);
      const importitems = getVaultImportItems(import_type);
      const vaultitems = [];
      for (let i = 0; i < results.rows.length; i++) {
        const info = {
          user_id: cur_user.id,
          vault_id: vault_old.id,
          vault_item_type: VaultItemType.Login,
          icon: Icon_type.icon_login
        };
        for (let j = 0; j < results.headers.length; j++) {
          const filed_name = results.headers[j].trim();
          const value = results.rows[i][filed_name].trim();
          const importinfo = importitems[filed_name];
          if (importinfo == null) continue;
          Csv2TableCol(info, importinfo, value);
        }
        vaultitems.push(info);
      }
      await this.vaultItem.AddMany(vaultitems);
    } catch (e) {
      Log.Exception(e, "import csv file error:");
      AppEvent.emit(AppEventType.Message, "error", LangHelper.getString("importcsvtype.error"));
      res = false;
    }
    return res;
  }
  //导出
  async ExportCsv() {
    try {
      const { canceled, filePaths } = await electron.dialog.showOpenDialog({
        properties: ["openDirectory"]
      });
      if (canceled || !filePaths || filePaths.length == 0) {
        AppEvent.emit(
          AppEventType.Message,
          "error",
          LangHelper.getString("main.import.filenotselect")
        );
        return null;
      }
      const csv_path = path.join(filePaths[0], "export_lockpass.csv");
      Log.Info("export csv file:", csv_path);
      const userinfo = this.curUserInfo();
      const items = await this.vaultItem.GetMany({ cond: { user_id: userinfo.id } });
      const writestream = fs.createWriteStream(csv_path);
      const fieldlist = GetExportFieldList();
      const keylist = fieldlist.reduce((pre, cur) => {
        pre.push(cur.db_key);
        return pre;
      }, []);
      writestream.write(keylist.join(",") + "\n");
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        fieldlist.forEach((fieldinfo) => {
          const value = TableCol2Csv(item, fieldinfo);
          if (value == null || value == void 0) {
            writestream.write(",");
            return;
          }
          writestream.write(`${str2csv(value)}`);
          writestream.write(",");
        });
        writestream.write("\n");
      }
      writestream.close();
      return csv_path;
    } catch (e) {
      Log.Error("export csv file error:", e);
      AppEvent.emit(AppEventType.Message, "error", LangHelper.getString("main.export.error"));
      return null;
    }
  }
};
__publicField(_AppModel, "instance");
let AppModel = _AppModel;
const AppModel$1 = AppModel;
electron.app.whenReady().then(async () => {
  utils.electronApp.setAppUserModelId("com.lockpass.app");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  await AppModel$1.getInstance().init();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      AppModel$1.getInstance().initWin();
    }
  });
});
electron.app.on("window-all-closed", () => {
  AppModel$1.getInstance().Quit();
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
function setDefaultProtocol(scheme) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      electron.app.setAsDefaultProtocolClient(scheme, process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    electron.app.setAsDefaultProtocolClient(scheme);
  }
}
setDefaultProtocol(SYS_TEM_NAME);
const gotTheLock = electron.app.requestSingleInstanceLock();
if (!gotTheLock) {
  electron.app.quit();
} else {
  electron.app.on("second-instance", (_, commandLine) => {
    const mainwin = AppModel$1.getInstance().mainwin;
    if (mainwin) {
      if (mainwin.win.isMinimized()) mainwin.win.restore();
      mainwin.win.focus();
    }
    const url = commandLine.at(-1);
    console.log("second-instance", url);
    AppEvent.emit(AppEventType.DeepLink, url);
  });
  electron.app.on("open-url", (_, url) => {
    console.log("open-url", url);
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      AppModel$1.getInstance().initWin();
    }
    AppEvent.emit(AppEventType.DeepLink, url);
  });
}
