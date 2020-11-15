import axios from 'axios'

import {
  MessageBox,
  Message,
  Notification
} from 'element-ui'


// let md5 = require('js-md5')

let http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API2,
  withCredentials: false
})
const CancelToken = axios.CancelToken
if (window && typeof window !== 'undefined') {
  window._axiosPromiseArr = [] // 存储所有的请求
}

const downloadUrl = ['/buyer/ssdbuyer/export', '/supplier/ssdsupplier/export'] // 下载的链接
function isBlob(url) {
  return downloadUrl.some(item => {
    if (url.indexOf(item) > -1) {
      return true
    }
    return false
  })
}

/**
 * 取消pending的请求
 * */
let removePending = (config = null) => {
  window._axiosPromiseArr.forEach((item, index) => {
    // 这个接口需要请求两次，不能取消
    if (item.url.includes('/third/ssdcitycode/list')) {
      return
    }
    if (item.url === `${config.url}&${config.method}`) {
      item.cancel()
      window._axiosPromiseArr.splice(index, 1)
    }
  })
}

/**
 * 添加请求拦截器
 * */
http.interceptors.request.use(config => {
  removePending(config)
  config.cancelToken = new CancelToken(c => {
    window._axiosPromiseArr.push({
      url: `${config.url}&${config.method}`,
      cancel: c
    })
  })
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 添加响应拦截器
 * */
http.interceptors.response.use(res => {
  removePending(res.config)
  return res
}, error => {
  return Promise.reject(error.response) // 返回一个空对象，主要防止控制台报错
})

/**
 * 对axios进行二次封装
 * @param http请求方法
 * @param 后台接口地址
 * @param 提交的参数
 * @return Promise: data或者error
 * */
function apiAxios(method, url, param, headers = null) {
  // const DT_TOKEN = url.includes('api.map.baidu.com') || url.includes('iemp-nbiot-web/device/alarm/statistics') ? null : getToken()
  const DT_TOKEN = ''
  const defaultHeaders = DT_TOKEN ? {
    DT_TOKEN
  } : null

  let mixHeaders = {
    ...defaultHeaders,
    ...headers
  }

  // code = 0 返回正确的结果
  const SUCCESS_CODE = 0

  return new Promise((resolve, reject) => {
    http({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? param : null,
      params: method === 'GET' || method === 'DELETE' ? param : null,
      headers: mixHeaders,
      responseType: isBlob(url) ? 'blob' : 'json'
    }).then(function (_res) {
      if (_res.status >= 200 && _res.status < 300) {
        const res = _res.data
        const code = res.code
        if (!res.hasOwnProperty('data')) { // 不是规范的{code: ?, msg: ?, data: ?}格式
          resolve(res)
          return
        }
        if (code !== SUCCESS_CODE) {
          reject(new Error(res.message || res.msg))
        } else {
          const data = res.data || res.result
          resolve(data)
        }
      }
    }).catch(e => {
    })
  })
}

export default {
  get(url, param, headers) {
    return apiAxios('GET', url, param, headers)
  },
  post(url, param, headers) {
    return apiAxios('POST', url, param, headers)
  },
  put(url, param, headers) {
    return apiAxios('PUT', url, param, headers)
  },
  delete(url, param, headers) {
    return apiAxios('DELETE', url, param, headers)
  }
}