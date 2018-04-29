<template>
  <div class="fp-checkin">
      <div>

          <group title="发票号码">
            <x-input v-model="numberVal" disabled type="number" required placeholder="请输入发票号码"></x-input>
          </group>
          <group title="凭证编号">
            <x-input v-model="codeVal" type="number" required placeholder="请输入凭证编号"></x-input>
          </group>
          <group title="入账日期" class="date-chose">
            <datetime v-model="dateVal"></datetime>
          </group>
          <div class="picBox">
              <ul class="picList">
                  <li v-for="item in localImgList" @click="prevImg">
                      <img :src="item" alt="">
                  </li>
                  <li v-if="isUpload">
                      <img src="@/assets/upload_icon.png" alt="" @click="chooseImg">
                  </li>
              </ul>
              
          </div>
          
          
          <div class="submit-handle" @click="submitHandle">提交</div>
      </div>
  </div>
</template>

<script>
import { Group, XInput, Datetime, Qrcode } from "vux";
import { getUserInfo } from "../../api/common_service";
import { updateVouApp } from "../../api/totalRecord";

export default {
  components: {
    Group,
    XInput,
    Datetime,
    Qrcode
  },
  data() {
    return {
      userObj: {},
      fpId: "",
      codeVal: "",
      numberVal: "",
      dateVal: "请输入入账日期",
      localImgList: [],
      serverImgList: [],
      isUpload: true
    };
  },
  created() {
    this.numberVal = this.$route.params.invoiceNumber ? this.$route.params.invoiceNumber : '';
    this.fpId = this.$route.params.id ? this.$route.params.id : '';
    
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
    chooseImg () {
        this.$wechat.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // this.localImgList = this.localImgList.concat(res.localIds); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                var temps = [];
                for (var i = 0; i < localIds.length; i++) {
                    if (this.localImgList.indexOf(localIds[i]) != -1) {
                        this.$vux.toast.show({
                            type: "text",
                            position: "middle",
                            width: "auto",
                            text: "此图片已添加"
                        });
                    } else {
                        temps.push(localIds[i]);
                    }
                }
                if (temps.length > 0) {
                    // this.$vux.loading.show({
                    //     text: '上传中...'
                    // });
                    this.uploadImg(temps);
                }
                
            }
        });
    },
    uploadImg (ids) {
        //上传图片，一次返回结果，再调下一次
        var id = ids.shift();
        this.$wechat.uploadImage({
            localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res) => {
                var serverId = res.serverId; // 返回图片的服务器端ID
                this.serverImgList.push(serverId);
                this.localImgList.unshift(id);

                if (ids.length > 0) {
                    this.uploadImg(ids);
                }else {
                    // this.$vux.loading.hide();
                }
                if (this.localImgList.length >= 9) {//隐藏上传图标
                    this.isUpload = false;
                }else {
                    this.isUpload = true;
                }
            },
            fail: (res) => {
                var pos = this.localImgList.indexOf(id);
                if (pos != -1) {
                    this.localImgList.splice(pos, 1);
                }
                if (ids.length > 0) {
                    this.uploadImg(ids);
                }else {
                    // this.$vux.loading.hide();
                }
            }
        });
    },
    prevImg (item) {
        this.$wechat.previewImage({
            current: item, // 当前显示图片的http链接
            urls: this.localImgList // 需要预览的图片http链接列表
        });
    },
    submitHandle() {
      if (!this.codeVal) {
        this.$vux.toast.show({
          type: "text",
          position: "middle",
          width: "auto",
          text: "请输入凭证编码"
        });
      } else if (this.dateVal == "请输入账日期") {
        this.$vux.toast.show({
          type: "text",
          position: "middle",
          width: "auto",
          text: "请输入入账日期"
        });
    //   } else if (!this.localImgList.length) {
    //     this.$vux.toast.show({
    //       type: "text",
    //       position: "middle",
    //       width: "auto",
    //       text: "请选择凭证图片"
    //     });
      } else {
        this.$vux.loading.show({
            text: '提交中...'
        });
        //凭证登记
        this.toCheckIn();
      }
    },
    //凭证登记
    toCheckIn () {
        var imgListStr = this.serverImgList.join(",");
        updateVouApp({
            mediaId: imgListStr,
            id: this.fpId,
            voucherCode: this.codeVal,
            voucherDate: this.dateVal,
            invoiceNumber: this.numberVal,

        }).then((data) => {
            this.$vux.loading.hide();
            data = data.data;        //axios返回值 放在data里
            if (data.result == 1) {
                
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: '登记成功'
                });

                this.$router.replace({
                    path: `/checkPlatform`
                });
                
            }else {
                this.$vux.alert.show({
                    title: '登记结果',
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
.fp-checkin {
  .date-chose {
    .vux-datetime-value {
      height: 2.1rem;
    }
    .vux-cell-value {
      position: absolute;
      left: 0;
    }
  }

    div.picBox{
        width: 100%;
        margin-top:2rem;
        ul.picList:after{
            content: "";
            display: block;
            clear: both;
        }
        ul.picList{
            li{
                float: left;
                width: 33%;
                height: 8rem;
                // margin-right: 1%;
                text-align: center;
                img{
                    width: 80%;
                    max-width: 8rem;
                    height: 8rem;
                }
            }
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