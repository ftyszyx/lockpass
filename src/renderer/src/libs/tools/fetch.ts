import { Net_Retcode } from '@renderer/const'
import { message } from 'antd'
import axios, { AxiosRequestConfig } from 'axios'
export const MyFetch = axios.create({
  baseURL: 'https://bugly.qq.com',
  timeout: 0,
  withCredentials: true //请求是否带上cookie
})

export const MyFetchGet = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return MyFetch.get(url, config)
}

export const MyFetchPost = <REQ_T, RESP_T>(
  url: string,
  data?: REQ_T,
  config?: AxiosRequestConfig
): Promise<RESP_T> => {
  return MyFetch.post(url, data, config)
}

// 请求是否带上cookie
MyFetch.interceptors.request.use(
  (req) => {
    console.log('fetch req ', req.method, req.url, req.data)
    req.headers['Content-Type'] = 'application/json;charset=utf-8'
    req.headers['Accept'] = 'application/json;charset=utf-8'
    // req.headers['User-Agent'] =
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    // req.headers['Referer'] = 'https://bugly.qq.com/'
    const bugly_session = document.cookie
    console.log('bugly_session', bugly_session)
    // req.headers['cookie'] = bugly_session
    //加载中
    return req
  },
  (error) => {
    console.trace(error)
    Promise.reject(error)
  }
)
// 对返回的结果做处理
MyFetch.interceptors.response.use(
  (response) => {
    console.log(
      'fetch res:',
      response.config.url,
      response.data,
      window.location.href,
      window.location.pathname
    )
    const res_data = response.data
    const code = res_data?.code
    // 没有权限，登录超时，登出，跳转登录
    if (code == Net_Retcode.SUCCESS) {
      return response.data.data
    } else {
      message.error(res_data?.msg)
    }
    return Promise.reject(new Error(res_data?.message))
  },
  (error) => {
    console.trace('reponse err:', error)
    return Promise.reject(error)
  }
)
