import { Default_Lang } from '@common/gloabl'
import en_us from './en-us.json'
import zh_cn from './zh-cn.json'

export interface LangItem {
  name: string
  locale: string
  lang_dic: Record<string, string>
}

const Langs: LangItem[] = [
  { name: '简体中文', locale: 'zh-cn', lang_dic: zh_cn },
  { name: 'English', locale: 'en-us', lang_dic: en_us }
]

export class LangClass {
  constructor(
    private locale: string,
    private lang: LangItem
  ) {
    this.locale = locale
    this.lang = Langs.find((item) => item.locale == this.locale)
  }

  getLangText(msg: string) {
    return this.lang.lang_dic[msg]
  }

  getLangFormat(msg: string, ...args: any[]) {
    return msg.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}

export class LangHelper {
  static lang: LangItem | null
  static locale = Default_Lang
  static setLang(locale: string) {
    this.lang = Langs.find((item) => item.locale == locale)
    console.log('setLang', this.lang, locale)
    this.locale = locale
  }

  static getLangText(msg: string) {
    console.log('getLangText', msg, this.lang)
    return this.lang.lang_dic[msg]
  }

  static getLangFormat(msg: string, ...args: any[]) {
    return msg.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}
