import {cloneDeep} from 'lodash-es'
import {
  isString,
  isNumber,
} from './types';
import { isURL } from './validate';

/**
 * @description 获取浏览器内核
 * @returns {String} 浏览器内核名称
 * @author fengjin
 * @date 2021-07-21 12:01:29
 */
export function getBrowserEngine() {
  const u = navigator.userAgent;
  const obj = {
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
  };
  return Object.keys(obj)[Object.values(obj).indexOf(true)];
}

/**
 * @description 获取 url 地址参数
 * @param {String} url
 * @returns {URLSearchParams}
 * @author fengjin
 * @date 2021-07-21 12:07:09
 *
 * @example
 * searchParams('https://www.baidu.com/s?ie=utf-8&wd=keyword').get('ie') --> utf-8
 * searchParams('https://www.baidu.com/s?ie=utf-8&wd=keyword').has('wd') --> true
 * searchParams('https://www.baidu.com/s?ie=utf-8&wd=keyword').has('ok') --> null
 */
export function getSearchParams(url) {
  return new URLSearchParams(url.split('?')[1]);
}

/**
 * @description 根据指定 class name 查找父节点
 * @param {Node & ParentNode} target
 * @param {String} className
 * @returns {EventTarget}
 * @author fengjin
 * @date 2021-08-10 10:27:02
 */
export function getParentNodeByClass(target, className) {
  if (target.className?.split(' ').includes(className)) {
    return target;
  }

  return getParentNodeByClass(target.parentNode, className);
}

/**
 * @description 过滤对象中的空数据
 * @param Object
 * @author 王应龙
 * @date 2021-08-19 10:08:00
 * @returns {{}}
 */
export function delNullProperty(params = {}, bool = false) {
  let obj = cloneDeep(params)
  //遍历对象中的属性
  for (let i in obj) {
    //首先除去常规空数据，用delete关键字
    if (!obj[i] && obj[i] !== 0) {
      Reflect.deleteProperty(obj, i)
      //如果发现该属性的值还是一个对象，再判空后进行迭代调用
    } else if (obj[i].constructor === Object) {
      delNullProperty(obj[i])
      //判断对象上是否存在属性，如果为空对象则删除
      // if (!Object.keys(obj[i]).length) delete obj[i]
      if (!Object.keys(obj[i]).length) Reflect.deleteProperty(obj, i)
    } else if (obj[i].constructor === Array && bool) {
      //如果数组为空则删除
      if (!obj[i].length) {
        Reflect.deleteProperty(obj, i)
      } else {
        //遍历数组
        for (let index = 0; index < obj[i].length; index++) {
          if (obj[i][index] === undefined || obj[i][index] === null || obj[i][index] === "" || JSON.stringify(obj[i][index]) === "{}") {
            //如果数组值为以上空值则修改数组长度，移除空值下标后续值依次提前
            obj[i].splice(index, 1)
            //由于数组当前下标内容已经被替换成下一个值，所以计数器需要自减以抵消之后的自增
            index--
          }
          //如果发现数组值中有对象，则再次进入迭代
          if (obj[i].constructor === Object) {
            delNullProperty(obj[i])
          }
        }
        if (obj[i].constructor === Array && !obj[i].length) {
          Reflect.deleteProperty(obj, i)
        }
      }
    }
  }
  return obj
}

// 预算值约束规则
// v = 值  isChange = 是不是chang事件触发 decimalPoint = 可输入的小数点位数
export function numInputMap({v, decimalPoint = 2, isChange = false}) {
  if (isChange) {
    if (isNaN(parseFloat(v))) {
      v = null
      return
    }
    // v = parseFloat(v)
    v = v.replace(/^\d*\.$/g, v.match(/(\d*)/g)[0])
    // 获取除了0 后面的所有值
    v = /^0\d/g.test(v) ? v.match(/(?<=^0)(\d.*)/g)[0] : v
  } else {
    // 0开头不能出现多个
    v = v.replace(/^0{2,}/g, "0");
    // 把非数字的都替换掉，除了数字和.
    v = v.replace(/[^\d.]/g, "");
    // 保证只有出现一个.而没有多个.
    v = v.replace(/\.{2,}/g, ".");
    // 必须保证第一个为数字而不是.
    v = v.replace(/^\./g, "");
    // 保证.只出现一次，而不能出现两次以上
    v = v.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    // 可输入的小数点位数 动态配置 默认2位
    v = v.replace(new RegExp(`^(-)*(\\d+)\\.(\\d{${decimalPoint}}).*$`), '$1$2.$3');
  }
  return v
}

export function deepClone(source) {
  if (!source || typeof source !== 'object') {
    return new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 判断是否为json字符串
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      return !!(typeof obj === 'object' && obj);
    } catch (e) {
      return false;
    }
  }
  return false
}

// json字符串解析
export function json_parse(str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

// 截取字符串
export function splitStr(str, length) {
  let len = 0
  let nStr = ''
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len += 0.5
    } else {
      len++
    }
    if (len <= length) {
      nStr += str[i]
    } else {
      return nStr
    }
  }
  return nStr
}

// 批量执行异步任务
/*
* arr 异步任务列表
* step 每次执行多少个异步任务
* callback 异步任务全部执行完成后的回调
* */
const asyncFn = async (arr) => {
  console.log('正在执行------')
  if (arr.length > 0) await arr.splice(0, 1)[0]()
  if (arr.length > 0) await asyncFn(arr)
}

export function batchPromise(arr, step, callback) {
  if (arr.length <= step) {
    Promise.all(arr.map(i => i()))
      .then(() => {
        if (callback) callback()
      })
  } else {
    Promise.all(new Array(step).fill(null).map(() => asyncFn(arr)))
      .then(() => {
        if (callback) callback()
      })
  }
}

/*
batchPromise(new Array(30).fill(null).map(() => {
  return () => {
    let setTimeoutId = null
    return new Promise((resolve) => {
      setTimeoutId = setTimeout(() => {
        resolve()
      }, Math.random() * 10000)
    }).then(res => {
      console.log(setTimeoutId, '执行完了')
      clearTimeout(setTimeoutId)
    })
  }
}), 6, () => console.log('全部执行完毕哈哈哈'))
*/

/* eslint-enable */
export function obj_conversion(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') obj[key] = JSON.stringify(obj[key])
  }
  return obj
}

// 以下是结合一小时和半小时 动态传递cutt和num即可
// cutt = 24, num = 1 : 168个1或0的字符串代表七天的时间，每个1或者0表示1个小时，1代表连续，0代表不连续
// cutt = 48, num = 2 : 336个1或0的字符串代表七天的时间，每个1或者0表示半个小时，1代表连续，0代表不连续
export function initTime(n, num = 1) {
  // return `${String(Math.floor(n / 1)).padStart(2, '0')}:${n % 1 ? '60' : '00'}`
  return `${String(Math.floor(n / num)).padStart(2, '0')}:${n % num ? '30' : '00'}`
}

// 以多少长度切割  默认快手
// timeQuantum(str, true)  快手
// timeQuantum(str, false)  头条
export function timeQuantum(timeSeries = '', flag = true) {
  if (!timeSeries.length) return []
  let cutt = flag ? 24 : 48
  let num = flag ? 1 : 2
  // \d代表的意思是匹配数字 以cutt 为一组    g 全局匹配
  // 分组匹配全局cutt个数字的字符 为一组
  return timeSeries.match(new RegExp(`\\d{${cutt}}`, 'g')).map(s => {
    let i = 0
    let j = 0
    let ans = []
    while (i < s.length) {
      while (s[i] === s[j]) {
        j++
      }
      if (s[i] === '1') {
        ans.push(`${initTime(i, num)}-${initTime(j, num)}`)
      }
      i = j
    }
    return ans
  })
}

/**
 * @desc  输入框限制规则
 * @param maxLen 最大字数
 * @param minLen 最少字数
 * @returns {(function(*, *, *): void)|*}
 */
export function inputValidate(maxLen, minLen = -1, num = 2) {
  return (rule, value, callback) => {
    let len = 0
    for (let i = 0; i < value.length; i++) {
      // charCodeAt(字符在字符串中的下标)
      const c = value.charCodeAt(i)
      // 单字节(字母数字等)
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        len++
      } else {
        len += num
      }
    }
    if (len > maxLen) {
      callback(new Error(`内容长度小于等于${maxLen}，一个中文长度为${num}`));
      return
    }
    if (len < minLen) {
      callback(new Error(`内容长度必须大于等于${minLen},小于等于${maxLen}，一个中文长度为${num}`));
      return
    }
    callback()
  }
}

export function getStrLength(str) {
  const _str = str.replace(/\s/g, '');
  let lenth = 0
  for (let i = 0; i < _str.length; i++) {
    const c = _str.charCodeAt(i)

    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      lenth++;
    } else {
      lenth += 2;
    }
  }

  return lenth;
}

/**
 **@disc:名称替换
 **@date:2022/2/11 17:34
 **@author:郑勇
 **@params: name替换前的名称 replaceMap需要替换的关键字和值的map suffix名称的后缀 maxLength现在的最大长度
 */
export function getName({name, replaceMap, suffix, maxLength}) {
  const arr = name.match(/(?<=<)([^<>-]+)(?=>)/g)
  console.log({name, replaceMap, suffix, maxLength});
  console.log(arr);
  if (arr) {
    arr?.forEach(item => {
      if (replaceMap.get(item)) name = name.replace(`<${item}>`, replaceMap.get(item))
    })
  }
  if (maxLength) {
    if (suffix) {
      if (name.length + suffix.length > maxLength) name = name.slice(0, maxLength - suffix.length)
      name += suffix
    } else {
      if (name.length > maxLength) name = name.slice(0, maxLength)
    }
  }
  return name
}

/**
 **@disc:根据范围还有间隔和索引计算值(适用于梯度出价)
 **@date:2022/1/11 10:32
 **@author:郑勇
 **@params: range范围 step间隔 index索引
 */
export function inLieStepValue(range, step, index) {
  /*if (index === 0) return range[0]
  if (range[0] + step * index <= range[1]) return range[0] + step * index*/
  let i = 0
  let v = range[0]
  while (i < index) {
    v = ((v * (10 ** 3)) + step * (10 ** 3)) / (10 ** 3)
    if (v > range[1]) v = range[0]
    i++
  }
  return v
}

/**
 **@disc:获取指定范围内的随机数
 **@date:2022/1/11 10:52
 **@author:郑勇
 **@params: min 最小值 max最大值 decimal保留的小数位
 */
export function getRandom(min, max, decimal = 3) {
  return Math.ceil((min + Math.random() * (max - min)) * (10 ** decimal)) / (10 ** decimal);
}

/**
 * @description 处理千分位
 * @param {String} str - 待处理的金额
 * @author fengjin
 * @date 2022-03-62 11:24:30
 */
export function formatCash(str) {
  const match = String(str).match(/([+-]?)(\d+)((\.\d+)?%?)/);
  if (match === null) return str;

  match[2] = match[2].replace(/(?!^)(?=(\d{3})+$)/g, ',');
  return `${match[1]}${match[2]}${match[3]}`;
}

/**
 * @description 格式化文件大小（G、M、K）
 * @param {Number} size - 文件大小
 * @param {String} type - 单位（G、M、K）
 * @author fengjin
 * @date 2022-08-05 12:14:26
 */
export function formatFileSize(size = 0, type = 'M') {
  if (isNaN(parseFloat(size)) || parseFloat(size) === 0) {
    return '--';
  }

  return {
    G: () => (size / 1024 / 1024 / 1024).toFixed(2) + type,
    M: () => (size / 1024 / 1024).toFixed(2) + type,
    K: () => (size / 1024).toFixed(2) + type,
  }[type]();
}

// 使用canvas获取文本实际宽度
export function getActualWidthOfChars(text = '', options = {}) {
  const {size = 12, family = "Microsoft YaHei"} = options;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${size}px ${family}`;
  const metrics = ctx.measureText(text);
  return Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
}

// 根据某个属性获取某个数据(完整对象)
export function recursionFindObj(data, id, key = 'id') {
  let result = null;
  if (!data.length) {
    return;
  }
  for (let i of data) {
    // 已经找到了属性值所在的对象就终止循环,以免后面的循环覆盖result,导致出错
    // !!result
    if (!!result) break;
    if (i[key] === id) {
      result = i;
      break
    }
    if (i.children?.length) {
      result = recursionFindObj(i.children, id, key);
    }
  }
  return result;
}

// 获取树形结构所有id
// export function lookForAllId(data = [], arr = [], key = 'id') {
export function lookForAllId(data = [], key = 'id') {
  /* for (let item of data) {
     arr.push(item[key])
     if (item?.children?.length) lookForAllId(item.children, arr, key)
   }
   return arr*/
  return data.reduce((p, c) => {
    p.push(c[key])
    if (c?.children?.length) {
      p.push(...lookForAllId(c.children, key))
    }
    return p
  }, [])
}

// 把一维数组以n 为一组转为二维数组
// [1,2,3,4];//[[1,2],[3,4]]
export function convertToMultilayerArr(plies = 2, arr = []) {
  let newArr = [];
  for (let i = 0; i < arr.length;) {
    newArr.push(arr.slice(i, i += plies))
  }
  return newArr
}

/* eslint-disable */

// 清空对象中为空的属性
export function clearEmptyPro(data) {
  let curVal;
  let toString = Object.prototype.toString;
  let dataType = toString.call(data);
  if (data || dataType === "[object Number]" || dataType === "[object Boolean]") {
    switch (dataType) {
      case "[object Object]":
        if (Object.keys(data).length > 0) {
          let momObj = {};
          for (let key in data) {
            let value = clearEmptyPro(data[key]);
            let valueType = toString.call(value);
            valueType === "[object Boolean]" || valueType === "[object Number]" || value ? momObj[key] = value : "";
            /* if (valueType === "[object Object]" && !Object.keys(value).length) {
               Reflect.deleteProperty(momObj, key)
             }*/
          }
          curVal = momObj;
        } else {
          return;
        }
        break;
      case "[object Array]":
        if (data.length > 0) {
          let momValue = [];
          data.forEach((e) => {
            let value = clearEmptyPro(e);
            let valueType = toString.call(value);
            valueType === "[object Boolean]" || valueType === "[object Number]" || value ? momValue.push(value) : "";
          });
          momValue.length > 0 ? curVal = momValue : "";
        } else {
          return;
        }
        break;
      case "[object Boolean]":
      default:
        curVal = data;
        break;
    }
  } else {
    return;
  }
  return curVal;
}

/**
 * @description 图片URL转File文件
 * @author fengjin
 * @date 2022-09-09 11:11:23
 */
export function getImgFileFromUrl(url, scale = 0.5) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('链接不能为空'));
      return;
    }

    if (!isURL(url)) {
      reject(new Error('链接不正确'));
      return;
    }

    if (!isNumber(scale)) {
      reject(new Error('缩放系数必须为数字'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = value => {
      const width = img.width * scale;
      const height = img.height * scale;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        const file = new File([blob], `${Date.now()}${(Math.random() * 100000).toFixed()}.${blob.type.replace('image/', '')}`, {
          type: blob.type,
          lastModified: new Date(),
        }, 'image/png', 1);

        resolve(file);
      }, 'image/png', 1);
    };
    img.onerror = e => {
      reject(e);
    };
  });
}

/* eslint-enable */
