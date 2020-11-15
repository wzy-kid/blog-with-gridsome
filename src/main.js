// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

import Vuex from 'vuex'
import util from './utils/util'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/index.css'

// import Vant from 'vant'
// import 'vant/lib/vant-css/index.css'


// import http from './utils/http' // axios的封装

import format from './utils/format' // 工具类

// format.run()


export default function (Vue, { appOptions, router, head, isClient }) {
  // Set default layout as a global component
  // Vue.store = store

  Vue.use(ElementUI)

  // Vue.prototype.$http = http
  Vue.prototype.$format = format

  Vue.prototype.$markdown = function (value) {
    return mavonEditor.markdownIt.render(value)
  }

  Vue.prototype.$reload = function (context) {
    let NewPage = '/empty'
    context.$router.push(NewPage)
    context.$nextTick(() => (context.$router.go(-1)))
  }

  // Vue.prototype.$setTitle = function (title) {
  //   if (title) {
  //     document.title = store.state.configuration.htmlTitle + " - " + title
  //   } else {
  //     document.title = store.state.configuration.htmlTitle
  //   }
  // }
  Vue.prototype.$share = function (message) {
    if (!message) {
      message = window.location
    } else {
      let arr = (window.location + "").split("#")
      message = arr[0] + "#" + message
    }
    if (util.copy(message)) {
      Vue.prototype.$confirm('链接已复制,去分享给好友吧!!', '分享', {
        showCancelButton: false,
        showClose: false,
        type: 'success'
      })
    } else {
      Vue.prototype.$confirm('链接复制失败,可能因为浏览器不兼容', '分享', {
        showCancelButton: false,
        showClose: false,
        type: 'warning'
      })
    }
  }

  Vue.prototype.$mobileShare = function (message) {
    if (!message) {
      message = window.location
    } else {
      let arr = (window.location + "").split("#")
      message = arr[0] + "#" + message
    }
    if (util.copy(message)) {
      Vue.prototype.$dialog.alert({
        title: '分享',
        message: '链接已复制,去分享给好友吧!!'
      })
    } else {
      Vue.prototype.$dialog.alert({
        title: '分享',
        message: '链接复制失败,可能因为浏览器不兼容'
      })
    }
  }

  appOptions.store = store;

  Vue.prototype.$util = util
  Vue.component('Layout', DefaultLayout)
}
