<template>
  <div class="register">
      <div>

          <group title="用户名">
            <x-input v-model="loginMail" required placeholder="请输入用户名"></x-input>
          </group>
          <group title="密码">
            <x-input v-model="password" required placeholder="请输入密码"></x-input>
          </group>
          <group title="真实姓名">
            <x-input v-model="relName" required placeholder="请输入真实姓名"></x-input>
          </group>

          <div class="register-in" @click="register">注册</div>
      </div>
  </div>
</template>

<script>
import { Group, XInput } from "vux";
import { register } from "@/api/login";

export default {
  components: {
    Group,
    XInput
  },
  data() {
    return {
      loginMail: "",
      password: "",
      relName: "",
      openId: ""
    };
  },
  created() {
      this.openId = localStorage.getItem('openId');
  },
  methods: {
    register() {
      if (!this.loginMail) {
        this.$vux.toast.show({
          type: "text",
          position: "top",
          width: "auto",
          text: "请输入用户名"
        });
      } else if (!this.password) {
        this.$vux.toast.show({
          type: "text",
          position: "top",
          width: "auto",
          text: "请输入密码"
        });
      } else if (!this.relName) {
        this.$vux.toast.show({
          type: "text",
          position: "top",
          width: "auto",
          text: "请真实姓名"
        });
      } else {
        this.$vux.loading.show({
            text: '注册中...'
        })
        
        // let param = {userName: this.loginMail,password: this.password};
        register({
                loginName: this.loginMail,
                password: this.password,
                relName: this.relName,
            }).then((data) => {
                this.$vux.loading.hide();
                data = data.data;        //axios返回值 放在data里
                if (data.result == 1) {

                    this.$router.replace({
                        path: `/login`
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
.register {
  margin-top: 5rem;
  .register-in {
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