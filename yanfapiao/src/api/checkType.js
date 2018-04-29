import axios from 'axios'
import config from './config'

// axios(config);
/**
 * 查验发票(扫描和手动输入)
 * @param 
 * companyId	企业单位id（没有就传 companyId=""）
 * userId	用户id
 * relName	用户真实姓名
 * invoiceDataCode	发票代码
 * invoiceNumber	发票号码
 * billingTime	开票时间（字符串）
 * checkCode	校验码后6位
 * (token放到headers中传输,见最下面的备注)	令牌
 */
export function fpCheck (param) {
    config.data = param;
    // config.headers.Authorization = 'secret ' + localStorage.getItem("token");
    return axios.post('/appService/wxFpCheck/queryAppFpCheck',{},config);
}


/**
 *查验成功后消耗查验次数
 * userId	用户id
 * companyId	企业单位id（没有就传 companyId=""）
 * (token放到headers中传输)	令牌
 */
export function checkNum (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/updateAppFpUserCheckNum',{},config);
}

/**
 *查询地区服务接口
 * dictCode	地区编码
 */
export function getDictName (param) {
    config.headers.Authorization = 'secret ' + localStorage.getItem("token");
    return axios.get('/appService/wxFpCheck/getDictName?dictCode='+param,config);
}


	
