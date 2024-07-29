import en_us from './en-us.json'
import zh_cn from './zh-cn.json'

export class LangItem {
  name: string
  locale: string
  lang_dic: Record<string, string>

  constructor(name: string, locale: string, lang_dic: Record<string, string>) {
    this.name = name
    this.locale = locale
    this.lang_dic = lang_dic
  }

  getText(msg: string, ...args: any[]) {
    const res = this.lang_dic[msg]
    if (res == null) {
      console.error(`can't find lang text:${msg}`)
    }
    if (args.length > 0) {
      return res.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match
      })
    }
    return res
  }
}

const Langs: LangItem[] = [
  new LangItem('简体中文', 'zh-cn', zh_cn),
  new LangItem('English', 'en-us', en_us)
]

export class LangHelper {
  private static _lang: LangItem | null
  static setLang(locale: string) {
    this._lang = Langs.find((item) => item.locale == locale)
  }
  static getString(msg: string, ...args: any[]) {
    return this._lang?.getText(msg, ...args)
  }

  static get lang() {
    return this._lang
  }
}
