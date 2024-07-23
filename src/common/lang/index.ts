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

  getLangText(msg: string) {
    return this.lang_dic[msg]
  }

  getLangFormat(msg: string, ...args: any[]) {
    const lang_msg = this.getLangText(msg)
    if (lang_msg == null) {
      return msg
    }
    return lang_msg.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}

const Langs: LangItem[] = [
  new LangItem('简体中文', 'zh-cn', zh_cn),
  new LangItem('English', 'en-us', en_us)
]

export class LangHelper {
  static lang: LangItem | null
  static setLang(locale: string) {
    this.lang = Langs.find((item) => item.locale == locale)
    console.log('setLang', this.lang, locale)
  }
  static getLangText(msg: string) {
    return this.lang?.getLangText(msg)
  }
  static getLangFormat(msg: string, ...args: any[]) {
    return this.lang?.getLangFormat(msg, ...args)
  }
}
