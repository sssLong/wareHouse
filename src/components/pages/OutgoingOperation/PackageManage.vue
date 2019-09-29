/*
* @Author: 李涛
* @describe: 出库作业/集包管理
* @Date: 2019年6月4日11:19:12
* 问题： 开始时间和结束时间选择，揽收商接口
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="集包管理">
        <div class="search-content">
          <el-input
            clearable
            @clear="packageOrderList(true)"
            @keyup.native.enter="$event.target.select(); packageOrderList(true);"
            placeholder="请输入查询内容"
            v-model.trim="form.inputValue"
            class="input-with-select">
            <el-select
              v-model="form.selectValue"
              @change="form.inputValue = ''"
              placeholder="请选择"
              class="iconfont icon-xiala selectShelf"
              slot="prepend">
              <el-option label="集包单号" value="packageOrderNum"></el-option>
              <el-option label="集包人" value="packageUserName"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="packageOrderList(true)"></el-button>
          </el-input>
        </div>
      </V-Title>

      <div class="condition" style="flex-flow: wrap;">
        <el-select v-model="form.timeType" style="width: 140px;">
          <el-option label="集包开始时间" value="Y"></el-option>
          <el-option label="集包结束时间" value="N"></el-option>
        </el-select>

        <el-date-picker
          @change="packageOrderList()"
          class="dataTime"
          v-model="form.dateTimeRange"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>

        <el-select clearable filterable v-model="form.warehouseCode" placeholder="选择仓库" @change="packageOrderList()">
          <el-option
            v-for="item in warehouseList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode">
          </el-option>
        </el-select>
        <el-select clearable v-model="form.orderType" placeholder="选择订单类型" style="width: 140px;" @change="packageOrderList()">
          <el-option
            v-for="item in MaBiaoObj.orderTypeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode">
          </el-option>
        </el-select>
        <el-select clearable v-model="form.packageStatus" placeholder="选择集包单状态" style="width: 160px;" @change="packageOrderList()">
          <el-option
            v-for="item in MaBiaoObj.collectPackageStatusList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode">
          </el-option>
        </el-select>
        <el-select clearable filterable v-model="form.receiver" placeholder="选择揽收商" @change="packageOrderList()">
            <el-option
                v-for="item in collectorList"
                :label="item.collectorName"
                :value="item.collectorName"
                :key="item.collectorCode">
            </el-option>
        </el-select>
        <el-button type="text" @click='handleReset'>重置</el-button>
      </div>

      <div class="table-container">
        <div class="table-operation">
          <div class="title">集包单列表</div>
          <el-button type="text" :disabled="!multipleSelection.length" @click="createDeliveryOrder">创建发货单</el-button>
        </div>
        <!-- 引入表格公共组件 START -->
        <V-Table
          :dataSource="dataSource"
          @selection-change="handleSelectionChange"
          @sort-change="handleSort"
          @details="handleDetails"
          @continue="handlePackage"
          @disband="handleDisband">
          <template slot-scope="scopes" slot="warehouseName">
            {{ filterWarehouseName(scopes.scope.row.warehouseCode, scopes.scope.row.warehouseName) }}
            <!-- {{ scopes.scope.row.warehouseName || warehouseList.find(item => item.dataCode === (scopes.scope.row.warehouseCode) || {}).dataName || '' }} -->
          </template>
        </V-Table>
        <!-- 引入表格公共组件 END -->
        <div class="block">
          <el-pagination
            class="pt-20 pb-20"
            @size-change="packageOrderList()"
            @current-change="packageOrderList()"
            :current-page.sync="pageNum"
            :page-sizes="pageSizes"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { PackageManage } from '@/columns'
  import { query } from '@/config'
  import { TOGGLE_DISBAND_FLAG } from '@/store/mutation-types'
  
  export default {
    name: 'OutgoingOperation_PackageManage',
    data() {
      return {
        total: null, // 列表总数，默认设置null和0有区别
        pageNum: 1,
        pageSize: query.limit,
        pageSizes: [
          query.limit,
          query.limit * 2,
          query.limit * 5,
          query.limit * 10,
          query.limit * 20
        ],
        form: {
          dateTimeRange: '', // 时间范围
          warehouseCode: '', // 仓库
          orderType: '', // 订单类型
          packageStatus: '', // 集包单状态
          receiver: '', // 揽货商
          inputValue: '', // 右上角选择
          selectValue: 'packageOrderNum', // 右上角选择
          timeType: 'Y' // 集包开始/结束时间
        },
        sortParams: {}, // 排序参数
        collectorList: [], // 揽收商
        dataSource: {
          data: [], // 表格数据
          cols: PackageManage, // 表格的列数据
          isSelection: true, // 表格有多选时设置
          selectionWidth: 30,
          isOperation: true, // 表格有操作列时设置
          operation: { // 表格有操作列时设置
            label: '操作', // 列名
            width: '200', // 根据实际情况给宽度
            data: [
              {
                label: '查看', // 操作名称
                emitType: 'details', // 触发父组件
                permission: '集包查看', // 后期这个操作的权限，用来控制权限
              },{
                label: '继续集包', // 操作名称
                disableKey: 'continueDisable', // 禁用继续按钮
                emitType: 'continue', // 触发父组件
                permission: '继续集包', // 后期这个操作的权限，用来控制权限
              },{
                label: '解散', // 操作名称
                disableKey: 'disbandDisable', // 禁用解散按钮
                emitType: 'disband', // 触发父组件
                permission: '解散', // 后期这个操作的权限，用来控制权限
              },
            ]
          }
        },
        multipleSelection: []
      }
    },
    computed: {
      startTime () {
        if (!this.form.dateTimeRange) return ''
        return this.$utils.commonUtils.format(this.form.dateTimeRange[0], 'YYYY-MM-DD HH:mm:ss')
      },
      endTime () {
        if (!this.form.dateTimeRange) return ''
        return this.$utils.commonUtils.format(this.form.dateTimeRange[1], 'YYYY-MM-DD HH:mm:ss')
      }
    },
    async created() {
      await Promise.all([
        this.getWareHouse(), // 仓库列表
        this.getSelectCollector(), // 揽收商
        this.batchMaTableList('order_type', 'collect_package_status', 'package_status') // 订单类型，集包单状态，单据状态/包裹状态
      ])
      // 默认B2C订单
      this.form.orderType = (this.MaBiaoObj.orderTypeList.find(item => item.dataName.toLowerCase().indexOf('b2c') > -1) || {}).dataCode || ''
      this.packageOrderList()
    },
    methods: {
      async packageOrderList (pageReset) { // 集包单列表
        if (pageReset) {
          this.pageNum = 1
        }
        let { pageNum: page, pageSize: row, startTime, endTime } = this
        let { warehouseCode, orderType, packageStatus, receiver, selectValue, inputValue, timeType } = this.form
        let params = Object.assign({}, { page, row, startTime, endTime, warehouseCode, orderType, packageStatus, receiver, timeType, [selectValue]: inputValue }, this.sortParams)
        const { data: resData = {} } = await this.$api.OutgoingOperation.packageOrderList(params)
        const { pageInfo = {} } = resData
        const { list = [], total = null } = pageInfo
        this.dataSource.data = list.map(item => {
          item.packageWeightSum = this.$utils.commonUtils.numDiv(item.packageWeightSum, 1000)
          if (item.packageStatus && item.packageStatus > 1) {
            item.continueDisable = true // 禁用继续按钮
          }
          if (!item.packageStatus || item.packageStatus > 2) {
            item.disbandDisable = true // 禁用解散按钮
          }
          return item
        })
        this.total = total
      },
      async createDeliveryOrder () { // 创建发货单
        const { errorCode } = await this.$api.OutgoingOperation.createDeliveryOrder(this.multipleSelection)
        if (errorCode === '100200') {
          this.$utils.commonUtils.tip('创建发货单成功', 'success')
          this.packageOrderList()
        }
      },
      search() {
        this.packageOrderList(true)
      },
      handleReset () { // 重置
        this.form = this.$options.data().form
        this.packageOrderList(true)
      },
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val.map(item => item.packageOrderNum)
      },
      handleSort ({ prop, order }) { // 排序变化
        if (prop) { // 没有排序直接获取
          let sort = order === 'descending' ? 'desc' : 'asc' // 降序0，升序1
          this.sortParams = {
            sortName: prop,
            sortType: sort
          }
        } else {
          this.sortParams = {}
        }
        this.packageOrderList()
      },
      handleDetails() { // 查看
        let packageOrderNum = arguments[1].packageOrderNum
        this.$router.push(`/OutgoingOperation/PackageManageDetails?packageOrderNum=${packageOrderNum}`)
      },
      handlePackage () { // 继续集包
        let data = arguments[1]
        let packageOrderNum = data.packageOrderNum
        let packageStatus = ~~data.packageStatus
        // if (packageStatus > 1) { // 1集包中、2集包完成、3待发货、4发货完成、5发货失败
        //   this.$router.push('/OutgoingOperation/PackageWeigh')
        // } else {
        //   this.$router.push(`/OutgoingOperation/PackageWeigh?packageOrderNum=${packageOrderNum}`)
        // }
        this.$router.push(`/OutgoingOperation/PackageWeigh?packageOrderNum=${packageOrderNum}`)
      },
      async getSelectCollector () { // 获取揽收商列表
        const { data = {} } = await this.$api.LogisticsManage.getSelectCollector({
          page: 1,
          row: 999999
        })
        const { pageInfo = {} } = data
        const { list = [] } = pageInfo
        this.collectorList = list
      },
      async handleDisband () { // 解散
        let packageOrderNum = arguments[1].packageOrderNum
        const { errorCode } = await this.$api.OutgoingOperation.disbandPackage({ packageOrderNum })
        if (errorCode === '100200') {
          this.$utils.commonUtils.tip('解散成功', 'success')
          this.packageOrderList()
          this.$store.commit(TOGGLE_DISBAND_FLAG)
        }
      },
      filterWarehouseName (code, name) {
        if (name) return name
        let theOne = this.warehouseList.find(item => item.dataCode === code)
        return (theOne || {}).dataName || ''
      }
    }
  }
</script>

<style>
.selectShelf .el-input--suffix input {
  width: 120px;
}
</style>

