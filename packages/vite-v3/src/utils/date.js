import dayjs from 'dayjs';
/**
 * @description 根据开始时间和结束时间计算剩余天数
 * @param endDate
 * @author fengjin
 * @date 2021-08-13 11:46:53
 */
export function expiryTimeLeft(endDate) {
  const now = Date.now();
  const end = (new Date(endDate.replace(/-/g, '/'))).getTime();

  if (now >= end) {
    return 0;
  }

  return Math.ceil(((end - now) / (24 * 60 * 60 * 1000)));
}
export const doHandleMonth = (month) => {
  let m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
export const getDay = (day) => { // 获取多少天后的时间
  const today = new Date()

  const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day

  today.setTime(targetday_milliseconds)

  const tYear = today.getFullYear()
  let tMonth = today.getMonth()
  let tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}

/**
 * @description 格式化日期时间
 * @param {String} dateStr - 指定日期时间
 * @param {String} separator - 分隔符
 * @param {String} formatter - 格式，默认：yyyy-MM-dd HH:ss:mm
 * @author fengjin
 * @date 2021-11-08 10:26:30
 */
export function dateFormatter(dateStr = '', separator = '', formatter = 'yyyy-MM-dd HH:ss:mm') {
  const _date = dateStr ? new Date(dateStr) : new Date();
  const _formatter = {
    yyyy: _date.getFullYear(),
    MM: (_date.getMonth() + 1).toString().padStart(2, '0'),
    dd: _date.getDate().toString().padStart(2, '0'),
    HH: _date.getHours().toString().padStart(2, '0'),
    ss: _date.getMinutes().toString().padStart(2, '0'),
    mm: _date.getSeconds().toString().padStart(2, '0'),
    SSS: _date.getMilliseconds(),
  };

  return formatter.split(' ').map((item, index) => {
    if (index === 0) return item.split('-').map(item => _formatter[item]).join(separator);
    return item.split(':').map(item => _formatter[item]).join(separator === '' ? '' : ':');
  }).join(separator === '' ? '' : ' ');
}

// 将时间转化成：X秒/分/时前
export function timeFormatter(dateStr = '') {
  const _date = dateStr ? new Date(dateStr) : new Date();
  let timeStamp = _date.getTime();
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let now = new Date().getTime();
  let diffVal = now - timeStamp;

  let result = "";
  if (diffVal < 0) {
    result = "";
  }
  let minVal = diffVal / minute;
  let hourVal = diffVal / hour;
  let dayVal = diffVal / day;
  let monthVal = diffVal / month;

  if (dayVal >= 1 && (dayVal <= 6 || (dayVal > 6 && monthVal < 1))) {
    result = " " + parseInt(dayVal) + "天前"
  } else if (hourVal >= 1 && hourVal <= 23) {
    result = " " + parseInt(hourVal) + "小时前"
  } else if (minVal >= 1 && minVal <= 59) {
    result = " " + parseInt(minVal) + "分钟前"
  } else if (diffVal >= 0 && diffVal <= minute) {
    result = " " + parseInt(diffVal / 1000) + '秒前'
  } else {
    result = dayjs(dateStr).format('YYYY-MM-DD hh:mm:ss');
  }

  return result;
}
