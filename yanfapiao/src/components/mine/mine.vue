<template title="企业设置">
    <div class="mine" :style="{height:screenHeight+'px'}">
        <div class="mine-info">
            <p>你好，{{userObj.RELNAME}}</p>
            <img :src="headerPic" alt="企业图标" class="company-icon">
            <p class="company-confirm" @click="toConfirm">{{userObj.COMPANYID ? '已认证企业' : '去认证企业'}}</p>
            <p class="company-name">{{userObj.COMPANYNAME}}</p>

        </div>
        <div class="fp-num">
            <p class="fp-num-title">剩余发票总数：</p>
            <p class="company-num">剩余
                <span style="color:#2882AD">{{checkNum}}</span> /张</p>
        </div>
        <ul class="mine-menu" style="display:none">
            <li>企业信息</li>
            <li>我的发票</li>
        </ul>
        <div class="changePwd" @click="changePwd">修改密码</div>
        <div class="loginOutBtn" @click="outLogin">退出账号</div>
    </div>
</template>

<script type="text/ecmascript-6">
import { getUserInfo, outBind } from "../../api/common_service";
import { getCheckNum } from "../../api/totalRecord";

export default {
    components: {},
    data() {
        return {
            screenHeight: screen.height,
            userObj: {},
            checkNum: 0,
            headerPic: '',
            iconY: require('@/assets/confirm_yes.png'),
            iconN: require('@/assets/confirm_no.png'),
        };
    },
    created() {
        this.getUserInfo();

    },
    methods: {
        //解除绑定
        outLogin() {
            const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
            this.$vux.confirm.show({
                title: '操作提示',
                content: '确定退出该账号?',
                // 组件除show外的属性
                onCancel () {
                    
                },
                onConfirm () {

                    outBind({
                        loginName: _this.userObj.LOGINNAME
                    }).then(data => {
                        data = data.data;
                        if (data.result == 1) {
                            _this.$vux.toast.show({
                                type: "text",
                                position: "middle",
                                width: "auto",
                                text: data.msg
                            });
                            localStorage.setItem("token", "");
                            _this.$router.replace({
                                path: `/login/5`
                            });
                        }
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
                    text: "请重新登录"
                });
                this.$router.push({
                    path: `/login`
                });
                return false;
            }

            getUserInfo().then(
                data => {
                    data = data.data; //axios返回值 放在data里

                    if (data.result == 0) {
                        this.$vux.toast.show({
                            type: "text",
                            position: "middle",
                            width: "auto",
                            text: "请重新登录"
                        });
                        this.$router.push({
                            path: `/login`
                        });
                    } else {
                        this.userObj = data;
                        localStorage.setItem('openId',data.OPENID);
                        if (this.userObj.PHOTO) {
                            this.headerPic = this.userObj.PHOTO;
                        }else {
                            this.headerPic = this.userObj.COMPANYID ? this.iconY : this.iconN
                        }
                        //获取剩余次数
                        this.getCheckNum();
                        
                    }
                },
                err => {}
            );
        },
        //获取剩余次数
        getCheckNum() {
            getCheckNum({
                companyId: this.userObj.COMPANYID ? this.userObj.COMPANYID : "",
                userId: this.userObj.USERID ? this.userObj.USERID : ""
            }).then(
                data => {
                    data = data.data; //axios返回值 放在data里
                    if (data.result == 1) {
                        this.checkNum = data.rows.fpCheckNum;
                    } else {
                        this.$vux.toast.show({
                            type: "text",
                            position: "middle",
                            width: "auto",
                            text: data.msg
                        });
                    }
                },
                err => {}
            );
        },
        //去认证企业
        toConfirm () {
            if (this.userObj.COMPANYID) {
                this.$vux.toast.show({
                    type: "text",
                    position: "middle",
                    width: "auto",
                    text: '企业已认证通过'
                });
            }else {
                this.$router.push({
                    path: `/toConfirm`
                });
            }
        },
        changePwd () {
            this.$router.push({
                path: `/changePsw/${this.userObj.LOGINNAME}/${this.userObj.USERID}`
            });
        }
    }
};
</script>

<style lang="less">
li {
    list-style: none;
}
.clearfix:after {
    content: "";
    display: block;
    clear: both;
}

.mine {
    background: #f8f8f8;
    .mine-info {
        // height: 25rem;
        width: 85%;
        margin: 2rem auto;
        padding: 1rem;
        background: #fff;
        border: 1px solid transparent;
        .company-icon {
            width: 6rem;
            height: 6rem;
            border-radius: 50%;
            margin: 2rem auto;
            display: block;
        }
        .company-confirm {
            width: 12rem;
            margin: 0 auto 2rem;
            text-align: center;
            color: #333;
            border: 1px solid #333;
            border-radius: 1.5rem;
            padding: 0.5rem;
        }
        .company-name {
            font-size: 1.3rem;
            text-align: center;
        }
    }
    .fp-num {
        width: 85%;
        margin: 2rem auto;
        padding: 1rem;
        background: #fff;
        border: 1px solid transparent;
        .fp-num-title {
            text-align: left;
        }
        .company-num {
            font-size: 1.3rem;
            text-align: center;
            span {
                font-size: 5rem;
            }
        }
    }
    .mine-menu {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
    }
    .mine-menu li {
        width: 50%;
        text-align: center;
        padding: 1rem 2rem;
        box-sizing: border-box;
        border: 1px soild #ddd;
    }
    .loginOutBtn {
        width: 85%;
        text-align: center;
        margin: 1rem auto;
        padding: 1rem;
        background: #fff;
        border: 1px solid transparent;
        color: #f00;
        font-size: 1.5rem;
        font-weight: 700;
    }
    .changePwd {
        width: 85%;
        text-align: center;
        margin: 1rem auto;
        padding: 1rem;
        background: #fff;
        border: 1px solid transparent;
        color: #333;
        font-size: 1.5rem;
        font-weight: 700;
    }
}
</style>