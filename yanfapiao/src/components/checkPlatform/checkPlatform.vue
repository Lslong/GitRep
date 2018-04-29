<template>
    <!-- <div class="check-home"> -->
        <!-- 全部记录 -->
        <div class="check-platform" v-bind:style="{minHeight:screenHeight-30+'px'}">
            <search
            v-model="keyWord"
            position="fixed"
            auto-scroll-to-top top="0"
            cancel-text="取消"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="search" style="position:fixed;"></search>
            <span @click="selectRight" class="select-btn"></span>
            <div>
                <popup v-model="isSelect" position="right" width="80%" style="background:#fff">
                    <div style="width:100%;margin:0 auto;">
                        <div class="box">
                            <ul class="select-list">
                                <li>
                                    <h2 class="select-item-title" style="margin-top:0">验证日期</h2>
                                    <checker style="display:none" v-model="checkTime" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
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
                                    <checker style="display:none" v-model="sendTime" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
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
                                        <checker-item value="增值税专票">增值税专票</checker-item>
                                        <checker-item value="增值税普通发票">增值税普通发票</checker-item>
                                        <checker-item value="电子发票">电子发票</checker-item>
                                        <checker-item value="">全部</checker-item>
                                    </checker>
                                </li>
                                <li>
                                    <h2 class="select-item-title">国税状态</h2>
                                    <checker v-model="gsztText" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
                                        <checker-item value="一致">一致</checker-item>
                                        <checker-item value="作废">作废</checker-item>
                                        <checker-item value="查无此票">查无此票</checker-item>
                                        <checker-item value="待查验">待查验</checker-item>
                                        <checker-item value="不一致">不一致</checker-item>
                                        <checker-item value="">全部</checker-item>
                                    </checker>
                                </li>
                                <li>
                                    <h2 class="select-item-title">状态标识</h2>
                                    <checker v-model="fpStateText" default-item-class="checkTime-item" selected-item-class="checkTime-item-selected">
                                        <checker-item value="正常">正常</checker-item>
                                        <checker-item value="错票">错票</checker-item>
                                        <checker-item value="假票">假票</checker-item>
                                        <checker-item value="敏感票">敏感票</checker-item>
                                        <checker-item value="">全部</checker-item>
                                    </checker>
                                </li>
                            </ul>
                            <div style="position:fixed;bottom:0;left:20%;width:72%;padding:15px;background:#fff">
                                <flexbox>
                                    <flexbox-item>
                                        <div class="clean-btn" @click="clearItems">清空筛选</div>
                                    </flexbox-item>
                                    <flexbox-item>
                                        <div class="submit-btn" @click="closeSelect">确认筛选</div>
                                    </flexbox-item>
                                </flexbox>
                            </div>
                        </div>
                    </div>
                </popup>
            </div>
            <!-- 全部记录列表 -->
            <div v-if="invoiceList.length == 0" style="font-size:1.4rem;text-align:center;color:#333;position:absolute;top:50%;width:100%;">暂无数据</div>
            <scroller lock-x scrollbar-y use-pullup use-pulldown @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
                <div class="box2">
                    <ul class="record-total-list">
                        <li class="record-total-item" v-for="item in invoiceList" :key="item.id" @click="toDetail(item)">
                            <i class="cicle top-left"></i>
                            <i class="cicle top-right"></i>
                            <i class="cicle bottom-left"></i>
                            <i class="cicle bottom-right"></i>
                            <!-- <p class="item-title">{{item.checkDate}}（1张） </p> -->
                            <div class="item-title">
                                <div>{{item.checkDate}}（1张）</div>
                                <div style="font-size:1.3rem">状态标识：<span :class="item.status == 'right' ? 'state-right' : 'state-err'">{{selectDictName(3,item.status)}}</span></div>
                            </div>
                            <div class="invoice-content">
                                <div class="invoice-type-left"><img :src="item.invoicetypecode == 10 ? eleFpUrl : (item.invoicetypecode == 1 ? paperZpUrl : paperPpUrl)" alt=""></div>
                                <div class="invoice-detail-right">
                                    <p><span class="detail-title">开票日期：</span><span class="detail-con">{{item.billingtime}}</span></p>
                                    <p><span class="detail-title">代码：</span><span class="detail-con">{{item.invoicedatacode}}</span></p>
                                    <p><span class="detail-title">号码：</span><span class="detail-con">{{item.invoicenumber}}</span></p>
                                    <p><span class="detail-title">销售方：</span><span class="detail-con">{{item.salesname}}</span></p>
                                    <p><span class="detail-title">价税合计：</span><span class="detail-con">￥{{item.totaltaxsum}}</span></p>
                                </div>
                            </div>
                            <p class="item-footer"><span style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:20rem">{{item.checkDate}}由{{item.inputuser}} 验证</span> <img style="height:2rem;width:5rem;float:right;" :src="item.gszt == 'success' ? checkRightImgurl : checkFalseImgurl" alt=""></p>
                        </li>
                    </ul>
                </div>
                <!--pulldown slot-->
                <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                    <span v-show="status.pulldownStatus === 'default'"></span>
                    <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">↓</span>
                    <span v-show="status.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
                </div>
                <!--pullup slot-->
                <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
                    <span v-show="status.pullupStatus === 'default'"></span>
                    <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
                    <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
                </div>
            </scroller>
            <!-- <ul class="record-total-list">
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
            </ul> -->
            
            <p class="footer-info clearfix">
                <span class="footer-info-lf" style="display:none" @click="outLogin">解除绑定</span>
                <span class="footer-info-lf" style="">累计扫描发票共 <em>{{fpPageList.count}}</em> 张</span>
                <span class="footer-info-rt">剩余 <em>{{checkNum}}</em> 张</span>
            </p>
        </div>
    <!-- </div> -->
</template>

<script>
import {
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
  Datetime,
  Scroller,
  Spinner
} from "vux";
import { getUserInfo,outBind } from "../../api/common_service";
import { getCheckNum,getCheckFpInfo,getDictList } from '../../api/totalRecord'
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
    Datetime,
    Scroller,
    Spinner
  },
  data() {
    return {
      userObj: {},
      checkNum: 0,
      screenHeight: screen.height,
      keyWord: "",
      invoiceDataCode: "",//发票代码
      invoiceNumber: "",//发票号码
      isSelect: false,
      checkTime: "", //验票日期
      sendTime: "", //发票日期
      invoiceType: "", //发票类型
      gsztText: "",//国税状态
      fpStateText: "",//状态标识
      invoiceTypeVal: "", //发票类型value
      gsztVal: "",//国税状态value
      fpStateVal: "",//状态标识value
      invoiceTypeList: "", //发票类型表
      invoiceGsztList: "",//国税状态表
      fpStateList: "",//状态标识表
      checkTimeStart: "开始日期",
      checkTimeEnd: "结束日期",
      sendTimeStart: "开始日期",
      sendTimeEnd: "结束日期",
      nowData: "",
      fpPageList: "",
      invoiceList: [],
      pageNo: 1,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      isPullup: true,
      eleFpUrl: require('@/assets/eleFp.png'),
      paperPpUrl: require('@/assets/paperPp.png'),
      paperZpUrl: require('@/assets/paperZp.png'),
      checkRightImgurl: require('@/assets/check_right.jpg'),
      checkFalseImgurl: require('@/assets/check_false.jpg'),
    };
  },
  created() {
    this.getUserInfo();
    
    //获取当前时间
    this.setToday();
    //发票通用字典接口
    this.getDictInfo ();
  },
  methods: {
    //解除绑定
    outLogin () {
        outBind({
            loginName: this.userObj.LOGINNAME
        }).then((data) => {
            data = data.data;
            if (data.result == 1) {
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: data.msg
                });
                localStorage.setItem('token','');
                this.$router.push({
                    path: `/login`
                });
            }
        })
    },
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
                //获取剩余次数
                this.getCheckNum();
                //查询发票记录
                this.getFpInfo (1,1);
                
            }
        },(err) => {

        });
    },
    //获取剩余次数
    getCheckNum () {
        getCheckNum({
            companyId: this.userObj.COMPANYID ? this.userObj.COMPANYID : '',
            userId: this.userObj.USERID ? this.userObj.USERID : ''
        }).then((data) => {
            data = data.data;        //axios返回值 放在data里
            if (data.result == 1) {
                this.checkNum = data.rows.fpCheckNum;
            }else {
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: data.msg
                });
            }
        }, (err) => {

        });
    },
    //点击搜索
    onSubmit() {
      if (this.keyWord) {
        this.$refs.search.setBlur();
        // this.$vux.toast.show({
        //   type: "text",
        //   position: "top",
        //   text: this.keyWord
        // });
        if (this.keyWord.length > 8) {//发票代码
            this.invoiceDataCode = this.keyWord;
            this.getFpInfo (1,1);
        }else {//发票号码
            this.invoiceNumber = this.keyWord;
            this.getFpInfo (1,1);
        }
      }
    },
    onCancel() {
      this.keyWord = "";
      this.invoiceDataCode = "";
      this.invoiceNumber = "";
    },
    //打开右侧筛选栏
    selectRight() {
      if (this.isSelect) {
        this.isSelect = false;
      } else {
        this.isSelect = true;
      }
    },
    //选择验证日期
    getCheckStart() {
      this.checkTime = "";
    },
    getCheckEnd() {
      this.checkTime = "";
    },
    //选择发票日期
    getSendStart() {
      this.sendTime = "";
    },
    getSendEnd() {
      this.sendTime = "";
    },
    //获取当前时间
    setToday() {
      let now = new Date();
      let cmonth = now.getMonth() + 1;
      let day = now.getDate();
      if (cmonth < 10) cmonth = "0" + cmonth;
      if (day < 10) day = "0" + day;
      this.nowData = now.getFullYear() + "-" + cmonth + "-" + day;
    },
    //清除筛选
    clearItems() {
      this.checkTime = ""; //验票日期
      this.sendTime = ""; //发票日期
      this.invoiceType = ""; //发票类型
      this.gsztText = ""; //国税状态
      this.fpStateText = ""; //状态标识
      this.checkTimeStart = "开始日期";
      this.checkTimeEnd = "结束日期";
      this.sendTimeStart = "开始日期";
      this.sendTimeEnd = "结束日期";
    },
    //确定筛选
    submitItems() {
    //   let data = {};
    //   if (this.checkTime) {
    //     data.checkTime = this.checkTime;
    //   } else {
    //     let start = this.checkTimeStart == "开始日期" ? "" : this.checkTimeStart;
    //     let end = this.checkTimeEnd == "结束日期" ? "" : this.checkTimeEnd;
    //     data.checkTime = start + "," + end;
    //   }
    //   if (this.sendTime) {
    //     data.sendTime = this.sendTime;
    //   } else {
    //     let start = this.sendTimeStart == "开始日期" ? "" : this.sendTimeStart;
    //     let end = this.sendTimeEnd == "结束日期" ? "" : this.sendTimeEnd;
    //     data.sendTime = start + "," + end;
    //   }
        // this.sendTimeStart = this.sendTimeStart == "开始日期" ? "" : this.sendTimeStart;
        // this.sendTimeEnd = this.sendTimeEnd == "结束日期" ? "" : this.sendTimeEnd;
        // this.checkTimeStart = this.checkTimeStart == "开始日期" ? "" : this.checkTimeStart;
        // this.checkTimeEnd = this.checkTimeEnd == "结束日期" ? "" : this.checkTimeEnd;
        this.invoiceTypeVal = this.selectDict (1,this.invoiceType);
        this.gsztVal = this.selectDict (2,this.gsztText);
        this.fpStateVal = this.selectDict (3,this.fpStateText);
        this.getFpInfo (1,1);
      
    },
    //关闭筛选框
    closeSelect () {
       this.isSelect = false;
    },
    //点击进入详情页
    toDetail(item) {
      this.$router.push({
        path: `/invoiceDetail/3/${item.id}`
      });
    },
    //上拉加载
    loadMore() {
        console.log(this.status.pullupStatus);
        if (this.status.pullupStatus == 'down' && this.isPullup) {

            this.pageNo++;
            this.getFpInfo (2,this.pageNo);
        }else {
            this.status.pullupStatus = 'default';
            this.$refs.scroller.donePullup();
            this.$vux.toast.show({
                type: "text",
                position: "middle",
                width: "auto",
                text: '暂无更多发票信息'
            });
        }
    },
    //下拉刷新
    refresh() {
        console.log(this.status.pulldownStatus);
        if (this.status.pulldownStatus == 'up') {

            this.getFpInfo (3,1);
        }
    },
    //获取发票列表 type:1-重新渲染  2-上拉加载  3-下拉刷新
    getFpInfo (type,pageNo) {
        this.$vux.loading.show({
            text: '查询中...'
        })
        this.isPullup = true;
        getCheckFpInfo({
            openId: localStorage.getItem('openId'),
            billingTimeBegin: this.sendTimeStart == "开始日期" ? "" : this.sendTimeStart,//	开票时间（启）（字符串格式yyyy-mm-dd）
            billingTimeEnd: this.sendTimeEnd == "结束日期" ? "" : this.sendTimeEnd,//	开票时间（止）（字符串格式yyyy-mm-dd）
            beginChecktime: this.checkTimeStart == "开始日期" ? "" : this.checkTimeStart,//	查验时间(启)（字符串格式yyyy-mm-dd）
            endChecktime: this.checkTimeEnd == "结束日期" ? "" : this.checkTimeEnd,//	 查验时间(止)（字符串格式yyyy-mm-dd）
            invoiceTypeCode: this.invoiceTypeVal,//	发票类型(取通用字典查询的value值)
            gszt: this.gsztVal,//国税状态(取通用字典查询的value值)
            status: this.fpStateVal,//国税状态(取通用字典查询的value值)
            pageNo: pageNo,
            pageSize: 5,
        }).then((data) => {
            this.$vux.loading.hide();
            data = data.data.rows.data;        //axios返回值 放在data里
            this.fpPageList = data;
            this.status.pullupStatus = 'default';//复原状态 允许再次刷新数据
            this.status.pulldownStatus = 'default';
            if (data != null && data.count) {
                if (parseFloat(pageNo)*5 >= data.count) {
                    this.isPullup = false;
                }
                if (type == 2) {
                    this.invoiceList = this.invoiceList.concat(data.list);
                    this.$refs.scroller.donePullup();
                }else if (type == 3) {
                    this.invoiceList = data.list;
                    this.pageNo = 1;//下拉加载 页面重置
                    this.$refs.scroller.donePulldown();
                }else {
                    this.invoiceList = data.list;
                    this.pageNo = 1;//重新加载 页面重置
                }
            }else {
                // this.invoiceList.length = 0;
                //splice可以出发vue视图的变化  修改数组长度
                this.invoiceList.splice(0);
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: '暂无发票信息'
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
    },
    //通用字典接口  查询发票类型，状态标识   因为类型、标识是可配置的，故要每次调接口查询编码
    getDictInfo () {
        getDictList('fptype').then((data) => {
            this.invoiceTypeList = data.data;
        },(err) => {

        });
        
        getDictList('fpgszt').then((data) => {
            this.invoiceGsztList = data.data;
        },(err) => {

        });
        getDictList('fpstate').then((data) => {
            this.fpStateList = data.data;
        },(err) => {

        });
    },
    //获取具体编码  type:1--发票类型  2--国税状态  3--状态标识
    selectDict (type,text) {
        if (!text) {
            return '';
        }
        if (type == 1) {
            for (var i=0;i < this.invoiceTypeList.length;i++) {
                if (this.invoiceTypeList[i].label == text) {
                    return this.invoiceTypeList[i].value;
                }
            }
        }else if (type == 2) {
            for (var i=0;i < this.invoiceGsztList.length;i++) {
                if (this.invoiceGsztList[i].label == text) {
                    return this.invoiceGsztList[i].value;
                }
            }
        }else if (type == 3) {
            for (var i=0;i < this.fpStateList.length;i++) {
                if (this.fpStateList[i].label == text) {
                    return this.fpStateList[i].value;
                }
            }
        }
    },
    //获取编码对应汉字  type:1--发票类型  2--编码
    selectDictName (type,code) {
        if (!code) {
            return '';
        }
        if (type == 1) {
            for (var i=0;i < this.invoiceTypeList.length;i++) {
                if (this.invoiceTypeList[i].value == code) {
                    return this.invoiceTypeList[i].label;
                }
            }
        }else if (type == 2) {
            for (var i=0;i < this.invoiceGsztList.length;i++) {
                if (this.invoiceGsztList[i].value == code) {
                    return this.invoiceGsztList[i].label;
                }
            }
        }else if (type == 3) {
            for (var i=0;i < this.fpStateList.length;i++) {
                if (this.fpStateList[i].value == code) {
                    return this.fpStateList[i].label;
                }
            }
        }
    },
  },
  watch: {
    //点击前三种时间时，初始化时间选择器
    checkTime: function(val) {
      if (val) {
        this.checkTimeStart = "开始日期";
        this.checkTimeEnd = "结束日期";
      }
    },
    sendTime: function(val) {
      if (val) {
        this.sendTimeStart = "开始日期";
        this.sendTimeEnd = "结束日期";
      }
    },
    isSelect: function(val) {
        if (!val) {
            //确定筛选
            this.submitItems();
        }
    },
  }
};
</script>
<style lang="less">
@import "~vux/src/styles/reset.less";

li {
  list-style: none;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
// .check-home {

// 全部记录
.check-platform {
  position: relative;
  padding-bottom: 3rem;
  .vux-search-box {
    display: inline-block;
    width: 90%;
    position: fixed;
    top: 0;
    z-index: 100;
  }
  .weui-search-bar {
    height: 5rem;
  }
  .weui-search-bar__box{
      padding-top: 0.6rem;
      .weui-icon-search{
          top: 0.6rem;
      }
  }
  .weui-search-bar__label{
      padding-top: 0.6rem;
  }
  .weui-search-bar__cancel-btn{
      padding-top: 0.5rem;
  }


  .select-btn {
    display: inline-block;
    width: 10%;
    height: 5rem;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    background: url('../../assets/checkType/select_icon.png') no-repeat center left;
    background-size: 2.5rem 2.5rem;
    background-color: #efeff4;
    // text-align: left;
    // line-height: 3.5rem;
    // color: #3879d9;
  }
  .box {
    padding: 15px 15px;
    padding-bottom: 3rem;
    background: #fff;
    .vux-flexbox{
        background: #fff;
    }
  }
  .select-list {
    margin-bottom: 1.5rem;
    .select-item-title {
      color: #444;
      font-size: 2rem;
      font-weight: 900;
      margin: 2rem 0 .5rem;
    }
    .vux-checker-item {
      margin-bottom: 1rem;
    }
    .checkTime-item {
      color: #999;
      border: 1px solid #ddd;
      padding: 5px 15px;
    }
    .checkTime-item-selected {
      color: #3879d9;
      border: 1px solid #3879d9;
    }
    .weui-cells {
      display: inline-block;
      width: auto;
      background-color: transparent;
      font-size: 1rem;
      // border:1px solid #ddd;
      margin-top: 0;
      .vux-datetime {
        color: #999;
        border: 1px solid #ddd;
        padding: 5px 15px;
      }
      .dataSelected {
        color: #3879d9;
        border: 1px solid #3879d9;
      }
    }
  }
  .clean-btn {
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    color: #3879d9;
    border: 1px solid #3879d9;
    border-radius: 0.5rem;
    font-size: 1.4rem;
  }
  .submit-btn {
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    color: #fff;
    background-color: #3879d9;
    border-radius: 0.5rem;
    font-size: 1.4rem;
  }
  // 全部记录列表
  //上拉加载
  .rotate {
    display: inline-block;
    transform: rotate(-180deg);
   }
    .pullup-arrow {
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
   }

  .record-total-list {
    width: 100%;
    margin-top: 6rem;
    .record-total-item {
      width: 90%;
      // height: 14rem;
      margin: 1rem auto;
      box-sizing: border-box;
      // padding: 1rem;
      border: 1px solid #e6e6e6;
      border-radius: 0.4rem;
      position: relative;
      .cicle {
        display: inline-block;
        position: absolute;
        border: 1px solid #e6e6e6;
        background: #fff;
      }
      .top-left {
        width: 0.3rem;
        height: 0.6rem;
        border-left: 2px solid #fff;
        border-radius: 0 0.3rem 0.3rem 0;
        top: 1.5rem;
        left: -0.25rem;
      }
      .top-right {
        width: 0.3rem;
        height: 0.6rem;
        border-right: 2px solid #fff;
        border-radius: 0.3rem 0 0 0.3rem;
        top: 1.5rem;
        right: -0.25rem;
      }
      .bottom-left {
        width: 0.4rem;
        height: 0.8rem;
        border-left: 2px solid #fff;
        border-radius: 0 0.4rem 0.4rem 0;
        bottom: 1.7rem;
        left: -0.25rem;
      }
      .bottom-right {
        width: 0.4rem;
        height: 0.8rem;
        border-right: 2px solid #fff;
        border-radius: 0.4rem 0 0 0.4rem;
        bottom: 1.7rem;
        right: -0.25rem;
      }
    //   .item-title {
    //     font-size: 1.4rem;
    //     height: 3rem;
    //     line-height: 3rem;
    //     padding: 0.2rem 2rem;
    //     background: #f6f6f6;
    //     border-bottom: 1px solid #e4e4e4;
    //     span {
    //       display: inline-block;
    //       height: 3rem;
    //       line-height: 3rem;
    //     }
    //   }
        .item-title{
            font-size: 1.4rem;
            height: 3rem;
            line-height: 3rem;
            padding: 0.2rem 1rem;
            background: #f6f6f6;
            border-bottom: 1px solid #e4e4e4;
            display: flex;
            justify-content: space-between;
            .state-err{
                color: #f00;
            }
            .state-right{
                color: #000;
            }
        }
      .item-footer {
        clear: both;
        font-size: 1.2rem;
        height: 2rem;
        line-height: 2rem;
        padding: 0.1rem 1rem;
        border-top: 2px dashed #e4e4e4;
        span {
          display: inline-block;
          height: 2rem;
          line-height: 2rem;
        }
        .success{
            display: inline-block;
            float: right;
            width: 2rem;height: 2rem;
            background: url('../../assets/checkType/success_icon.png') no-repeat center center;
            background-size: cover;
        }
      }
      .invoice-content:after {
        content: "";
        clear: both;
        display: block;
      }
      .invoice-content {
        padding: 1rem;
        .invoice-type-left {
          float: left;
          width: 29%;
          text-align: center;
          margin-top: 1rem;
          img{
              width: 100%;
          }
        }
        .invoice-detail-right {
          float: right;
          width: 70%;
          span.detail-title {
            display: inline-block;
            width: 6rem;
            text-align: right;
            vertical-align: top;
          }
          span.detail-con {
            display: inline-block;
            width: 10rem;
            vertical-align: top;
          }
        }
      }
    }
  }
  .footer-info {
    width: 100%;
    background: #cccccc;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    position: fixed;
    bottom: 0;
    font-size: 1.3rem;
    .footer-info-fl {
      float: left;
    }
    .footer-info-rt {
      float: right;
    }
    em {
      color: #3879d9;
      font-size: 1.5rem;
      font-style: normal;
    }
  }
}
// }
</style>