<template>
  <div class="confirm-form">
      <div>

          <group title="公司名称">
            <x-input v-model="companyName" type="text" required placeholder="请输入公司名称"></x-input>
          </group>
          <group title="手机号">
            <x-input v-model="managerPhone" type="number" required placeholder="请输入手机号"></x-input>
          </group>
          <group>
            <x-textarea max="20" placeholder="备注" v-model="remarks"></x-textarea>
          </group>
          
          
          <div class="submit-handle" @click="submitHandle">提交</div>
      </div>
  </div>
</template>

<script>
import { Group, XInput, XTextarea } from "vux";
import { getUserInfo,insertComp } from "../../api/common_service";

export default {
  components: {
    Group,
    XInput,
    XTextarea
    
  },
  data() {
    return {
      userObj: {},
      companyName: "",
      managerPhone: "",
      remarks: ""
    };
  },
  created() {
    
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((data) => {
          data = data.data;        //axios返回值 放在data里
          this.userObj = data;
          this.companyName = this.userObj.COMPANYNAME;
        },(err) => {

        }
      );
    },
    //点击认证
    submitHandle() {
      if (!this.companyName) {
        this.$vux.toast.show({
          type: "text",
          position: "middle",
          width: "auto",
          text: "请输入公司名称"
        });
      } else if (!this.managerPhone) {
        this.$vux.toast.show({
          type: "text",
          position: "middle",
          width: "auto",
          text: "请输入手机号"
        });
      } else {
        this.$vux.loading.show({
            text: '认证中...'
        });
        //认证企业
        this.setConfirm();
      }
    },
    //认证企业
    setConfirm () {
        insertComp({
            userId: this.userObj.USERID,
            companyName: this.companyName,
            managerPhone: this.managerPhone,
            remarks: this.remarks
        }).then((data) => {
            this.$vux.loading.hide();
            data = data.data;        //axios返回值 放在data里
            if (data.result == 1) {
                
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: '认证成功!'
                });

                this.$router.push({
                    path: `/mine`
                });
                
            }else {
                this.$vux.alert.show({
                    title: '认证结果',
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
.confirm-form {
  .date-chose {
    .vux-datetime-value {
      height: 2.1rem;
    }
    .vux-cell-value {
      position: absolute;
      left: 0;
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