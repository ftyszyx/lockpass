import { net } from 'electron'
import { Log } from './log'
import https, { RequestOptions } from 'https'
import fs from 'fs'

export async function SendRequest<T>(
  url: string,
  method: string,
  headers: Record<string, any>,
  data: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = net.request({
      method: method,
      url: url,
      headers: headers
    })
    if (data) {
      if (data instanceof Buffer) request.write(data)
      else request.write(JSON.stringify(data))
    }
    request.on('response', (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk.toString()
      })
      response.on('end', () => {
        const res = JSON.parse(data)
        if (res.code) {
          Log.error(`req ${url} error ${data} `)
          reject(new Error(res.message))
          return
        }
        // Log.Info(`req ${url} ok ${data} `)
        resolve(res as T)
      })
    })
    request.on('error', (error) => {
      Log.error(`req ${url} error `, error.message)
      reject(error)
    })
    request.end()
  })
}

export async function downloadFileFromUrl(url: string, localPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(localPath)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
          return
        }
        response.pipe(file)
        file.on('finish', () => {
          file.close(() => {
            resolve()
          })
        })
      })
      .on('error', (err) => {
        fs.unlink(localPath, () => reject(err))
      })
  })
}

export async function uploadFileToUrl(
  url: string,
  option: RequestOptions,
  filer_buffer: Buffer,
  pos: number,
  size: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, option, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk.toString()
      })
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data)
        } else {
          Log.error(`upload part  error ${data}`)
          reject(new Error(`upload part error ${data}`))
        }
      })
    })
    req.on('error', (error) => {
      Log.error(`upload  error `, error.message)
      reject(new Error(`upload error ${error.message}`))
    })
    req.write(Buffer.from(filer_buffer, pos, size), (error) => {
      if (error) {
        Log.error(`read file error `, error.message)
        reject(new Error(`upload error  read file error:${error.message}`))
      }
    })
    req.end()
  })
}
