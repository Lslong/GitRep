<template>
    <div class="check-home">
        <div style="height:44px;">
            <sticky ref="sticky" :check-sticky-support="false">
                <tab :line-width="2" active-color="#00bbee">
                    <tab-item :selected="isShow == 0" @on-item-click="handler">选择验证方式</tab-item>
                    <tab-item :selected="isShow == 1" @on-item-click="handler">全部记录</tab-item>
                </tab>
            </sticky>
        </div>
        <!-- 选择验证方式 -->
        <div class="check-type" v-show="isShow == 0" v-bind:style="{height:screenHeight-44+'px'}">
            <ul class="check-type-list">
                <li @click="scanIn">
                    <div class="card-left scanIn-icon">
                        
                    </div>
                    <div class="card-right">
                        <h4>扫描发票 <span>推荐</span> </h4>
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
                    <span class="more-detail">详情</span>
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
                    <span class="more-detail">详情</span>
                </li>
            </ul>
            
        </div>
        <!-- 全部记录 -->
        <div class="record-total" v-show="isShow == 1" v-bind:style="{minHeight:screenHeight-44+'px'}">
            <search
            v-model="keyWord"
            position="fixed"
            auto-scroll-to-top top="44px"
            cancel-text="取消"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="search" style="position:fixed"></search>
            <span @click="selectRight" class="select-btn">筛选</span>
            <div>
                <popup v-model="isSelect" position="right" width="80%">
                    <div style="width:100%;margin:0 auto;">
                        <div class="box">
                            <ul class="select-list">
                                <li>
                                    <h2 class="select-item-title">验证日期</h2>
                                    <checker v-model="checkTime" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
                                        <checker-item value="1">近7天</checker-item>
                                        <checker-item value="2">近30天</checker-item>
                                        <checker-item value="3">近90天</checker-item><br>
                                    </checker>
                                    <group style="display:inline-block;vertical-align:middle">
                                        <datetime v-bind:class="{dataSelected: !checkTime}" v-model="checkTimeStart" @on-confirm="getCheckStart" :end-date="nowData">
                                            {{checkTimeStart}}
                                        </datetime>
                                    </group>
                                    <span style="vertical-align:middle;">--</span>
                                    <group style="display:inline-block;vertical-align:middle">
                                        <datetime v-bind:class="{dataSelected: !checkTime}" v-model="checkTimeEnd" @on-confirm="getCheckEnd" :end-date="nowData">
                                            {{checkTimeEnd}}
                                        </datetime>
                                    </group>  
                                </li>
                                <li>
                                    <h2 class="select-item-title">发票日期</h2>
                                    <checker v-model="sendTime" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
                                        <checker-item value="1">近7天</checker-item>
                                        <checker-item value="2">近30天</checker-item>
                                        <checker-item value="3">近90天</checker-item><br>
                                    </checker>
                                    <group style="display:inline-block;vertical-align:middle">
                                        <datetime v-bind:class="{dataSelected: !sendTime}" v-model="sendTimeStart" @on-confirm="getSendStart" :end-date="nowData">
                                            {{sendTimeStart}}
                                        </datetime>
                                    </group>
                                    <span style="vertical-align:middle;">--</span>
                                    <group style="display:inline-block;vertical-align:middle">
                                        <datetime v-bind:class="{dataSelected: !sendTime}" v-model="sendTimeEnd" @on-confirm="getSendEnd" :end-date="nowData">
                                            {{sendTimeEnd}}
                                        </datetime>
                                    </group>  
                                    
                                </li>
                                <li>
                                    <h2 class="select-item-title">发票类型</h2>
                                    <checker v-model="invoiceType" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
                                        <checker-item value="1">纸质专票</checker-item>
                                        <checker-item value="2">纸质普票</checker-item>
                                        <checker-item value="3">电子发票</checker-item>
                                        <checker-item value="">全部</checker-item>
                                    </checker>
                                </li>
                                <li>
                                    <h2 class="select-item-title">验真状态</h2>
                                    <checker v-model="realStatus" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
                                        <checker-item value="1">未验真</checker-item>
                                        <checker-item value="2">验真通过</checker-item>
                                        <checker-item value="3">发票有误</checker-item>
                                        <checker-item value="">全部</checker-item>
                                    </checker>
                                </li>
                            </ul>
                            <flexbox>
                                <flexbox-item>
                                    <div class="clean-btn" @click="clearItems">清空筛选</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="submit-btn" @click="submitItems">确认筛选</div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                    </div>
                </popup>
            </div>
            <!-- 全部记录列表 -->
            <ul class="record-total-list">
                <li class="record-total-item" v-for="item in invoiceList" :key="item.gid" @click="toDetail(item)">
                    <i class="cicle top-left"></i>
                    <i class="cicle top-right"></i>
                    <i class="cicle bottom-left"></i>
                    <i class="cicle bottom-right"></i>
                    <p class="item-title">{{item.checkTime}}（1张） </p>
                    <div class="invoice-content">
                        <div class="invoice-type-left">电子发票</div>
                        <div class="invoice-detail-right">
                            <p><span class="detail-title">开票日期：</span><span class="detail-con">{{item.sendTime}}</span></p>
                            <p><span class="detail-title">代码：</span><span class="detail-con">{{item.code}}</span></p>
                            <p><span class="detail-title">号码：</span><span class="detail-con">{{item.number}}</span></p>
                            <p><span class="detail-title">销售方：</span><span class="detail-con">{{item.saler}}</span></p>
                            <p><span class="detail-title">价税合计：</span><span class="detail-con">￥{{item.tax}}</span></p>
                        </div>
                    </div>
                    <p class="item-footer">2017/07/03日 进行验证</p>
                </li>
            </ul>
            <p class="footer-info clearfix">
                <span class="footer-info-lf">累计扫描发票共 <em>2</em> 张</span>
                <span class="footer-info-rt">剩余 <em>29</em> 张</span>
            </p>
        </div>
    </div>
</template>

<script>
import { Tab, TabItem, Sticky, Search, Popup, Checker, CheckerItem, Flexbox, FlexboxItem, Group, Datetime } from "vux";
export default {
    components: {
        Tab,
        TabItem,
        Sticky,
        Search,
        Popup,
        Checker,
        CheckerItem,
        Flexbox,
        FlexboxItem,
        Group,
        Datetime
    },
    data() {
        return {
            isShow: "0",
            screenHeight: screen.height,
            keyWord: '',
            isSelect: false,
            checkTime: "",      //验票日期
            sendTime: "",       //发票日期
            invoiceType: "",    //发票类型
            realStatus: "",      //验真状态
            checkTimeStart: "开始日期",
            checkTimeEnd: "结束日期",
            sendTimeStart: "开始日期",
            sendTimeEnd: "结束日期",
            nowData: "",
            invoiceList: [
                {
                    checkTime: "2017年07月03日",
                    sendTime: "2017年05月04日",
                    code: "012345678900",
                    number: "75040000",
                    saler: "滴滴出行科技有限公司",
                    tax: "20.09",
                    gid: "123456"
                },
                {
                    checkTime: "2017年07月03日",
                    sendTime: "2017年05月04日",
                    code: "012345678900",
                    number: "75040000",
                    saler: "滴滴出行科技有限公司",
                    tax: "20.09",
                    gid: "234567"
                },
                {
                    checkTime: "2017年07月03日",
                    sendTime: "2017年05月04日",
                    code: "012345678900",
                    number: "75040000",
                    saler: "滴滴出行科技有限公司",
                    tax: "20.09",
                    gid: "345678"
                },
            ]
        };
    },
    created() {
        console.log(this.isShow);
        // debugger;
        // this.isShow = this.$route.params.isShow;
        //获取当前时间
        this.setToday ();
    },
    methods: {
        //切换tab标签
        handler(index) {
            this.isShow = index;
        },
        //扫描输入
        scanIn () {
            this.$router.push({
                path: `/invoiceDetail/1/01,04,1200153320,07041662,183.49,20151221,83623873463907646339,5080,`
            });
        },
        //手动输入
        handleIn () {
            this.$router.push({
                path: `/handleForm`
            });
        },
        //点击搜索
        onSubmit () {
            if(this.keyWord){
                this.$refs.search.setBlur()
                this.$vux.toast.show({
                    type: 'text',
                    position: 'top',
                    text: this.keyWord
                })
            }
        },
        onCancel () {
            // if(this.keyWord){
            //     this.$vux.toast.show({
            //         type: 'text',
            //         position: 'top',
            //         text: this.keyWord
            //     })
            // }
        },
        //打开右侧筛选栏
        selectRight () {
            if (this.isSelect) {
                this.isSelect = false;
            }else{
                this.isSelect = true;
            }
        },
        //选择验证日期
        getCheckStart () {
            this.checkTime = '';
        },
        getCheckEnd () {
            this.checkTime = '';
        },
        //选择发票日期
        getSendStart () {
            this.sendTime = '';
        },
        getSendEnd () {
            this.sendTime = '';
        },
        //获取当前时间
        setToday () {
            let now = new Date()
            let cmonth = now.getMonth() + 1
            let day = now.getDate()
            if (cmonth < 10) cmonth = '0' + cmonth
            if (day < 10) day = '0' + day
            this.nowData = now.getFullYear() + '-' + cmonth + '-' + day
        },
        //清除筛选
        clearItems () {
            this.checkTime = "";       //验票日期
            this.sendTime = "";        //发票日期
            this.invoiceType = "";     //发票类型
            this.realStatus = "";      //验真状态
            this.checkTimeStart = "开始日期";
            this.checkTimeEnd = "结束日期";
            this.sendTimeStart = "开始日期";
            this.sendTimeEnd = "结束日期";
        },
        //确定筛选
        submitItems () {
            let data = {};
            if (this.checkTime) {
                data.checkTime = this.checkTime;
            }else{
                let start = this.checkTimeStart == '开始日期' ? '' : this.checkTimeStart;
                let end = this.checkTimeEnd == '结束日期' ? '' : this.checkTimeEnd;
                data.checkTime = start + ',' + end;
            }
            if (this.sendTime) {
                data.sendTime = this.sendTime;
            }else{
                let start = this.sendTimeStart == '开始日期' ? '' : this.sendTimeStart;
                let end = this.sendTimeEnd == '结束日期' ? '' : this.sendTimeEnd;
                data.sendTime = start + ',' + end;
            }
            data.invoiceType = this.invoiceType;
            data.realStatus = this.realStatus;
            console.log(data);
        },
        //点击进入详情页
        toDetail (item) {
            this.$router.push({
                path: `/invoiceDetail/2/${item.gid}`
            })
        }
        
    },
    watch: {
        //点击前三种时间时，初始化时间选择器
        checkTime: function (val) {
            if (val) {
                this.checkTimeStart = '开始日期';
                this.checkTimeEnd = '结束日期'
            }
        },
        sendTime: function (val) {
            if (val) {
                this.sendTimeStart = '开始日期';
                this.sendTimeEnd = '结束日期'
            }
        },
    },
    
};
</script>
<style lang="less">
@import '~vux/src/styles/reset.less';

li{
    list-style: none;
}
.clearfix:after{
    content: '';
    display: block;
    clear: both;
}
.check-home {
    // 扫描类型
    .check-type {
        overflow: hidden;
        // background-color: rgba(21,39,85, 0.8)
        background-color: #232940

    }
    .check-type-list li{
        list-style: none;
        background:#fff;
        border-radius: .5rem;
        width:95%;
        height:12.5rem;
        margin: 3rem auto;
        box-sizing: border-box;
        padding:1rem;
        position: relative;
    }
    .card-left{
        float: left;
        width: 20%;
        height:10rem;
    }
    .card-right{
        float: right;
        width: 75%;
        height: 10rem;
        h4{
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            span{
                display: inline-block;
                text-align: center;
                font-size: 1.3rem;
                width: 5rem;
                color:#fff;
                background-color: #FF685D;
                border-radius: 2rem;
            }
        }
        .sub-title{
            font-size: 1.3rem;
            font-weight: 700;
            color:#0B0B0B;
            margin-bottom: 0.5rem;
        }
        .content-tips{
            color:#999;
            margin-bottom: 0.4rem;
        }
        .tips-item{
            color:#999;
        }
        .tips-item span{
            display: inline-block;
            width: 2.8rem;
            border:1px solid #ddd;
            border-radius: 0.2rem;
            box-sizing: border-box;
            text-align: center;
            // padding: .3rem;
        }
        .tips-item span:last-child{
            width:4rem;
        }
    }
    .scanIn-icon{
        background: url('../../assets/checkType/scan_in.png') no-repeat center top;
        background-size: 5rem 5rem;
    }
    .handleIn-icon{
        background: url('../../assets/checkType/handle_in.png') no-repeat center top;
        background-size: 5rem 5rem;
    }
    .more-detail{
        position: absolute;
        bottom: 1.5rem;
        right: 1rem;
        color:#3879D9;
    }

    // 全部记录
    .record-total{
        position:relative;
        .vux-search-box{
            display: inline-block;
            width: 90%;
            position: fixed;
            top: 44px;
            z-index: 100;
        }
        .weui-search-bar{
            height: 3.5rem;
        }
        .select-btn{
            display: inline-block;
            width: 10%;height: 3.5rem;
            position: fixed;
            top: 44px;
            right: 0;
            z-index: 100;
            // background: url('../../assets/checkType/select_icon.png') no-repeat center center;
            // background-size: 3rem 3rem;
            text-align: left;
            line-height: 3.5rem;
            background: #EFEFF4;
            color: #3879D9;
        }
        .box {
            padding: 15px 15px;
        }
        .select-list{
            margin-bottom:1.5rem;
            .select-item-title{
                color:#444;
                font-size: 2rem;
                font-weight: 900;
                margin-bottom: 2rem;
            }
            .vux-checker-item{
                margin-bottom: 1rem;
            }
            .checkTime-item {
                color: #999;
                border: 1px solid #ddd;
                padding: 5px 15px;
            }
            .checkTime-item-selected {
                color: #3879D9;
                border: 1px solid #3879D9;
            }
            .weui-cells{
                display: inline-block;
                width: auto;
                background-color: transparent;
                font-size: 1rem;
                // border:1px solid #ddd;
                margin-top: 0;
                .vux-datetime{
                    color:#999;
                    border: 1px solid #ddd;
                    padding: 5px 15px;
                }
                .dataSelected{
                    color: #3879D9;
                    border: 1px solid #3879D9;
                }
            }
        }
        .clean-btn {
            height: 3rem;
            line-height: 3rem;
            text-align: center;
            color: #3879D9;
            border:1px solid #3879D9;
            border-radius: .5rem;
            font-size: 1.4rem;
        }
        .submit-btn{
            height: 3rem;
            line-height: 3rem;
            text-align: center;
            color: #fff;
            background-color: #3879D9;
            border-radius: .5rem;
            font-size: 1.4rem;
        }
        // 全部记录列表
        .record-total-list{
            width: 100%;
            margin-top: 5rem;
            .record-total-item{
                width: 90%;
                // height: 14rem;
                margin: 1rem auto;
                box-sizing: border-box;
                // padding: 1rem;
                border: 1px solid #E6E6E6;
                border-radius: .4rem;
                position: relative;
                .cicle{
                    display: inline-block;
                    position: absolute;
                    border: 1px solid #E6E6E6;
                    background: #fff;
                }
                .top-left{
                    width: .3rem;height: .6rem;
                    border-left: 2px solid #fff;
                    border-radius: 0 .3rem .3rem 0;
                    top: 1.5rem;left: -0.25rem;
                }
                .top-right{
                    width: .3rem;height: .6rem;
                    border-right: 2px solid #fff;
                    border-radius: .3rem 0 0 .3rem;
                    top: 1.5rem;right: -0.25rem;
                }
                .bottom-left{
                    width: .4rem;height: .8rem;
                    border-left: 2px solid #fff;
                    border-radius: 0 .4rem .4rem 0;
                    bottom: 1.7rem;left: -0.25rem;
                }
                .bottom-right{
                    width: .4rem;height: .8rem;
                    border-right: 2px solid #fff;
                    border-radius: .4rem 0 0 .4rem;
                    bottom: 1.7rem;right: -0.25rem;
                }
                .item-title{
                    font-size: 1.4rem;
                    height: 3rem;
                    line-height: 3rem;
                    padding: .2rem 2rem;
                    background: #F6F6F6;
                    border-bottom: 1px solid #E4E4E4;
                    span{
                        display: inline-block;
                        height: 3rem;
                        line-height: 3rem;
                    }
                }
                .item-footer{
                    clear: both;
                    font-size: 1.2rem;
                    height: 2rem;
                    line-height: 2rem;
                    padding: .1rem 1rem;
                    border-top: 2px dashed #E4E4E4;
                    span{
                        display: inline-block;
                        height: 2rem;
                        line-height: 2rem;
                    }
                }
                .invoice-content:after{
                    content: '';
                    clear: both;
                    display: block;
                }
                .invoice-content{
                    padding: 1rem;
                    .invoice-type-left{
                        float: left;
                        width: 29%;
                        text-align: center;
                        margin-top: 3rem;
                    }
                    .invoice-detail-right{
                        float: right;
                        width: 70%;
                        span.detail-title{
                            display: inline-block;
                            width: 6rem;
                            text-align: right;
                            vertical-align: top;
                        }
                        span.detail-con{
                            display: inline-block;
                            width: 10rem;
                            vertical-align: top;
                        }
                    }
                }
            }
        }
        .footer-info{
            width: 100%;
            background: #CCCCCC;
            box-sizing: border-box;
            padding: .5rem 1rem;
            position: fixed;
            bottom: 0;
            font-size: 1.3rem;
            .footer-info-fl{
                float: left;
            }
            .footer-info-rt{
                float: right;
            }
            em{
                color: #3879D9;
                font-size: 1.5rem;
                font-style: normal;
            }
        }
    }
}
</style>