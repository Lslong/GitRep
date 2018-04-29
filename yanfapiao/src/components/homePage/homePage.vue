<template>
  <div class="home-page">
    <l-tab></l-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import LTab from '@/components/l-tab/l-tab'

  export default {
    components: {
      LTab
    }
  }
</script>

<style lang="less">
.home-page{
    // padding-top: 30px;
}
</style>