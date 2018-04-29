<template>
  <div class="invoice-detail">
      <group class="status-fix">
          <cell
            title="国税状态"
            is-link
            :border-intent="false"
            :arrow-direction="isStatus ? 'up' : 'down'"
            @click.native="isStatus = !isStatus">
                <span slot="value" :class="gszt == 'success' ? 'text-right' : 'text-err'">{{setGsztStatus(gszt)}}</span>
            </cell>

            <div class="slide" :class="isStatus?'animate':''">
                <div class="info-box status-info">
                    <!-- <p class="clearfix"><span>购方名称：</span><span :class="gszt == 'success' ? 'text-right' : 'text-err'">{{setGsztStatus (gszt)}}</span></p> -->
                    <!-- <p class="clearfix"><span>购方税号：</span><span :class="gszt == 'success' ? 'text-right' : 'text-err'">{{setGsztStatus (gszt)}}</span></p> -->
                    <p class="clearfix"><span>{{invDetailList.checkDate}}由{{invDetailList.inputuser}}验证 </span><span :class="invDetailList.status == 'right' ? 'text-right' : 'text-err'">验证状态：{{setFpStatus(invDetailList.status)}}</span></p>
                </div>
            </div>
      </group>
      <group>
          <cell
            title="购方信息"
            value=""
            is-link
            :border-intent="false"
            :arrow-direction="isbuyerInfo ? 'up' : 'down'"
            @click.native="isbuyerInfo = !isbuyerInfo"></cell>

            <div class="slide" :class="isbuyerInfo?'animate':''">
                <div class="info-box">
                    <p class="clearfix"><span>名称</span><span>{{invDetailList.purchasername}}</span></p>
                    <p class="clearfix"><span>税号</span><span>{{invDetailList.taxpayernumber}}</span></p>
                </div>
            </div>
      </group>
      <group>
          <cell
            title="发票概要"
            value=""
            is-link
            :border-intent="false"
            :arrow-direction="isInvInfo ? 'up' : 'down'"
            @click.native="isInvInfo = !isInvInfo"></cell>

            <div class="slide items-detail" :class="isInvInfo?'animate':''">
                <div class="info-box">
                    <p class="clearfix"><span>发票代码</span> <span>{{invDetailList.invoicedatacode}}</span></p>
                    <p class="clearfix"><span>发票号码</span> <span>{{invDetailList.invoicenumber}}</span></p>
                    <p class="clearfix"><span>发票日期</span> <span>{{invDetailList.billingtime}}</span></p>
                    <p class="clearfix cut-line"><span>发票类型</span> <span>{{invDetailList.invoicetypename}}</span></p>
                    <p class="clearfix"><span>金额合计</span> <span>￥{{invDetailList.totalamount}}</span></p>
                    <p class="clearfix"><span>税额合计</span> <span>￥{{invDetailList.totaltaxnum}}</span></p>
                    <p class="clearfix"><span>价税合计</span> <span>￥{{invDetailList.totaltaxsum}}</span></p>
                </div>
            </div>
      </group>
      <group>
          <cell
            title="发票明细"
            value=""
            is-link
            :border-intent="false"
            :arrow-direction="isInvDetail ? 'up' : 'down'"
            @click.native="isInvDetail = !isInvDetail"></cell>

            <div class="slide items-detail" :class="isInvDetail?'animate':''">
                <div class="info-box-list" v-for="item in invDetailList.fpInvoiceRepChildList" :key="item.id">
                <!-- <div class="info-box-list"> -->
                    <p class="clearfix"><span>货物或应税劳务、服务名称</span> <span>{{item.goodservicename ? item.goodservicename : '无'}}</span></p>
                    <p class="clearfix"><span>规格型号</span> <span>{{item.model ? item.model : '无'}}</span></p>
                    <p class="clearfix"><span>单位</span> <span>{{item.unit ? item.unit : '无'}}</span></p>
                    <p class="clearfix"><span>单价</span> <span>￥{{item.price ? item.price : '无'}}</span></p>
                    <p class="clearfix"><span>数量</span> <span>{{item.number ? item.number : '无'}}</span></p>
                    <p class="clearfix"><span>金额</span> <span>￥{{item.sum ? item.sum : '无'}}</span></p>
                    <p class="clearfix"><span>税率</span> <span>{{item.taxrate ? item.taxrate : '无'}}</span></p>
                    <p class="clearfix"><span>税额</span> <span>￥{{item.tax ? item.tax : '无'}}</span></p>
                </div>
            </div>
      </group>
      <group>
          <cell
            title="销方信息"
            value=""
            is-link
            :border-intent="false"
            :arrow-direction="isSaleInfo ? 'up' : 'down'"
            @click.native="isSaleInfo = !isSaleInfo"></cell>

            <div class="slide items-detail" :class="isSaleInfo?'animate':''">
                <div class="info-box">
                    <p class="clearfix"><span>名称</span> <span style="width:80%;text-align:right">{{invDetailList.salesname}}</span></p>
                    <p class="clearfix"><span>税号</span> <span style="width:80%;text-align:right">{{invDetailList.salestaxpayernum}}</span></p>
                    <p class="clearfix"><span>地址电话</span> <span style="width:80%;text-align:right">{{invDetailList.salestaxpayeraddress}}</span></p>
                    <!-- <p class="clearfix"><span></span> <span>无</span></p> -->
                    <p class="clearfix"><span>开户行账户</span> <span style="width:80%;text-align:right">{{invDetailList.salestaxpayerbankaccount}}</span></p>
                    <!-- <p class="clearfix"><span></span> <span>无</span></p> -->
                </div>
            </div>
      </group>

        <p v-if="invDetailList.fpPic" class="prev-img" @click="prevImg">
            查看附件
        </p>
      
  </div>
</template>

<script>

import {Group, Cell } from 'vux';
import { getUserInfo } from "../../api/common_service";
import { getWareDetail } from '../../api/totalRecord'
import  common  from '../../common/common.js'

export default {
  components: {
    Cell,
    Group
  },
  data() {
    return {
        id: '',
        userObj: {},
        isStatus: true,
        isbuyerInfo: false,
        isInvInfo: false,
        isInvDetail: true,
        isSaleInfo: true,
        invDetailList: [],
        gszt: ""
    };
  },
  created() {
        this.id = this.$route.params.id;

        //查询发票信息
        this.getFpDetail(this.id);
      
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((data) => {
          data = data.data;        //axios返回值 放在data里
          this.userObj = data;
          if (this.userObj) {
                
          }
        },(err) => {

        }
      );
    },
    //获取发票信息
    getFpDetail (id) {
        this.$vux.loading.show({
            text: '加载中...'
        })
        getWareDetail({
            id: id,
        }).then((data) => {
            this.$vux.loading.hide();
            data = data.data;        //axios返回值 放在data里
            if (data != null) {

                this.invDetailList = data;
                this.gszt = data.gszt;
            }else {
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: '请求数据失败，请稍后重试!'
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
    //发票状态码转汉字
    setFpStatus (status) {
        switch (status) 
        {
            case 'sensitive': 
                return '敏感票'
                break;
            case 'false': 
                return '假票'
                break;
            case 'error': 
                return '错票'
                break;
            case 'right': 
                return '正常'
                break;
        }
    },
    //国税状态转汉字
    setGsztStatus (status) {
        switch (status) 
        {
            case 'success': 
                return '一致'
                break;
            case 'zf': 
                return '作废'
                break;
            case 'noexist': 
                return '查无此票'
                break;
            case 'check': 
                return '待验证'
                break;
            case 'fail': 
                return '不一致'
                break;
        }
    },
    prevImg () {
        let imgList = this.invDetailList.fpPic.split(",");
        for (var i=0;i<imgList.length;i++) {
            imgList[i] = common.fileApi + imgList[i]
            // imgList[i] = 'http://w.hklhjy.com' + imgList[i]
        }
        this.$wechat.previewImage({
            current: imgList[0], // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        });
    }
    
  }
};
</script>

<style lang="less">
.fl{
    float: left;
}
.rt{
    float:right;
}
.clearfix:after{
    content: '';
    display: block;
    clear: both;
}
.text-err{
    color:#f00
}
.text-right{
    color:#666
}
.invoice-detail{
    padding-bottom: 4rem;
    .slide {
        padding: 0 20px;
        overflow: hidden;
        max-height: 0;
        transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
        font-size: 1.2rem;
    }
    .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
    }
    // .status-fix{
    //     position: fixed;
    //     top: 20px;
    // }
    .info-box p{
        margin-bottom: 1rem;
        span:first-child{
            float: left;
        }
        span:last-child{
            float: right;
        }
    }
    .info-box p.cut-line{
        border-bottom: 1px dashed #999;
        padding-bottom: 1rem;
    }
    .weui-cell{
        font-size: 1.3rem;
    }
    // 展开信息容器
    .info-box{
        padding: 1rem 0;
        color: #666;
    }
    .info-box-list{
        padding: 1rem 0;
        color: #666;
        border-bottom: 1px dashed #999;
    }
    .info-box-list p{
        margin-bottom: 1rem;
        span:first-child{
            float: left;
        }
        span:last-child{
            float: right;
        }
    }
    .btn-footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        span{
            display: inline-block;
            width: 50%;
            text-align: center;
            font-size: 1.4rem;
            height: 3.5rem;
            line-height: 3.5rem;
        }
        .inv-err{
            background: #fff;
            color: #3879D9
        }
        .inv-right{
            background: #3879D9;
            color: #fff;
        }
    }
    .prev-img{
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: 1.4rem;
        height: 4rem;
        line-height: 4rem;
        background: #2882AD;
        color: #fff
        
    }
    
}
</style>