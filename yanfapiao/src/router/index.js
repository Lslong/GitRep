import Vue from 'vue'
import Router from 'vue-router'

import PrePage from '@/components/prePage/prePage'
import Mine from '@/components/mine/mine'
import ChangePsw from '@/components/changePsw/changePsw'
import Page500 from '@/components/page500/page500'
import Login from '@/components/login/login'
import Register from '@/components/register/register'
import CheckHome from '@/components/checkHome/checkHome'
import InvoiceDetail from '@/components/invoiceDetail/invoiceDetail'
import HandleForm from '@/components/handleForm/handleForm'

import HomePage from '@/components/homePage/homePage'
import CheckType from '@/components/checkType/checkType'
import TotalRecord from '@/components/totalRecord/totalRecord'
import CheckPlatform from '@/components/checkPlatform/checkPlatform'
import FpWarehouse from '@/components/fpWarehouse/fpWarehouse'
import ToConfirm from '@/components/toConfirm/toConfirm'
import FpCheckIn from '@/components/fpCheckIn/fpCheckIn'
import WareDetail from '@/components/wareDetail/wareDetail'



Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/prePage',
        },
        {   //引导页
            path: '/prePage',
            name: 'prePage',
            component: PrePage
        },
        {   //我的 页面
            path: '/mine',
            name: 'mine',
            component: Mine
        },
        {   //修改 页面
            path: '/changePsw/:loginName/:userId',
            name: 'changePsw',
            component: ChangePsw
        },
        {   //500页
            path: '/page500',
            name: 'page500',
            component: Page500
        },
        {   //登陆页
            path: '/login/:state',
            name: 'login',
            component: Login
        },
        {   //注册页
            path: '/register',
            name: 'register',
            component: Register
        },
        {   //主页
            path: '/homePage',
            name: 'homePage',
            component: HomePage,
            children: [
                {   //验证方式
                    path: 'checkType',
                    component: CheckType
                },
                {   //历史记录
                    path: 'totalRecord',
                    component: TotalRecord
                },
            ]
        },
        {
            path: '/checkHome/:isShow',
            name: 'checkHome',
            component: CheckHome,
            // children: [
            //     {
            //         path: ':type/:id',
            //         component: InvoiceDetail
            //     }
            // ]
        },
        {   //发票详情页
            path: '/invoiceDetail/:type/:id',   //type:1-扫描进入 2-列表页进入
            name: 'invoiceDetail',
            component: InvoiceDetail
        },
        {   //发票仓库详情页
            path: '/wareDetail/:id',  
            name: 'wareDetail',
            component: WareDetail
        },
        {   //手动录入页
            path: '/handleForm',
            name: 'handleForm',
            component: HandleForm
        },
        {   //查验平台
            path: '/checkPlatform',
            name: 'checkPlatform',
            component: CheckPlatform
        },
        {   //发票仓库
            path: '/fpWarehouse',
            name: 'fpWarehouse',
            component: FpWarehouse
        },
        {   //企业认证
            path: '/toConfirm',
            name: 'toConfirm',
            component: ToConfirm
        },
        {   //凭证登记
            path: '/fpCheckIn/:id/:invoiceNumber',
            name: 'fpCheckIn',
            component: FpCheckIn
        },
    ]
})
