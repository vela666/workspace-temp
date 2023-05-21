/**
 * @description 校验电子邮箱地址
 * @param {String} email 邮箱地址
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-21 11:40:43
 */
export function isEmail(email) {
  // return /^[a-zA-Z0-9\u4e00-\u9fa5_-]+@[a-zA-Z0-9\u4e00-\u9fa5_-]+(\.[a-zA-Z0-9\u4e00-\u9fa5_-]+)+$/.test(email);
  return /^.+@.+$/.test(email);
}

/**
 * @description 校验 url 地址
 * @param {String} url
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-21 11:42:46
 */
export function isURL(url) {
  return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(url);
}

/**
 * @description 校验移动端
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-21 11:56:17
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}

/**
 * @description 校验手机号码
 * @param {String} phoneNumber 手机号码
 * @return {Boolean}
 * @author fengjin
 * @date 2021/7/21 13:07
 */
export function isPhoneNumber(phoneNumber) {
  return /^1[3-9][0-9]{9}$/.test(phoneNumber);
}

// 字母和数字算0.5个字符  中文算一个字符
export function strLength(str, mark = true) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len += 0.5
    } else {
      len++
    }
  }
  return mark ? Math.ceil(len) : len
}
