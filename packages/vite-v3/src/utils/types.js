/**
 * @description 获取对象的数据类型字符串
 * @param {Object} obj
 * @returns {String}
 * @author fengjin
 * @date 2021-07-22 09:23:35
 */
const getType = obj => Object.prototype.toString.call(obj);

/**
 * @description 判断数据是不是布尔
 * @date 2022-01-12
 */
export function isBoolean(val) {
  return getType(val) === '[object Boolean]'
}

/**
 * @description 判断是不是DOM数据类型
 * @date 2022-01-12
 */
export function isDOMStringMap(val) {
  return getType(val) === '[object DOMStringMap]'
}

/**
 * @description 判断函数类型
 * @param {Object} fn
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-22 09:38:10
 */
export function isFunction(fn) {
  return getType(fn) === '[object Function]';
}

/**
 * @description 判断字符串类型
 * @param {Object} str
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-22 09:40:10
 */
export function isString(str) {
  return getType(str) === '[object String]';
}

/**
 * @description 判断是否是合法数字类型
 * @author fengjin
 * @date 2022-09-09 10:01:09
 */
export function isNumber(num) {
  return getType(num) === '[object Number]';
}

/**
 * @description 判断对象类型
 * @param {Object} obj
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-22 09:42:02
 */
export function isObject(obj) {
  return getType(obj) === '[object Object]';
}

/**
 * @description 判断 HtmlElement
 * @param {Object} node
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-22 09:44:58
 */
export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}
