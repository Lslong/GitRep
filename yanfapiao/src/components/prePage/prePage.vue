<template>
  <div class="pre-page" v-bind:style="{height:screenHeight+'px'}">
      <div class="animation-center">
        <spinner type="lines" size="70"></spinner>
      </div>
      <!-- <p @click="login" style="text-align:center;color:#fff;font-size:2rem;margin-bottom:2rem;">登陆</p>
      <p @click="toIndex" style="text-align:center;color:#fff;font-size:2rem;">首页</p> -->
  </div>
</template>

<script>

import { Spinner, Group, Cell } from 'vux'
import {isBind,wxSign} from '../../api/common_service'

export default {
  components: {
    Spinner,
    Cell,
    Group
  },
  data() {
    return {
      screenHeight: screen.height,
    };
  },
  created() {
      this.isBind();
      //获取微信签名
      wxSign();
  },
  methods: {
    login () {
        this.$router.push({
            path: `/login`
        });
    },
    toIndex () {
        this.$router.push({
            path: `/homePage/checkType`
        });
    },
    //获取URL参数
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象  
        var r = window.location.search.substr(1).match(reg);  // 匹配目标参数  
        if (r != null) return unescape(r[2]); return null; // 返回参数值  
    },  
    //判断是否绑定微信
    isBind () {
        let code = this.getUrlParam('code');
        let state = this.getUrlParam('state');
        localStorage.setItem('state',state);

        isBind({
            code: code
        }).then((data) => {
            data = data.data;        //axios返回值 放在data里
            if (data.result == 1) {         //code正确 未绑定 进登陆页面
                localStorage.setItem('openId',data.rows.openId);
                this.$router.replace({
                    path: `/login/${state}`
                });
            }else if (data.result == 2) {   //绑定 直接进主页
                localStorage.setItem('token',data.rows.token);

                //根据微信菜单选择跳转不同页面  1-发票验证  2-查验平台  3-发票仓库  4-登录注册  5-企业设置
                if (state == 1 || state == 4) {
                    this.$router.replace({
                        path: `/homePage/checkType`
                    });
                }else if (state == 2) {
                    this.$router.replace({
                        path: `/checkPlatform`
                    });
                }else if (state == 3) {
                    this.$router.replace({
                        path: `/fpWarehouse`
                    });
                }else if (state == 5) {
                    this.$router.replace({
                        path: `/mine`
                    });
                }
            }else {                         //code错误  进500页面
                this.$router.replace({
                    path: `/page500`
                });
            
            }
        },(err) => {
            this.$vux.toast.show({
                type: "text",
                position: "top",
                width: "auto",
                text: "请求数据失败，请稍后重试!"
            });
        })
    }
  }
};
</script>

<style lang="less">
    .pre-page{
        background: #49A5F0;
        .vux-spinner{
            stroke: #fff;
            fill: #fff;
        }
        .vux-spinner svg{
            position: fixed;
            top: 40%;left: 50%;
            margin-top: -35px;
            margin-left: -35px;
        }
    }
</style>