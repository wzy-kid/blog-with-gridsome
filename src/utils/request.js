import axios from 'axios'
import Vue from 'vue'
import store from '../store/index'


const service = axios.create({
    baseURL: "https://api.github.com",
    timeout: 15000
})

service.interceptors.request.use(
    config => {
        let token = store.state.token.token || "94d08d4fc775f63584523b58591471838b5a0768"
        if (token) {
            let sp = "?"
            if (config.url.indexOf("?") >= 0) {
                sp = "&"
            }
            config.url = config.url + sp + "access_token=" + token
        }
        return config
    },
    error => {

    }
)


service.interceptors.response.use(
    response => {
        let responseJson = response.data
        return response
    },
    error => {
        let message
        if (!error?.response) return Promise.reject('error')
        switch (error.response.status) {
            case 401:
                message = "Token错误"
                break
            default:
                message = error.response.data.message
                break
        }
        Vue.prototype.$message({
            message: message,
            type: 'error'
        })
        return Promise.reject('error')
    }
)

export default service
