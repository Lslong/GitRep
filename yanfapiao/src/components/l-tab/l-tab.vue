<template>
    <div class="l-tab">
        <router-link tag="div" class="tab-item" to="/homePage/checkType">
            <span class="tab-link">选择验证方式</span>
        </router-link>
        <router-link tag="div" class="tab-item" to="/homePage/totalRecord">
            <span class="tab-link">全部记录</span>
        </router-link>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    components: {},
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>

<style lang="less">
.l-tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: 1.4rem;
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    background: #f8f8f8;
    .tab-item {
        flex: 1;
        text-align: center;
        .tab-link {
            padding-bottom: 5px;
            color: #666;
        }
    }
    .router-link-active {
        .tab-link {
            // color: #00bbee;
            color: #3879d9;
        }
        border-bottom: 2px solid #00bbee;
        // border-bottom: 2px solid #3879d9;
    }
}
</style>