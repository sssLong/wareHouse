/*
* @Author: 李涛
* @describe: 物流管理/揽收商管理/揽收商详情
* @Date: 2019年7月22日10:16:36
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="揽收商详情页"></V-Title>
    </div>
    <div class="table-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="揽收商信息" name="first">
          <collect-manage-form></collect-manage-form>
        </el-tab-pane>
        <el-tab-pane label="邮寄方式" name="second">
          <V-Table :dataSource="dataSource">
            <template slot-scope="scopes" slot="isValidMethod">
              <span v-if="scopes.scope.row.isValidMethod * 1 === 1" style="color: #00A65A">已启用</span>
              <span v-else>禁用</span>
            </template>
          </V-Table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { CollectManageDetails } from './cols'
  import CollectManageForm from './CollectManageForm'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: "LogisticsManage_CollectManageDetails",
    mixins: [mixinTableModule],
    components: { CollectManageForm },
    data() {
      return {
        fromPageType: '',
        activeName: 'first',
        mixinTableModuleOptions: {
          getDataListURL: '/logistics/basic/selectMethodListByCollectorId',
          getDataListIsPage: true,
          getDataListType: 'get'
        },
        // 表格操作跳转时带过来的当前行数据
        editCurrentRow: {},
        page: 1,
        row: 10,
        // 查询条件
        dataForm: {
          collectorId: ''
        },
        dataSource: {
          data: [],
          cols: CollectManageDetails,
          isIndex: true
        }
      }
    },
    activated() {
      this.editCurrentRow = JSON.parse(this.$route.query.editCurrentRow || '{}')
      this.dataForm.collectorId = this.editCurrentRow.id
      this.activeName = 'first'
      this.getDataList()
    }
  }
</script>

<style scoped>
  .table-container /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
  }
</style>
