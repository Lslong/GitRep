<template>
    <div class="check-type" :style="{height:screenHeight+'px'}">
        <ul class="check-type-list">
            <li @click="scanIn">
                <div class="card-left scanIn-icon">

                </div>
                <div class="card-right">
                    <h4>扫描发票
                        <span>推荐</span>
                    </h4>
                    <p class="sub-title">扫描发票二维码，自动获取发票全量信息</p>
                    <p class="content-tips">支持验证发票类型：</p>
                    <div class="tips-item">
                        <span>纸质普票</span>
                        <span>纸质专票</span>
                        <span>电子普票</span>
                        <span>货运专票</span>
                        <span>机动车专票</span>
                    </div>
                </div>
                <!-- <span class="more-detail">详情</span> -->
            </li>
            <li @click="handleIn">
                <div class="card-left handleIn-icon">

                </div>
                <div class="card-right">
                    <h4>手动录入</h4>
                    <p class="sub-title">输入发票相关信息，获取发票全量信息</p>
                    <p class="content-tips">支持验证发票类型：</p>
                    <div class="tips-item">
                        <span>纸质普票</span>
                        <span>纸质专票</span>
                        <span>电子普票</span>
                        <span>货运专票</span>
                        <span>机动车专票</span>
                    </div>
                </div>
                <!-- <span class="more-detail">详情</span> -->
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import { Tab, TabItem, Sticky } from "vux";
import { wxSign,getUserInfo } from '../../api/common_service'
import { fpCheck, checkNum,getDictName } from "../../api/checkType";

export default {
    components: {
        Tab,
        TabItem,
        Sticky
    },
    data() {
        return {
            screenHeight: screen.height,
            fpArr: '',
        };
    },
    created() {
        this.getUserInfo();
        //获取微信签名
        wxSign();
    },
    methods: {
        getUserInfo() {
            //判断是否登录
            var token = localStorage.getItem("token");
            if (!token) {
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: '请重新登录'
                });
                this.$router.push({
                    path: `/login`
                });
                return false;
            }

            getUserInfo().then((data) => {
                data = data.data;        //axios返回值 放在data里
                
                if (data.result == 0) {
                    this.$vux.toast.show({
                        type: "text",
                        position: "middle",
                        width: "auto",
                        text: '请重新登录'
                    });
                    this.$router.push({
                        path: `/login`
                    });
                }else {
                    this.userObj = data;
                    localStorage.setItem('openId',data.OPENID);
                }
                },(err) => {

                }
            );
        },
        //扫描输入
        scanIn () {
            this.scanQRCode();
            // this.$router.push({
            //     path: `/invoiceDetail/1/01,04,1200153320,07041662,183.49,20151221,83623873463907646339,5080,`
            // });
        },
        //手动输入
        handleIn () {
            this.$router.push({
                path: `/handleForm`
            });
        },
        //调用微信扫一扫
        scanQRCode () {
            this.$wechat.scanQRCode({
                desc: 'scanQRCode desc',
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: (res) => {
                    
                    // 回调
                    // alert(res.resultStr);
                    if (res != null && res.resultStr) {
                        this.$vux.loading.show({
                            text: '查询中...'
                        });
                        var fpStr = res.resultStr;
                        // alert(fpStr);
                        
                        // alert(JSON.stringify(this.fpArr));
                        if (fpStr.indexOf(',') == -1) {
                            this.$vux.loading.hide();
                            this.$vux.alert.show({
                                title: '查验结果',
                                content: '非发票二维码',
                                onShow () {},
                                onHide () {}
                            });
                        }else {
                            var fp = fpStr.split(',');
                            //获取地区汉字
                            this.getDictNameFun (fp);
                        }
                    }else {
                        this.$vux.toast.show({
                            type: "text",
                            position: "middle",
                            width: "auto",
                            text: '非发票二维码'
                        });
                    }
                },
                error: (res) => {
                    if(res.errMsg.indexOf('function_not_exist') > 0){
                        alert('版本过低请升级')
                        }
                }
            });
        },
        //获取地区汉字
        getDictNameFun (fp) {
            var invoicedatacode = fp[2];
            if (!fp[2]) {
                this.$vux.alert.show({
                    title: '查验结果',
                    content: '非发票二维码',
                    onShow () {},
                    onHide () {}
                });
                return false;
            }

            var fpareaCode = '';
            console.log(invoicedatacode);
            console.log(invoicedatacode.length);
            if (invoicedatacode && invoicedatacode.length == 10 ){
                fpareaCode =  invoicedatacode.substr(0,4);  
                console.log(fpareaCode);   
            } 
            if (invoicedatacode && invoicedatacode.length == 12 ){
                fpareaCode =  invoicedatacode.substr(1,4);
                console.log(fpareaCode);   
            } 
            
            getDictName(fpareaCode).then((data) => {
                data = data.data;
                if (data.result == 1) {
                    //查验发票
                    this.fpCheck(fp,data.rows.dictName);
                }else {
                    this.$vux.loading.hide();
                    this.$vux.toast.show({
                        type: "text",
                        position: "middle",
                        width: "auto",
                        text: '请求数据失败，请稍后重试!'
                    });
                }
            },(err) => {

            });
        },
        //验证发票
        fpCheck (fp,area) {
            // fp = fp.split(',');
            if (fp.length >= 7) {
                var dateVal = fp[5].slice(0,4) + '-' + fp[5].slice(4,6) + '-' + fp[5].slice(6);//开票时间格式 2018-04-01
                var checkCode = fp[6] ? fp[6].slice(-6) : '';//校验码
                var totalAmount = fp[4] ? fp[4] : '';//开具金额
            }else {
                this.$vux.loading.hide();
                this.$vux.alert.show({
                    title: '查验结果',
                    content: '非发票二维码',
                    onShow () {},
                    onHide () {}
                });
                return false;
            }

            //是否信息不全 跳转至手动输入  校验码和开具金额同时为空
            if (!fp[5] || (!fp[6] && !fp[4])) {
                this.$vux.loading.hide();
                this.$vux.alert.show({
                    title: '查验结果',
                    content: '扫描信息不全，请手动补全',
                    onShow () {},
                    onHide () {}
                });

                dateVal = fp[5] ? dateVal : '';
                checkCode = fp[6] ? checkCode : '';
                totalAmount = fp[4] ? totalAmount : '';

                this.$router.push({
                    name: "handleForm",
                    params: {
                        invoiceDataCode: fp[2],
                        invoiceNumber: fp[3],
                        dateVal: dateVal,
                        checkCode: checkCode,
                        totalAmount: totalAmount,
                    }
                });
                return false;
            }

            fpCheck({
                companyId: this.userObj.COMPANYID ? this.userObj.COMPANYID : '',
                userId: this.userObj.USERID,
                relName: this.userObj.RELNAME,
                invoiceDataCode: fp[2],
                invoiceNumber: fp[3],
                // billingTime: '2018-03-24',
                // checkCode: '483766'
                billingTime: dateVal,
                checkCode: checkCode,
                totalAmount: totalAmount,
                area: area
            }).then((data) => {
                data = data.data;        //axios返回值 放在data里
                // alert(data.result);
                if (data.result == 1) {
                    let fpId = data.rows.id;
                    //消耗一次查验次数
                    this.addCheckNum(fpId);
                } else {
                    this.$vux.loading.hide();
                    this.$vux.alert.show({
                        title: '查验结果',
                        content: data.msg,
                        onShow () {},
                        onHide () {}
                    });
                }
            },(err) => {
                    this.$vux.loading.hide();
                    this.$vux.toast.show({
                        type: "text",
                        position: "middle",
                        width: "auto",
                        text: '请求数据失败，请稍后重试!'
                    });
                }
            );
        },
        //消耗查验次数
        addCheckNum (fpId) {
            checkNum({
                companyId: this.userObj.COMPANYID ? this.userObj.COMPANYID : '',
                userId: this.userObj.USERID
            }).then((data) => {
                this.$vux.loading.hide();
                data = data.data;        //axios返回值 放在data里
                // alert(data.result);
                if (data.result == 1) {
                    this.$vux.alert.show({
                        title: '查验结果',
                        content: '验证成功，点击查看详情',
                        onShow () {},
                        onHide () {}
                    });
                    this.$router.push({
                        path: `/invoiceDetail/2/${fpId}`
                    });
                    // this.$router.push({
                    //     path: `/homePage/totalRecord`
                    // });
                }else {
                    this.$vux.alert.show({
                        title: '查询结果',
                        content: data.msg,
                        onShow () {},
                        onHide () {}
                    });
                }
            }, (err) => {
                this.$vux.loading.hide();
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: '请求数据失败，请稍后重试!'
                });
            });
        }
    }
};
</script>

<style lang="less">
li {
    list-style: none;
}
.clearfix:after {
    content: "";
    display: block;
    clear: both;
}
// 扫描类型
.check-type {
    overflow: hidden;
    // background-color: rgba(21,39,85, 0.8)
    // background-color: #232940;
    background-color: #2882AD;
    padding-top: 30px;
    box-sizing: border-box;
}
.check-type-list li {
    list-style: none;
    background: #fff;
    border-radius: 0.5rem;
    width: 95%;
    // height: 16rem;
    height: 18rem;
    // margin: 5rem auto;
    margin: 4rem auto;
    box-sizing: border-box;
    padding: 3rem 1rem;
    position: relative;
}
.card-left {
    float: left;
    width: 20%;
    height: 10rem;
}
.card-right {
    float: right;
    width: 75%;
    height: 10rem;
    h4 {
        font-size: 1.5rem;
        // margin-bottom: 0.5rem;
        margin-bottom: 1rem;
        span {
            display: inline-block;
            text-align: center;
            font-size: 1.3rem;
            width: 5rem;
            color: #fff;
            background-color: #ff685d;
            border-radius: 2rem;
        }
    }
    .sub-title {
        font-size: 1.3rem;
        font-weight: 700;
        color: #0b0b0b;
        // margin-bottom: 0.5rem;
        margin-bottom: 1rem;
    }
    .content-tips {
        color: #999;
        margin-bottom: 0.4rem;
    }
    .tips-item {
        color: #999;
    }
    .tips-item span {
        display: inline-block;
        width: 2.8rem;
        border: 1px solid #ddd;
        border-radius: 0.2rem;
        box-sizing: border-box;
        text-align: center;
        // padding: .3rem;
    }
    .tips-item span:last-child {
        width: 4rem;
    }
}
.scanIn-icon {
    background: url("../../assets/checkType/scan_in.png") no-repeat center top;
    background-size: 5rem 5rem;
}
.handleIn-icon {
    background: url("../../assets/checkType/handle_in.png") no-repeat center top;
    background-size: 5rem 5rem;
}
.more-detail {
    position: absolute;
    bottom: 1.5rem;
    right: 1rem;
    color: #3879d9;
}
</style>