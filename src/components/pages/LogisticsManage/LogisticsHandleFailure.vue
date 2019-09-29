/*
* @Author: 李涛
* @describe: 物流管理/物流商处理失败
* @Date: 2019年7月25日10:23:14
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="物流商问题件">
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
        <el-select v-model="dataForm.warehouseCode" placeholder="仓库" @change="search">
          <el-option v-for="item in warehouseList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <el-select v-model="dataForm.salesChannels" placeholder="平台" @change="search" clearable>
          <el-option v-for="item in platformList" :key="item.platformCode" :label="item.platformCn" :value="item.platformCode"></el-option>
        </el-select>
        <span class="reset-btn" @click="reset">重置</span>
      </div>
    </div>

    <div class="table-container">
      <div class="table-operation">
        <div class="title">物流商问题件列表</div>
        <div class="operation">
          <!--<div @click="getCollectorWaybill" v-if="btnPermission('获取运单号')">-->
            <!--<i class="iconfont iconhuoquyundanhao"></i>-->
            <!--<span>获取运单号</span>-->
          <!--</div>-->
          <div @click="getCollectorPrintLabel" v-if="btnPermission('获取面单信息')">
            <i class="iconfont iconhuoqumiandanxinxi"></i>
            <span>获取面单信息</span>
          </div>
          <div @click="getCollectorTrackingNumber" v-if="btnPermission('获取跟踪单号')">
            <i class="iconfont iconhuoqugenzongdanhao"></i>
            <span>获取跟踪单号</span>
          </div>
        </div>
      </div>
      <V-Table :dataSource="dataSource" @selection-change="dataListSelectionChangeHandle" @getCollectorWaybill="getCollectorWaybill">
        <template slot-scope="scopes" slot="salesChannels">
          {{returnStr(platformList, scopes.scope.row.salesChannels, 'platformCode', 'platformCn')}}
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
  import { LogisticsHandleFailure, testData } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: "LogisticsManage_LogisticsHandleFailure",
    mixins: [mixinTableModule],
    data() {
      return {
        mixinTableModuleOptions: {
          getDataListURL: '/outbound/order/findMailingUnder',
          getDataListIsPage: true,
          getDataListType: 'get'
        },
        page: 1,
        row: 10,
        inputContent: '',
        selected: 'packageNum',
        selectArr: [{
          label: '包裹号',
          value: 'packageNum'
        }, {
          label: '跟踪单号',
          value: 'trackingNum'
        }, {
          label: '订单号',
          value: 'orderNum'
        }],
        // 平台列表
        platformList: [],
        dataForm: {
          // 仓库编码
          warehouseCode: '',
          // 平台编码
          salesChannels: ''
        },
        dataSource: {
          data: [],
          cols: LogisticsHandleFailure,
          isIndex: true,
          isSelection: true,
          isOperation: true,
          operation: {
            label: "操作",
            width: "150",
            data: [
              {
                label: "获取运单号", // 操作名称
                emitType: "getCollectorWaybill", // 触发父组件
                permission: "获取运单号" // 后期这个操作的权限，用来控制权限
              }]
          }
        },
        maList: ['platform']
      }
    },
    created() {
      // 获取仓库
      this.getWareHouse()
      // 获取平台
      this.getPlatformList()
      // 查询
      this.search()
    },
    methods: {
      // 查询
      search() {
        let obj = {packageNum: '', trackingNum: '', orderNum: ''}
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.pageNum = 1
        this.getDataList()
      },
      getDataListCallback(res) {
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.inputContent = ''
        this.search()
      },
      // 获取平台
      async getPlatformList() {
        let res = await this.$api.LogisticsManage.getPlatformList({page: 1, row: Math.pow(10,8), isValid: 1})
        this.platformList = res.data.pageInfo.list
      },
      // 获取运单号
      getCollectorWaybill(index, row) {
        console.log(row)
        if(row.waybillNum) return this.$message.error('该包裹已有运单号!')
        this.updateOrderLogistics('Y', [row.packageNum], '获取运单号成功')
      },
      // 获取面单信息
      getCollectorPrintLabel() {
        if(!this.filterSelections()) return
        console.log('多选', this.dataListSelections)
        let data = this.dataListSelections.filter(value => !value.printUrl && value.waybillNum).map(value => value.packageNum)
        if(data.length === 0) return this.$message.error('您所选的包裹没有运单号或已有面单信息!')
        this.updateOrderLogistics('M', data, '获取面单信息成功!')
      },
      // 获取跟踪号
      getCollectorTrackingNumber() {
        if(!this.filterSelections()) return
        console.log('多选', this.dataListSelections)
        let data = this.dataListSelections.filter(value => !value.trackingNum && value.waybillNum).map(value => value.packageNum)
        if(data.length === 0)  return this.$message.error('您所选的包裹没有运单号或已有跟踪单号!')
        this.updateOrderLogistics('G', data, '获取跟踪单号成功!')
      },
      // 修改订单物流信息
      async updateOrderLogistics(type, data, msg) {
        let res = await this.$api.LogisticsManage.updateOrderLogistics(type, data)
        console.log(res)
        if(res.errorCode === '100200') {
          this.$message.success(msg)
          this.search()
        }
      },
      // 格式化内容
      returnStr(arr, rowId, valueId = 'dataCode', name = 'dataName') {
        if (!Array.isArray(arr)) return
        let data = arr.find(value => rowId == value[valueId])
        return data ? data[name] : null
      }
    }

  }
</script>

<style scoped>

</style>
