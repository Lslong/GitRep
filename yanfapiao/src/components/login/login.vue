<template>
  <div class="login">
      <div>

          <group title="用户名">
            <x-input v-model="loginMail" required placeholder="请输入用户名"></x-input>
          </group>
          <group title="密码">
            <x-input v-model="password" required placeholder="请输入密码"></x-input>
          </group>

          <div class="login-in" @click="login">登录</div>
          <div class="to-register" @click="toRegister" style="display:none"><span>注册</span></div>
      </div>
  </div>
</template>

<script>
import { Group, XInput } from "vux";
import { login } from "@/api/login";

export default {
  components: {
    Group,
    XInput
  },
  data() {
    return {
      loginMail: "",
      password: "",
      openId: "",
      state: ""
    };
  },
  created() {
        this.openId = localStorage.getItem('openId');
        this.state = this.$route.params.state;

  },
  methods: {
    login() {
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
      } else {
        this.$vux.loading.show({
            text: '登录中...'
        })
        
        // let param = {userName: this.loginMail,password: this.password};
        login({
                loginName: this.loginMail,
                password: this.password,
                openId: this.openId
            }).then((data) => {
                this.$vux.loading.hide();
                data = data.data;        //axios返回值 放在data里
                if (data.result == 1) {
                    localStorage.setItem('token',data.rows.token);

                    //根据微信菜单选择跳转不同页面  1-发票验证  2-查验平台  3-发票仓库  4-登录注册  5-企业设置
                    if (this.state == 1 || this.state == 4) {
                        this.$router.replace({
                            path: `/homePage/checkType`
                        });
                    }else if (this.state == 2) {
                        this.$router.replace({
                            path: `/checkPlatform`
                        });
                    }else if (this.state == 3) {
                        this.$router.replace({
                            path: `/fpWarehouse`
                        });
                    }else if (this.state == 5) {
                        this.$router.replace({
                            path: `/mine`
                        });
                    }

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
    },
    toRegister () {
        this.$router.push({
            path: `/register`
        });
    }
  }
};
</script>

<style lang="less">
.login {
  margin-top: 5rem;
  .login-in {
    width: 95%;
    margin: 3rem auto;
    font-size: 1.4rem;
    text-align: center;
    color: #fff;
    background: #49a5f0;
    box-sizing: border-box;
    padding: 1rem 0;
  }
  .to-register{
      text-align: center;
      color:#555;
      font-size: 1.4rem;
      font-weight: 900;
  }
}
</style>