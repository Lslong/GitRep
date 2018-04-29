<template>
  <div class="handel-form">
      <div>
          <group title="请选择发票类型" style="display:none">
            <radio :options="invoiceType" v-model="typeVal"></radio>
          </group>

          <group title="发票代码">
            <x-input v-model="codeVal" type="number" required placeholder="请输入发票代码"></x-input>
          </group>
          <group title="发票号码">
            <x-input v-model="numberVal" type="number" required placeholder="请输入发票号码"></x-input>
          </group>
          <group title="开票日期" class="date-chose">
            <datetime v-model="dateVal"></datetime>
          </group>
          <group title="" style="display:none">
            <x-input v-model="lastsixVal" type="number" required placeholder="请输入发票校验码后6位"></x-input>
          </group>
          
          <div class="tips">
              <p>小贴士 :</p>
              <p style="text-align:center;margin-bottom:2rem;">上海增值税普通发票</p>
              <div class="qrcodeNum">
                  <qrcode value="二维码示例" type="img" :size=40 class="qr"></qrcode>
                  <div class="nums">
                      <p>4101234567</p>
                      <p>
                          <span class="code-color">校验码：</span>
                          <span>785489 13526 5639</span><span class="code-color">1 09278</span>
                      </p>
                  </div>
              </div>
          </div>
          <div class="submit-handle" @click="submitHandle">提交</div>
      </div>
  </div>
</template>

<script>
import { Group, Radio, XInput, Datetime, Qrcode } from "vux";
import { getUserInfo } from "../../api/common_service";
import { fpCheck, checkNum, getDictName } from "../../api/checkType";

export default {
  components: {
    Group,
    Radio,
    XInput,
    Datetime,
    Qrcode
  },
  data() {
    return {
      userObj: {},
      invoiceType: ["增值税普通发票", "增值税专用发票"],
      typeVal: "增值税普通发票",
      codeVal: "",
      numberVal: "",
      dateVal: "请输入开票日期",
      lastsixVal: "",
      totalAmount: ""
    };
  },
  created() {
    this.codeVal = this.$route.params.invoiceDataCode ? this.$route.params.invoiceDataCode : '';
    this.numberVal = this.$route.params.invoiceNumber ? this.$route.params.invoiceNumber : '';
    this.dateVal = this.$route.params.dateVal ? this.$route.params.dateVal : '请输入开票日期';
    this.lastsixVal = this.$route.params.checkCode ? this.$route.params.checkCode : '';
    this.totalAmount = this.$route.params.totalAmount ? this.$route.params.totalAmount : '';
    
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((data) => {
          data = data.data;        //axios返回值 放在data里
          this.userObj = data;
        },(err) => {

        }
      );
    },
    submitHandle() {
      if (!this.codeVal) {
        this.$vux.toast.show({
          type: "text",
          position: "middle",
          width: "auto",
          text: "请输入发票代码"
        });
      } else if (!this.numberVal) {
        this.$vux.toast.show({
          type: "text",
          position: "middle",
          width: "auto",
          text: "请输入发票号码"
        });
      } else if (this.dateVal == "请输入开票日期") {
        this.$vux.toast.show({
          type: "text",
          position: "middle",
          width: "auto",
          text: "请输入开票日期"
        });
    //   } else if (!this.lastsixVal || this.lastsixVal.length != 6) {
    //     this.$vux.toast.show({
    //       type: "text",
    //       position: "middle",
    //       width: "auto",
    //       text: "请输入发票校验码后6位或格式错误"
    //     });
      } else {

            let fptype = this.queryFpType(this.codeVal);

            const _this = this;
            if(fptype == "04" || fptype == "10" || fptype == "11" || fptype == "14") { // 校验码必填
            
				this.$vux.confirm.prompt('请输入发票校验码后六位', {
                    title: '发票校验码后六位',
                    inputAttrs: {
                        type: 'text'
                    },
                    onShow () {
                        _this.$vux.confirm.setInputValue(_this.lastsixVal) 
                    },
                    onCancel () {},
                    onConfirm (val) {
                        if (val && val.length == 6) {
                             _this.lastsixVal = val;
                             _this.totalAmount = "";
                             _this.$vux.loading.show({
                                text: '提交中...'
                            });
                            //获取地区汉字
                             _this.getDictNameFun( _this.codeVal);
                        }else {
                            _this.$vux.toast.show({
                                type: "text",
                                position: "middle",
                                width: "auto",
                                text: "请输入发票校验码后6位或格式错误"
                            });
                        }
                    }
                })	
                
            } else if (fptype == "01" || fptype == "03" || fptype == "15") { // 开具金额必填
                this.$vux.confirm.prompt('请输入开具金额', {
                    title: '开具金额(不记税额)',
                    inputAttrs: {
                        type: 'text'
                    },
                    onShow () {
                        _this.$vux.confirm.setInputValue(this.totalAmount) 
                    },
                    onCancel () {},
                    onConfirm (val) {
                        if (val) {
                             _this.lastsixVal = "";
                             _this.totalAmount = val;
                             _this.$vux.loading.show({
                                text: '提交中...'
                            });
                            //获取地区汉字
                             _this.getDictNameFun( _this.codeVal);
                        }else {
                            _this.$vux.toast.show({
                                type: "text",
                                position: "middle",
                                width: "auto",
                                text: "请输入开具金额(不记税额)"
                            });
                        }
                    }
                })
               
            } 

            
      }
    },
    // 根据发票代码查询发票类型编码
    queryFpType (fpCode) {
        var fpLength = fpCode.length;
        if (fpLength == 10) { // 04：增值税普通发票 01：增值税专票
            var code = fpCode.substring(7,8);
            if (code == "3" || code == "6") { // 增值税普通发票
                return "04"
            } else if(code == "1" || code == "5") { //增值税专票
                return "01"
            } else { // 错误,不支持此类型发票
                return "00"
            }
        } else if (fpLength == 12) { // 10：电子发票 11：卷式普通发票 14: 电子普通[通行费]发票 03：机动车销售统一发票 15：二手车统一发票
            var code = fpCode.substring(10,12);
            var jdcCode = fpCode.substring(0,1);
            if (jdcCode == "1") {
                return "03";
            } else {
                if (code == "11") { // 电子发票
                    return "10";
                } else if(code == "06" || code == "07") { // 卷式普通发票
                    return "11";
                } else if (code == "12") { // 电子普通[通行费]发票
                    return "14";
                } else if (code == "17") { // 二手车统一发票
                    return "15";
                } else { // 错误,不支持此类型发票
                    return "00"
                }
            }
            
        } else { // 错误,不支持此类型发票
            return "00"
        }

    },
    //获取地区汉字
    getDictNameFun (invoicedatacode) {
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
                this.setFpCheck(data.rows.dictName);
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
    //查验发票
    setFpCheck (area) {
        fpCheck({
          companyId: this.userObj.COMPANYID ? this.userObj.COMPANYID : '',
          userId: this.userObj.USERID,
          relName: this.userObj.RELNAME,
          invoiceDataCode: this.codeVal,
          invoiceNumber: this.numberVal,
          billingTime: this.dateVal,
          checkCode: this.lastsixVal,
          totalAmount: this.totalAmount,
          area: area
        }).then((data) => {
            data = data.data;        //axios返回值 放在data里
            if (data.result == 1) {
                this.$vux.loading.hide();
                this.$vux.alert.show({
                    title: '查验结果',
                    content: data.msg,
                    onShow () {},
                    onHide () {}
                });
                this.$vux.loading.show({
                    text: '消耗一次查验...'
                });
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
            if (data.result == 1) {
                // this.$vux.alert.show({
                //     title: '查验结果',
                //     content: data.msg,
                //     onShow () {},
                //     onHide () {}
                // });

                this.$router.push({
                    path: `/invoiceDetail/2/${fpId}`
                });
                // this.$router.push({
                //     path: `/homePage/totalRecord`
                // });
            }else {
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: data.msg
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
.handel-form {
  .date-chose {
    .vux-datetime-value {
      height: 2.1rem;
    }
    .vux-cell-value {
      position: absolute;
      left: 0;
    }
  }
  .tips {
    width: 100%;
    margin-top: 1.5rem;
    border: 1px dashed #e4e4e4;
    padding: 1rem 1.5rem;
    box-sizing: border-box;
    color: #999;
    .qrcodeNum:after {
      content: "";
      display: block;
      clear: both;
    }
    .qr {
      float: left;
    }
    .nums {
      float: left;
      margin-left: 2rem;
    }
    .code-color {
      color: #4ea4f4;
    }
  }
  .submit-handle {
    width: 95%;
    margin: 3rem auto;
    font-size: 1.4rem;
    text-align: center;
    color: #fff;
    background: #49a5f0;
    box-sizing: border-box;
    padding: 1rem 0;
  }
}
</style>