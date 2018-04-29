import axios from 'axios'
import VueAxios from 'vue-axios'
import config from './config'
import Vue from 'vue'

// axios(config);
/**
 * 判断微信用户是否绑定
 * @param 
 * code	微信认证返回的code 
 */
export function isBind (param) {
    config.data = param;
    return axios.post('/wxApp/isBind',{},config);
}


/**
 * 解除绑定
 * loginName	用户名
 * (token放到headers中传输)	令牌
 */
export function outBind (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/updateChangeBind',{},config);
}


/**
 * 获取用户信息
 * @param 
 * headers中传输的token	令牌 
 */
export function getUserInfo () {
    // config.params = {token: localStorage.getItem("token") ? localStorage.getItem("token") : ''};
    config.headers.Authorization = 'secret ' + localStorage.getItem("token");
    return axios.get('/appService/wxFpCheck/queryUserMsg?token=' + localStorage.getItem("token"),config);
}

/**
 * JS-SDK微信签名
 * @param 
 * url	当前页面路径location.href.split('#')[0]
 */
export function wxSign () {
    config.data = {url: location.href.split('#')[0]};
    config.headers.Authorization = 'secret ' + localStorage.getItem("token");
    // return axios.post('/appService/wxFpCheck/wxSign',{},config);
    axios.post('/appService/wxFpCheck/wxSign',{},config).then((data) => {
        data = data.data;
        if (data.result == 1) {
            Vue.wechat.config({
                debug: false,
                appId: data.rows.appId,
                timestamp: data.rows.timestamp,
                nonceStr: data.rows.nonceStr,
                signature: data.rows.signature,
                jsApiList: [
                  'checkJsApi',
                  'chooseImage',
                  'previewImage',
                  'uploadImage',
                  'downloadImage',
                  'startRecord',
                  'stopRecord',
                  'scanQRCode'
                ]
              });
              Vue.wechat.ready(function () {
                Vue.wechat.checkJsApi({
                  jsApiList: [
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'startRecord',
                    'stopRecord',
                    'scanQRCode'
                  ],
                  success: function (res) {
                    // console.log("checkJsApi---" + res);
                  }
                });
              });
              Vue.wechat.error(function (res) {
                console.log('wx.error--' + res);
              });
        }
        
    });
}

/**
 * 认证企业
 * userId	用户id
 *companyName	认证的公司名称
 *managerPhone	认证公司管理员的手机号
 *remarks	备注
 * (token放到headers中传输)	令牌
 */
export function insertComp (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/insertFpCompAuth',{},config);
}

	
