import axios from 'axios'
import config from './config'

// axios(config);
/**
 * 查询剩余查验次数
 * @param 
 * companyId	企业单位id（没有就传 companyId=""）
 * userId	用户id
 */
export function getCheckNum (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/queryAppFpUserCheckNum',{},config);
}


/**
 *根据用户id或发票id查询发票列表
 * @param 
 * userId	用户id
 * id	发票id
 * pageNo	页码序号
 * pageSize	页码大小 
 */
export function getFpInfo (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/queryFpRecordByUserIdOrFpId',{},config);
}

/**
 *查询查验平台
 * @param 
 * userId	用户id
 * id	发票id
 * pageNo	页码序号
 * pageSize	页码大小 
 */
export function getCheckFpInfo (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/queryCheckPtData',{},config);
}

/**
 *查询发票仓库
 * @param 
 * userId	用户id
 * id	发票id
 * pageNo	页码序号
 * pageSize	页码大小 
 */
export function getFpRepInfo (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/queryFpRepData',{},config);
}


/**
 *根据发票id查询发票信息
 * @param 
 * userId	用户id
 * id	发票id
 * pageNo	页码序号
 * pageSize	页码大小 
 */
export function getFpDetail (param) {
    config.headers.Authorization = 'secret ' + localStorage.getItem("token");
    return axios.get('/appService/wxFpCheck/queryFpMsgById?id='+param.id,config);
}
/**
 *根据发票id查询发票信息（发票仓库）
 * @param 
 * userId	用户id
 * id	发票id
 * pageNo	页码序号
 * pageSize	页码大小 
 */
export function getWareDetail (param) {
    config.headers.Authorization = 'secret ' + localStorage.getItem("token");
    return axios.get('/appService/wxFpCheck/queryFpMsgRepById?id='+param.id,config);
}


/**
 *通用字典接口
 * @param 
 * dicType: fpstate--查验所有状态标识  fptype--查验所有发票类型   
 */
export function getDictList (param) {
    config.headers.Authorization = 'secret ' + localStorage.getItem("token");
    return axios.get('/appService/wxFpCheck/getDictList?dicType='+param,config);
}

/**
 *凭证登记
 * @param 
 * mediaId	这里为上传成功到微信服务器后得到的serverId，多个图片用逗号拼接，见后面的备注
 * id	需要进行凭证登记的发票id
 * voucherCode	凭证编号
 * voucherDate	入账日期（字符串格式yyyy-mm-dd）
 * invoiceNumber	需要进行凭证登记的发票号码
 */
export function updateVouApp (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/updateVouApp',{},config);
}

/**
 *删除发票
 * @param 
 * ids	发票id（支持多个发票删除，多个用逗号拼接，一个就只传一个id）
 */
export function delFp (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/deleteMore',{},config);
}

/**
 *修改状态标识
 * @param 
 * fpId	发票id
 * status	修改后的状态(取通用字典查询的value值)
 */
export function changeFpStatus (param) {
    config.data = param;
    return axios.post('/appService/wxFpCheck/updateFpState',{},config);
}


	
