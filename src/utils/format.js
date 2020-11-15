import Vue from 'vue'

//金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
const number = Vue.filter('number', (value) => {
  if (!value) {
    return 0
  }
  let str = (value / 100).toFixed(2) + '';
  let intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); //取到整数部分
  let dot = str.substring(str.length, str.indexOf(".")) //取到小数部分搜索
  let ret = intSum + dot;
  return ret;
})
// 数字保留n位小数
const fixde = Vue.filter('fixde', (value, n) => {
  if (typeof + value === 'number' && !isNaN(+value)) {
    return +value.toFixed(n)
  } else {
    return 0
  }
});
//字符串变星号  str：要进行隐藏的变量  frontLen: 前面需要保留几位    endLen: 后面需要保留几位
const hidden = Vue.filter('hidden', (str, frontLen, endLen) => {
  str += ''
  if (!str) {
    return ''
  }
  let len = str.length - frontLen - endLen;
  let xing = '';
  for (let i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
});
// 数字加百分号
const percent = Vue.filter('percent', (data) => {
  if (data[0] == '.') {
    return 0 + data + '%'
  } else {
    return data + '%'
  }
});
//验证电子邮箱格式
const email = Vue.filter('email', (value) => {
  return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
})
// 验证手机格式
const mobile = Vue.filter('mobile', (value) => {
  return /^1[23456789]\d{9}$/.test(value)
})
// 验证身份证号码
const idCard = Vue.filter('idCard', (value) => {
  return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
})
// 金额,只允许2位小数
const amount = Vue.filter('amount', (value) => {
  //金额，只允许保留两位小数
  return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
})
// 只能是字母或者数字
const enOrNum = Vue.filter('enOrNum', (value) => {
  //英文或者数字
  let reg = /^[0-9a-zA-Z]*$/g;
  return reg.test(value);
})
// 验证一个值范围[min, max]
const range = Vue.filter('range', (value, param) => {
  return value >= param[0] && value <= param[1]
})
// 验证一个长度范围[min, max]
const rangeLength = Vue.filter('rangeLength', (value, param) => {
  return value.length >= param[0] && value.length <= param[1]
})
// 去除空格
const trim = Vue.filter('trim', (str, pos = 'both') => {
  if (pos == 'both') {
    return str.replace(/^\s+|\s+$/g, "");
  } else if (pos == "left") {
    return str.replace(/^\s*/, '');
  } else if (pos == 'right') {
    return str.replace(/(\s*$)/g, "");
  } else if (pos == 'all') {
    return str.replace(/\s+/g, "");
  } else {
    return str;
  }
})
// 为按钮添加权限
const directiveButton = (route, value) => {
  let obj = {}
  obj[route.$route.path] = route.$route.path + '_' + value
  return obj
}

// 将一些自定义函数挂载到window
const run = () => {
  // 重写console.log();
  console.log = (function (log) {
    return process.env.NODE_ENV == 'development' ? log : function () { }
  }(console.log))
  const {
    log
  } = console
  window.log = log
  // 重写console.dir();
  console.dir = (function (dir) {
    return process.env.NODE_ENV == 'development' ? dir : function () { }
  }(console.dir))
  const {
    dir
  } = console
  window.dir = dir

  // 为自定义数据结构添加Symbol.iterator，使其能够通过for of 遍历
  // iterator(obj)
  // for (let [key, value] of obj) {
  //     console.log(key, value)
  // }
  window.iterator = (obj) => {
    obj[Symbol.iterator] = function () {
      // index用来记遍历圈数
      let index = 0;
      return {
        next: () => {
          return {
            value: [Reflect.ownKeys(this)[index], this[Reflect.ownKeys(this)[index]]],
            done: index++ >= Reflect.ownKeys(this).length - 1
          }
        }
      }
    }
  }
}

let timeout = null;

/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 * 
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行 
 * @return null
 */
function debounce(func, wait = 500, immediate = false) {
  // 清除定时器
  if (timeout !== null) clearTimeout(timeout);
  // 立即执行，此类情况一般用不到
  if (immediate) {
    var callNow = !timeout;
    timeout = setTimeout(function () {
      timeout = null;
    }, wait);
    if (callNow) typeof func === 'function' && func();
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
    timeout = setTimeout(function () {
      typeof func === 'function' && func();
    }, wait);
  }
}

export default {
  run,
  number,
  fixde,
  hidden,
  percent,
  email,
  mobile,
  idCard,
  amount,
  trim,
  range,
  directiveButton,
  enOrNum,
  rangeLength,
  debounce
}