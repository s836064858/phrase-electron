import axios from 'axios'
import { Message } from 'element-ui'
export default function $axios(options) {
  return new Promise((resolve, reject) => {
    /**
     * 创建实例
     * @type {[type]}
     */
    const instance = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
      timeout: 30000
    })
    /**
     * 请求拦截
     * @type {[type]}
     */
    instance.interceptors.request.use(
      (config) => {
        config.headers['token'] = '123'
        return config
      },
      (error) => {
        return Promise.reject(new Error(error))
      }
    )

    /**
     * 响应拦截
     * @type {[type]}
     */
    instance.interceptors.response.use(
      (response) => {
        const data = response.data.data
        const code = response.data.code
        const message = response.data.message
        if (code === 200) {
          return data
        } else {
          Message.error(message)
          return Promise.reject(new Error(message))
          // return data
        }
      },
      (error) => {
        Message.error(JSON.stringify(error))
        return Promise.reject(error)
      }
    )

    instance(options)
      .then((res) => resolve(res))
      .catch((error) => reject(error))
  })
}
