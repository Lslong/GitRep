import Qs from 'qs'
export default {

    //请求的接口，在请求的时候，如axios.post(url,config);这里的url会覆盖掉config中的url
    url: '',
    // 基础url前缀
    baseURL: 'http://www.lhtestwx.com/jeesite',
    // baseURL: 'http://w.hklhjy.com/jeesite',
    method: 'POST',

    transformRequest: [function (data) {
        //由于使用的form-data传数据所以要格式化
	    data = Qs.stringify(data);
        return data;
    }],


    transformResponse: [function (data) {

        return data;
    }],

    // `headers` 是即将被发送的自定义请求头
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' ,
        'Authorization': 'secret ' + (localStorage.getItem("token") ? localStorage.getItem("token") : '')
    },


    params: {
        
    },


    paramsSerializer: function (params) {
        return Qs.stringify(params)
    },


    data: {
        
    },


    timeout: 0,


    withCredentials: false, // default


    responseType: 'json', // default



    onUploadProgress: function (progressEvent) {
        // Do whatever you want with the native progress event
    },


    onDownloadProgress: function (progressEvent) {
        // Do whatever you want with the native progress event
    },


    maxContentLength: 2000,


    validateStatus: function (status) {
        return status >= 200 && status < 300; // default
    },


    maxRedirects: 5, // default
}
