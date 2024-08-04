export enum PasswordSeparatorType {
  underline = '_',
  hyphen = '-',
  dot = '.',
  comma = ','
}

export enum GenPasswordType {
  random = 'random',
  Pin = 'pin',
  Memory = 'memory'
}

export interface PasswordTypeInfo {
  random_characters_len: number
  random_number: boolean
  random_symbol: boolean
  random_capitalize: boolean
  memory_words_num: number
  memory_separator: PasswordSeparatorType
  memory_capitalize: boolean
  memory_word_full: boolean
  pin_code_num: number
}

export const DefaultPasswordTypeConf: PasswordTypeInfo = {
  random_characters_len: 11,
  random_number: true,
  random_symbol: true,
  random_capitalize: true,
  memory_words_num: 4,
  memory_separator: PasswordSeparatorType.hyphen,
  memory_capitalize: true,
  memory_word_full: false,
  pin_code_num: 6
}
