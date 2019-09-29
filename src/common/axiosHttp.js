/**
 * axios封装
 * 
 */
import axios from 'axios';
import router from '../router';
import store from '../store/index';
import { Message, Loading } from "element-ui";
import _ from 'lodash';
import _vue from '@/main'

let loadingRequestCount = 0;
let loadingInstance;
/** 
 * 跳转登录页
 * 
 */
const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
}

/**
 * 提示函数
 * @param {*} msg 
 * 
 */
const tip = (msg) => {
    Message.closeAll()
    Message({
        showClose: true,
        center: true,
        message: msg || '',
        type: 'error'
    });
}

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        // 401: 跳转登录页
        case 401:
            toLogin();
            break;
        case 403:
            tip('权限不足，请联系管理员')
            break;
        case 404:
            tip('请求的资源不存在')
            break;
        case 500:
            tip('服务器异常，请稍后重试')
        default:
            console.log(other);
    }
}
// 显示loading
const showLoading = (config) => {
    if (loadingRequestCount === 0) {
        loadingInstance = Loading.service({ target: '.el-table'});
    }
    loadingRequestCount++
  }
// 隐藏loading
const hideLoading = () => {
    if (loadingRequestCount <= 0) return
    loadingRequestCount--
    if (loadingRequestCount === 0) {
        _vue.$nextTick(()=>{//以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
        });
    }
  }

// 创建axios实例
var instance = axios.create({
    timeout: 1000 * 60,
    baseURL: process.env.API_ROOT // 该有的环境地址
    // baseURL: 'https://testwmsgw.brandslink.com:8444'
});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/** 
 * 请求拦截器 
 * 
 */
let loadingInstanceObj = {} // 所有loading实例数组
let CancelToken = axios.CancelToken
let source = CancelToken.source()
instance.interceptors.request.use(
    config => {
        config.cancelToken = source.token // 取消请求
        if(config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
            config.cancelObj.cancel('中断请求');
            delete config.cancelObj;
        }
        if (!navigator.onLine) { // 断网提示
            source.cancel('网络故障，请检查!')
        }
        // 登录页 和 有进来就有弹窗的到货质检不要loading效果
        // if(!(_vue.$el.baseURI.indexOf('ArrivalCheck')>0 || _vue.$el.baseURI.indexOf('ReturnCheck')>0 || _vue.$el.baseURI.indexOf('Login')>0 )){
        //     showLoading(config)
        // }
        const token = store.state.token || localStorage.getItem('token');
        const platformType = store.state.platformType || localStorage.getItem('platformType');
        token && (config.headers.token = token)
        platformType && (config.headers.platformType = platformType)
        return config;
    },
    error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    res => {
        setTimeout(() => {
            hideLoading()
        }, 200);
        if (loadingInstanceObj[res.config['ts']]) {
            delete loadingInstanceObj[res.config['ts']]
        }
        if (!Object.keys(loadingInstanceObj).length) { // 解决请求"暂无数据"的显示问题
            if (window.emptyDomArr && window.emptyDomArr.length) {
                for (let item of window.emptyDomArr) item.innerHTML = '暂无数据'
            }
        }
        if (res.data.errorCode == "100406" || res.data.type === "application/json") {
            tip(res.data.msg)
            toLogin();
        } else if (res.data.errorCode !== '100200' && res.data.errorCode !== '100501') { // res.data.errorCode == '100400' || res.data.errorCode == '100500'
            if (res.data.type !== "application/vnd.ms-excel"){  //导出excel的情况
                tip(res.data.msg)
            }  
        }
        if (res.headers.token) {//保存token
            store.commit('SET_TOKEN', res.headers.token)
            store.commit('SET_platformType', res.headers.platformType)
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("platformType", res.data.platformType)
        }
        if (res.data.data === null) { // 解构默认值使用
            res.data.data = undefined
        }
        if (res.data.msg === undefined) { // 提示默认值
            res.data.msg = ''
        }
        return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res.data)
    },
    // 请求失败
    error => {
        hideLoading()
        if (window.emptyDomArr && window.emptyDomArr.length) {
            for (let item of window.emptyDomArr) item.innerHTML = '暂无数据'
        }
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围 
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理其他的情况
            if (error.message) { // 取消请求的message
                tip(error.message)
            } else {
                tip('服务故障，请检查！')
            }
            return Promise.resolve({}) // 解决业务解构报错
        }
    });

export default instance;
