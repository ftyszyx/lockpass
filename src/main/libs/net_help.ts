import { net } from 'electron'
import { Log } from './log'
import https from 'https'
import fs from 'fs'

export async function SendRequest<T>(
  url: string,
  method: string,
  headers: Record<string, string>,
  data: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = net.request({
      method: method,
      url: url,
      headers: headers
    })
    if (data && method === 'POST') request.write(JSON.stringify(data))
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
