import axios from 'axios'
import config from './config'

// axios(config);
//登陆
export function login (param) {
    config.data = param;
    return axios.post('/wxApp/wxLogin',{},config);
}

//注册
export function register (param) {
    config.data = param;
    return axios.post('/wxApp/wxRegister',{},config);
}

//修改密码
export function changePwd (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/modifyPwdApp',{},config);
}

	
