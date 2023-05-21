import axios from 'axios';
import NProgress from 'nprogress';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getToken, TOKEN_KEY, removeToken} from '@/utils/auth';
import store from '@/store'
import Qs from 'qs';

// axios.defaults.baseURL = process.env.VUE_APP_BASE_API; // API 请求的默认前缀
// axios.defaults.withCredentials = true; // 跨域请求时是否需要使用 cookies 凭证
// axios.defaults.headers.common.Authorization = 'AUTH_TOKEN';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// 用于保存请求的参数 较慢接口
let pending = []

let elMsg = null
// 取消请求构造函数
let CancelToken = axios.CancelToken
// 取消还未响应的请求
let cancelPending = config => {
  pending.forEach((item, index) => {
    // 判断请求地址是否一致
    if (item.url === config.url) {
      // 取消请求方法
      // item.cancel('频率过快,请稍等...')
      item.cancel(null)
      // 移除当前请求记录
      pending.splice(index, 1)
    }
  })
}

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 50000,
  paramsSerializer: function (params) {
    // console.log(params, Qs.stringify(params, {arrayFormat: 'brackets'}));
    return Qs.stringify(params, {arrayFormat: 'brackets'});
  },
});

// 异常拦截处理器
const errorHandler = error => {
  NProgress.done();
  elMsg && elMsg.close()
  let txt = error.message === 'Network Error' ? '网络出错' : error.message
  if (txt) {
    elMsg = ElMessage.error(txt);
  }
  return Promise.reject(error);
};

// 添加请求拦截器
request.interceptors.request.use(config => {
  NProgress.start();

  // 移除参数值为 null 的字段
  if (config.data) {
    Object.keys(config.data).forEach(key => {
      if (config.data[key] === null) Reflect.deleteProperty(config.data, key);
    });
  }

  if (store.getters.token) {
    config.headers[TOKEN_KEY] = getToken();
  }
  /**
   * @description 会重复转码，之前利用这里解决问题的发现异常及时沟通
   * 通过实例的paramsSerializer里利用qs插件处理
   * @author fengjin
   * @date 2022-04-18 15:14:57
   */
  // 解决特殊字符(如: [] )没有转义导致报错
  // if (config.method === 'get' && config.params) {
  //   let reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
  //   Object.keys(config.params).forEach(k => {
  //     if (reg.test(config.params[k])) {
  //       config.params[k] = encodeURI(config.params[k])
  //     }
  //   })
  // }
  // 是否唯一请求
  if (config.data?.UNIQUE_REQ || config.params?.UNIQUE_REQ) {
    // post
    if (config.data?.UNIQUE_REQ) {
      Reflect.deleteProperty(config.data, 'UNIQUE_REQ')
    }
    // get
    if (config.params?.UNIQUE_REQ) {
      Reflect.deleteProperty(config.params, 'UNIQUE_REQ')
    }
    // 把请求参数传进去 实参 用于取消重复请求
    cancelPending(config)
    // 实例化取消请求函数
    config.cancelToken = new CancelToken(res => {
      pending.push({
        url: config.url,
        cancel: res
      })
    })
  }
  return config;
}, errorHandler)

/**
 *  添加响应拦截器
 * code - 4999  token 过期或无效
 * code - 0     成功
 * code - 10002 该用户不存在或密码错误
 * code - 1000  密码长度必须在6~30
 * @author fengjin
 * @date 2021-09-28 10:52:08
 */
const no_message = [
  'tt-assets-material/getTtMaterialIdByAssetsId',
  'tt-assets-material/getVideoCover',
  '/tt-programmatic-create/checkJointDebugOne',
  '/tt-programmatic-create/checkJointDebugTwo',
  '/tt-assets-app-extend-package/checkAppExtendPackage',
  '/sys-project/delProjectRoleUser',
  'ks-assets-material/getKsMaterialIdByAssetsId',
  'ks-assets-material/getKsVideoCover',
  '/ad-report/exportAdReport',
  '/abroad-ad-report/exportAdReport',
  '/asset-report/exportAssetsReport',
  '/abroad-asset-report/exportAssetReport',
  '/tt-programmatic-create/handleTargetTags',
  'ks-programmatic-create/handleTargetTags',
  '/sys-user/auth/login',
  '/gg-youtube-info/uploadVideoToYouTube',
  '/gg-youtube-info/checkVideoStatus',
  '/asset-property-report/exportAssetPropertyReport',
  '/abroad-asset-property-report/exportAssetPropertyReport',
]
request.interceptors.response.use(res => {
  NProgress.done();
  // 把响应参数传递进去 删除响应的url
  if (pending.some(item => item.url === res.config.url)) {
    cancelPending(res.config)
  }
  // 对响应数据做点什么
  const result = res.data;
  // 对部分接口不需要错误提示
  const url = res.config.url

  if (!no_message.includes(url)) {
    if (result.code === 4999) { // 登录过期
      removeToken();
      window.location.href = `${process.env.VUE_APP_PUBLIC_PATH}login?redirect=${window.location.pathname}`;
    } else if (result.code === 4998) { // 批量操作部分成功部分失败提示
      let messageHtml = `<div class="title">${result.message}</div><div class="content">`;
      result.data.forEach(item => {
        messageHtml += `<div class="content-item">${item}</div>`;
      });
      messageHtml += '</div>'
      ElMessage({
        type: 'warning',
        duration: 0,
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: messageHtml,
        'custom-class': 'batch-operation-message'
      });
    } else if (result.code === 4888) {
      ElMessageBox.alert(result.message, '提示', {
        confirmButtonText: '知道了',
      });
    } else if (result.code >= 5000 && result.code <= 10000) {
      ElMessage({
        type: 'warning',
        message: result.message,
      });
    } else if (result.code !== 0) {
      ElMessage({
        type: 'error',
        message: result.message,
      });
    }
  }

  if (res.config.responseType === 'blob') {
    return new Promise((resolve, reject) => {
      if (res.headers['content-type']?.includes('octet-stream')) {
        return resolve(res.data);
      } else {
        return reject(res.data);
      }
    });
  }

  // 只有 code 状态为 0 的时候才走 then 回调
  return new Promise(((resolve, reject) => {
    if (result.code === 0) resolve(result)
    reject(result)
  }));
}, errorHandler);

export default request;
