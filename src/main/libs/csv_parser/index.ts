import { Transform } from 'stream'
import fs from 'fs'

const [cr] = Buffer.from('\r')
const [nl] = Buffer.from('\n')
const defaults = {
  escape: '"',
  headers: null,
  mapHeaders: ({ header }) => header,
  mapValues: ({ value }) => value,
  newline: '\n',
  quote: '"',
  raw: false,
  separator: ',',
  skipComments: false,
  skipLines: null,
  maxRowBytes: Number.MAX_SAFE_INTEGER,
  strict: false
}

interface Options {
  /**
   * A single-character string used to specify the character used to escape strings in a CSV row.
   *
   * @default '"'
   */
  escape?: string | number
  headers?: string[]
  readonly mapHeaders?: (args: { header: string; index: number }) => string | null
  readonly mapValues?: (args: { header: string; index: number; value: any }) => any
  /**
   * Specifies a single-character string to denote the end of a line in a CSV file.
   *
   * @default '\n'
   */
  newline?: string | number

  /**
   * Specifies a single-character string to denote a quoted string.
   *
   * @default '"'
   */
  readonly quote?: string

  /**
   * If `true`, instructs the parser not to decode UTF-8 strings.
   */
  readonly raw?: boolean

  /**
   * Specifies a single-character string to use as the column separator for each row.
   *
   * @default ','
   */
  readonly separator?: string

  /**
   * Instructs the parser to ignore lines which represent comments in a CSV file. Since there is no specification that dictates what a CSV comment looks like, comments should be considered non-standard. The "most common" character used to signify a comment in a CSV file is `"#"`. If this option is set to `true`, lines which begin with `#` will be skipped. If a custom character is needed to denote a commented line, this option may be set to a string which represents the leading character(s) signifying a comment line.
   *
   * @default false
   */
  readonly skipComments?: boolean | string

  /**
   * Specifies the number of lines at the beginning of a data file that the parser should skip over, prior to parsing headers.
   *
   * @default 0
   */
  readonly skipLines?: number

  /**
   * Maximum number of bytes per row. An error is thrown if a line exeeds this value. The default value is on 8 peta byte.
   *
   * @default Number.MAX_SAFE_INTEGER
   */
  readonly maxRowBytes?: number

  /**
   * If `true`, instructs the parser that the number of columns in each row must match the number of `headers` specified.
   */
  readonly strict?: boolean

  customNewline?: boolean
}

class CsvParser extends Transform {
  state?: any
  private _prev?: Buffer | null
  private options: Options
  headers: string[]
  constructor(opts: Options = {}) {
    super({ objectMode: true, highWaterMark: 16 })
    const options = Object.assign({}, defaults, opts)
    options.customNewline = options.newline !== defaults.newline
    for (const key of ['newline', 'quote', 'separator']) {
      if (typeof options[key] !== 'undefined') {
        ;[options[key]] = Buffer.from(options[key])
      }
    }
    // if escape is not defined on the passed options, use the end value of quote
    this.options.escape = (opts || {}).escape ? Buffer.from(options.escape)[0] : options.quote
    this.state = {
      empty: options.raw ? Buffer.alloc(0) : '',
      escaped: false,
      first: true,
      lineNumber: 0,
      previousEnd: 0,
      rowLength: 0,
      quoted: false
    }
    this._prev = null
    if (options.headers) {
      this.state.first = false
    }
    this.options = options
    this.headers = options.headers
  }

  parseCell(buffer, start, end) {
    const { escape, quote } = this.options
    // remove quotes from quoted cells
    if (buffer[start] === quote && buffer[end - 1] === quote) {
      start++
      end--
    }

    let y = start

    for (let i = start; i < end; i++) {
      // check for escape characters and skip them
      if (buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote) {
        i++
      }

      if (y !== i) {
        buffer[y] = buffer[i]
      }
      y++
    }

    return this.parseValue(buffer, start, y)
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
    } = this.options

    end-- // trim newline
    if (!customNewline && buffer.length && buffer[end - 1] === cr) {
      end--
    }

    const comma = separator
    const cells = []
    let isQuoted = false
    let offset = start

    if (skipComments) {
      const char = typeof skipComments === 'string' ? skipComments : '#'
      if (buffer[start] === Buffer.from(char)[0]) {
        return
      }
    }

    const mapValue = (value) => {
      if (this.state.first) {
        return value
      }

      const index = cells.length
      const header = this.headers[index]

      return mapValues({ header, index, value })
    }

    for (let i = start; i < end; i++) {
      const isStartingQuote = !isQuoted && buffer[i] === quote
      const isEndingQuote =
        isQuoted && buffer[i] === quote && i + 1 <= end && buffer[i + 1] === comma
      const isEscape = isQuoted && buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote

      if (isStartingQuote || isEndingQuote) {
        isQuoted = !isQuoted
        continue
      } else if (isEscape) {
        i++
        continue
      }

      if (buffer[i] === comma && !isQuoted) {
        let value = this.parseCell(buffer, offset, i)
        value = mapValue(value)
        cells.push(value)
        offset = i + 1
      }
    }

    if (offset < end) {
      let value = this.parseCell(buffer, offset, end)
      value = mapValue(value)
      cells.push(value)
    }

    if (buffer[end - 1] === comma) {
      cells.push(mapValue(this.state.empty))
    }

    const skip = skipLines && skipLines > this.state.lineNumber
    this.state.lineNumber++

    if (this.state.first && !skip) {
      this.state.first = false
      this.headers = cells.map((header, index) => mapHeaders({ header, index }))

      this.emit('headers', this.headers)
      return
    }

    if (!skip && this.options.strict && cells.length !== this.headers.length) {
      const e = new RangeError('Row length does not match headers')
      this.emit('error', e)
    } else {
      if (!skip) this.writeRow(cells)
    }
  }

  parseValue(buffer, start, end) {
    if (this.options.raw) {
      return buffer.slice(start, end)
    }

    return buffer.toString('utf-8', start, end)
  }

  writeRow(cells) {
    const headers = this.headers
    const row = cells.reduce((o, cell, index) => {
      const header = headers[index]
      if (header === null) return o // skip columns
      if (header !== undefined) {
        o[header] = cell
      } else {
        o[`_${index}`] = cell
      }
      return o
    }, {})
    this.push(row)
  }

  _flush(cb) {
    if (this.state.escaped || !this._prev) return cb()
    this.parseLine(this._prev, this.state.previousEnd, this._prev.length + 1) // plus since online -1s
    cb()
  }

  _transform(data, _, cb) {
    if (typeof data === 'string') {
      data = Buffer.from(data)
    }

    const { escape, quote } = this.options
    let start = 0
    let buffer = data

    if (this._prev) {
      start = this._prev.length
      buffer = Buffer.concat([this._prev, data])
      this._prev = null
    }

    const bufferLength = buffer.length

    for (let i = start; i < bufferLength; i++) {
      const chr = buffer[i]
      const nextChr = i + 1 < bufferLength ? buffer[i + 1] : null

      this.state.rowLength++
      if (this.state.rowLength > this.options.maxRowBytes) {
        return cb(new Error('Row exceeds the maximum size'))
      }

      if (!this.state.escaped && chr === escape && nextChr === quote && i !== start) {
        this.state.escaped = true
        continue
      } else if (chr === quote) {
        if (this.state.escaped) {
          this.state.escaped = false
          // non-escaped quote (quoting the cell)
        } else {
          this.state.quoted = !this.state.quoted
        }
        continue
      }

      if (!this.state.quoted) {
        if (this.state.first && !this.options.customNewline) {
          if (chr === nl) {
            this.options.newline = nl
          } else if (chr === cr) {
            if (nextChr !== nl) {
              this.options.newline = cr
            }
          }
        }

        if (chr === this.options.newline) {
          this.parseLine(buffer, this.state.previousEnd, i + 1)
          this.state.previousEnd = i + 1
          this.state.rowLength = 0
        }
      }
    }

    if (this.state.previousEnd === bufferLength) {
      this.state.previousEnd = 0
      return cb()
    }

    if (bufferLength - this.state.previousEnd < data.length) {
      this._prev = data
      this.state.previousEnd -= bufferLength - data.length
      return cb()
    }

    this._prev = buffer
    cb()
  }
}

export function CsvParserHelpr(opts?: Options) {
  return new CsvParser(opts)
}

export async function ParseCsvFile(
  file_path,
  opts?: Options
): Promise<{ rows: Record<string, string>[]; headers: string[] }> {
  return new Promise((resolve, reject) => {
    const parser = CsvParserHelpr(opts)
    const rows = []
    let csv_headers = []
    parser.on('data', (row) => rows.push(row))
    parser.on('error', reject)
    parser.on('headers', (headers) => {
      csv_headers = headers
    })
    parser.on('end', () => resolve({ rows, headers: csv_headers }))
    fs.createReadStream(file_path).pipe(parser)
  })
}
