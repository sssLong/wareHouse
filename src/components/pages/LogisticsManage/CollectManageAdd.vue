/*
* @Author: 李涛
* @describe: 物流管理/揽收商管理/新增揽收商
* @Date: 2019年7月22日10:16:36
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="新添揽收商"></V-Title>
    </div>
    <div class="table-container">
      <collect-manage-form class="mt-15"></collect-manage-form>
    </div>
  </div>
</template>

<script>
  import CollectManageForm from './CollectManageForm'
  export default {
    name: "LogisticsManage_CollectManageAdd",
    components: { CollectManageForm },
    data() {
      return {
        fromPageType: ''
      }
    },
    created() {
      console.log(1)
      this.fromPageType = this.$route.query.type
    },
    activated() {
      console.log(4)
    },
  }
</script>

<style scoped>

</style>
