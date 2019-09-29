/*
* @Author: 李涛
* @describe: 物流管理/揽收商管理
* @Date: 2019年7月22日10:16:36
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="揽收商管理">
        <div class="search-content">
          <el-input clearable placeholder="请输入查询内容" v-model.trim="inputContent" @keyup.native.enter="search" @clear="search">
            <el-select v-model="selected" slot="prepend" placeholder="请选择" class="iconfont" style="width: 130px">
              <el-option v-for="item in selectArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </V-Title>
      <div class="condition">
        <el-select v-model="dataForm.isValid" placeholder="状态" @change="search">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="2"></el-option>
        </el-select>
        <span class="reset-btn" @click="reset">重置</span>
      </div>
    </div>

    <div class="table-container">
      <div class="table-operation">
        <div class="title">揽收商列表</div>
        <div class="operation">
          <div @click="addHandle" v-if="btnPermission('新添揽收商')">
            <i class="iconfont iconchuangjianqiaban"></i>
            <span>新添揽收商</span>
          </div>
        </div>
      </div>
      <V-Table :dataSource="dataSource" @lookHandle="lookHandle" @editHandle="editHandle">
        <template slot-scope="scopes" slot="status">
          <el-switch v-model="scopes.scope.row.status" @change="toggleStatus(scopes.scope.row)"></el-switch>
        </template>
      </V-Table>

      <!--数据分页-->
      <el-pagination
        class="p-20"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>


  </div>
</template>

<script>
  import { CollectManage } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: "LogisticsManage_CollectManage",
    mixins: [mixinTableModule],
    data() {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: '/logistics/basic/selectCollector',
          getDataListIsPage: true,
          getDataListType: 'get'
        },
        page: 1,
        row: 10,
        inputContent: '',
        selected: 'collectorName',
        selectArr: [{
          label: '揽收商名称',
          value: 'collectorName'
        }, {
          label: '揽收商编码',
          value: 'collectorCode'
        }],
        // 查询条件
        dataForm: {
          isValid: ''
        },
        dataSource: {
          data: [],
          cols: CollectManage,
          isIndex: true,
          isOperation: true,
          operation: {
            label: '操作',
            data: [{
              label: '查看',
              emitType: 'lookHandle',
              permission: '揽收商详情'
            }, {
              label: '修改',
              emitType: 'editHandle',
              permission: '揽收商详情'
            }]
          }
        }
      }
    },
    created() {
      this.search()
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 查询
      search() {
        let obj = {collectorName: '', collectorCode: ''}
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.pageNum = 1
        this.getDataList()
      },
      // 查询后的回调函数
      getDataListCallback() {
        this.dataSource.data.forEach(value => {
          this.$set(value, 'status', value.isValid === 1)
        })
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.inputContent = ''
        this.search()
      },
      // 切换启用状态
      toggleStatus(row) {
        row.status = !row.status
        let str1 = row.status ? '启用' : '禁用'
        let str2 = !row.status ? '启用' : '禁用'
        this.$confirm(`当前状态为${str1}, 是否确定${str2}该揽收商状态?`, '提示', {
          type: 'warning',
          customClass: 'v-confirm'
        }).then( async () => {
          let params = {...row}
          // 删除用于显示开关的自定义属性
          delete params.status
          params.isValid = row.status ? 2 : 1
          let res = await this.$api.LogisticsManage.addOrEditCollector(params)
          if (res.errorCode === '100200'){
            this.$utils.commonUtils.tip(`${str2}揽收商成功`,'success')
            this.search()
          }
        })
      },
      // 新增操作
      addHandle() {
        this.$router.push('/LogisticsManage/CollectManageAdd?fromPageType=add')
      },
      // 查看操作
      lookHandle(index, row) {
        this.$router.push({
          path: '/LogisticsManage/CollectManageDetails',
          query: {
            fromPageType: 'look',
            editCurrentRow: JSON.stringify(row)
          }
        })
      },
      // 修改操作
      editHandle(index, row) {
        this.$router.push({
          path: '/LogisticsManage/CollectManageDetails',
          query: {
            fromPageType: 'edit',
            editCurrentRow: JSON.stringify(row)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
