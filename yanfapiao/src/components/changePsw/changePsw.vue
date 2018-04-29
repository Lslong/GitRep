<template>
  <div class="changePwd">
      <div>

          <group title="原密码">
            <x-input v-model="oldPwd" required placeholder="请输入原密码"></x-input>
          </group>
          <group title="新密码">
            <x-input v-model="newPwd" required placeholder="请输入新密码"></x-input>
          </group>
          <group title="确认密码">
            <x-input v-model="againPwd" required placeholder="请再次输入密码"></x-input>
          </group>

          <div class="changePwd-in" @click="changePwd">修改密码</div>
      </div>
  </div>
</template>

<script>
import { Group, XInput } from "vux";
import { changePwd } from "@/api/login";

export default {
  components: {
    Group,
    XInput
  },
  data() {
    return {
      loginName: "",
      userId: "",
      oldPwd: "",
      newPwd: "",
      againPwd: "",
    };
  },
  created() {
      this.loginName = this.$route.params.loginName;
      this.userId = this.$route.params.userId;
  },
  methods: {
    changePwd() {
      if (!this.oldPwd) {
        this.$vux.toast.show({
          type: "text",
          position: "top",
          width: "auto",
          text: "请输入原密码"
        });
      } else if (!this.newPwd) {
        this.$vux.toast.show({
          type: "text",
          position: "top",
          width: "auto",
          text: "请输入新密码"
        });
      } else if (!this.againPwd) {
        this.$vux.toast.show({
          type: "text",
          position: "top",
          width: "auto",
          text: "请输入确认密码"
        });
      } else {
        if (this.newPwd != this.againPwd) {
            this.$vux.toast.show({
                type: "text",
                position: "top",
                width: "auto",
                text: "两次不一致"
            });
            return false;
        }

        this.$vux.loading.show({
            text: '修改中...'
        })
        
        // let param = {userName: this.oldPwd,newPwd: this.newPwd};
        changePwd({
                loginName: this.loginName,
                userId: this.userId,
                oldPassword: this.oldPwd,
                newPassword: this.newPwd,
            }).then((data) => {
                this.$vux.loading.hide();
                data = data.data;        //axios返回值 放在data里
                if (data.result == 1) {

                    this.$vux.toast.show({
                        type: "text",
                        position: "top",
                        width: "auto",
                        text: data.msg
                    });

                    this.$router.replace({
                        path: `/mine`
                    });

                }else {
                    this.$vux.toast.show({
                        type: "text",
                        position: "top",
                        width: "auto",
                        text: data.msg
                    });
                }
            },  (err) => {
                this.$vux.loading.hide();
                this.$vux.toast.show({
                    type: "text",
                    position: "top",
                    width: "auto",
                    text: '请求数据失败，请稍后重试!'
                });
            });
      }
    }
  }
};
</script>

<style lang="less">
.changePwd {
  margin-top: 5rem;
  .changePwd-in {
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