/*
 * @Author: 高友谊 
 * @Date: 2019-06-05 14:17:23 
 * @Last Modified by: 高友谊
 * @Last Modified time: 2019-06-05 14:28:26
 */
<template>
<div class="yy-cont picking-manage">
  <V-Title>
    <el-input
			clearable
			placeholder="请输入查询内容"
      @clear="pickingOrderList(true)"
      @keyup.enter.native="$event.target.select(); pickingOrderList(true);"
			v-model.trim="form.inputValue"
			class="input-select">
	    <el-select v-model="form.selectValue" slot="prepend" placeholder="拣货单号">
	      <el-option label="拣货单号" value="pickingNum"></el-option>
	      <el-option label="包裹号" value="packageNum"></el-option>
	      <el-option label="SKU" value="sku"></el-option>
	      <el-option label="拣货人" value="pickingUserName"></el-option>
	    </el-select>
	    <el-button slot="append" icon="el-icon-search" @click="pickingOrderList(true)"></el-button>
	  </el-input>
  </V-Title>

  <div class="p-20 form-select">
    <el-date-picker
      @change="pickingOrderList()"
      v-model="form.dateTimeRange"
      type="datetimerange"
      range-separator="至"
      :default-time="['00:00:00', '23:59:59']"
      start-placeholder="开始时间"
      end-placeholder="结束时间">
    </el-date-picker>
    <el-select v-model="form.warehouseCode" filterable clearable placeholder="请选择仓库" @change="warehouseChange(); pickingOrderList();">
      <el-option
        v-for="item in warehouseList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select clearable v-model="form.orderType" placeholder="选择订单类型" @change="pickingOrderList()">
      <el-option
        v-for="item in MaBiaoObj.orderTypeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select clearable v-model="form.packageType" placeholder="选择包裹类型" @change="pickingOrderList()">
      <el-option
        v-for="item in MaBiaoObj.packageTypeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
      clearable
      v-model="form.pickingStatus"
      placeholder="选择拣货单状态"
      @change="statusChange(arguments); pickingOrderList()">
      <el-option
        v-for="item in MaBiaoObj.pickingStatusList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
      clearable
      placeholder="请选择标记"
      :disabled="form.pickingStatus != 6"
      v-model="form.diffName"
      @change="diffChange(arguments); pickingOrderList()">
      <el-option
        v-for="item in diffNameOptions"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
      placeholder="请选择差异"
      :disabled="!form.diffName"
      v-model="form.diffValue"
      @change="pickingOrderList()">
      <el-option
        v-for="item in (form.diffName ? MaBiaoObj[`${form.diffName.toHump()}List`] : [])"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <!-- <el-cascader
      clearable
      placeholder="差异"
      :options="cascaderOptions"
      @change="pickingOrderList()"
      @active-item-change="handleItemChange"
      v-model="form.diff"
    ></el-cascader> -->
    <el-select
    	clearable
      :disabled="!form.warehouseCode"
      @change="pickingOrderList()"
    	v-model="form.pickingRegion"
    	placeholder="选择拣选区域">
      <el-option
        v-for="item in pickingRegionOptions"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.areaCode"></el-option>
    </el-select>
  	<el-button type="text" @click="handleReset">重置</el-button>
  </div>
  <div class="table-container">
    <div class="pl-20 mb-10 fz12">拣货单列表</div>
    <V-Table
      class="pl-20 pr-20"
      :dataSource="dataSource"
      @sort-change="handleSort"
      @review="goDetail">
      <template slot-scope="scopes" slot="warehouseName">
        {{ filterWarehouseName(scopes.scope.row.warehouseCode, scopes.scope.row.warehouseName) }}
      </template>
    </V-Table>
    <el-pagination
      class="pt-20 pb-20"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="pickingOrderList()"
      @size-change="pickingOrderList()"
      :page-sizes="pageSizes"
      :current-page.sync="pageNum"
      :page-size.sync="pageSize"
      :total="total">
    </el-pagination>
  </div>
</div>
</template>

<script>
import { PickingManage as cols } from '@/columns'
import { query } from '@/config'

export default {
  name: 'OutgoingOperation_PickingManage',
  data () {
    let obj = {
      d1: 1,
      d2: '中山仓',
      d3: 'PL617300001',
      d4: '待拣货',
      d5: '4A',
      d6: 'B2C订单',
      d7: '单品单件',
      d8: 60,
      d9: 60,
      d10: 60,
      d11: '无差异',
      d12: '小雨',
      d13: '2019.5.1  15:00',
    }
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
        warehouseCode: '', // 仓库
        orderType: '', // 订单类型
        packageType: '', // 包裹类型
        pickingStatus: '', // 拣货单状态
        selectValue: 'pickingNum', // 右上角下拉
        inputValue: '', // 右上角输入
        dateTimeRange: '', // 时间范围
        diffName: '', // 差异名称 // differential_markers
        diffValue: '', //差异值
        diff: [], // 差异级联
        pickingRegion: '' // 拣选区域
      },
      sortParams: {}, // 排序参数
      diffNameOptions: [
        {
          dataName: '差异标记',
          dataCode: 'differential_markers',
          alias: 'differenceMark'
        },
        {
          dataName: '取消标记',
          dataCode: 'unmark',
          alias: 'cancelMark'
        }
      ],
      // cascaderOptions: [ // 差异标记/取消标记
      //   {
      //     label: '差异标记',
      //     value: 'differential_markers',
      //     children: []
      //   },
      //   {
      //     label: '取消标记',
      //     value: 'unmark',
      //     children: []
      //   }
      // ],
      pickingRegionOptions: [], // 拣选区域
      dataSource: {
        data: [],
        cols,
        isOperation: true,
        operation: {
          label: '操作',
          data: [
            {
              label: '查看', // 操作名称
              permission: '拣货查看',
              emitType: 'review', // 触发父组件
              width: 200
            }
          ]
        }
      }
    }
  },
  async created () {
    let paramsArr = this.diffNameOptions.map(item => item.dataCode) // 差异参数
    await Promise.all([
      this.getWareHouse(), // 仓库列表
      this.batchMaTableList('order_type', 'package_type', 'picking_status', paramsArr.join(',')) // 订单类型，包裹类型，拣货单状态，差异标记
    ])
    // 默认B2C订单
    this.form.orderType = (this.MaBiaoObj.orderTypeList.find(item => item.dataName.toLowerCase().indexOf('b2c') > -1) || {}).dataCode || ''
    // if (!this.cascaderOptions[0].children.length) {
    //   await this.batchBusinessType() // 获取并塞进级联数据
    // }
    this.pickingOrderList()
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
  methods: {
    async pickingOrderList (resetFlag) { // 拣货单列表
      if (resetFlag) { // 需要重置页码搜索
        this.pageNum = 1
      }
      let { pageNum: page, pageSize: row, startTime, endTime } = this
      let { diffName, diffValue, selectValue, inputValue, warehouseCode, orderType, packageType, pickingStatus, pickingRegion, dateTimeRange } = this.form // diff
      if (diffName && !diffValue) return
      let params = Object.assign({}, { page, row, [selectValue]: inputValue, warehouseCode, orderType, packageType, pickingStatus, pickingRegion }, this.sortParams, dateTimeRange ? { startTime, endTime } : {})
      if (diffName && diffValue) {
        let alias = this.diffNameOptions.find(item => item.dataCode === diffName).alias
        params[alias] = diffValue
      }
      // if (diff[0] === 'differential_markers') {
      //   params['differenceMark'] = diff[1]
      // } else if (diff[0] === 'unmark') {
      //   params['cancelMark'] = diff[1]
      // }
      const { data: resData = {} } = await this.$api.OutgoingOperation.pickingOrderList(params)
      // console.log(resData)
      const { pageInfo = {} } = resData
      let { list = [], total = null } = pageInfo
      // 以下为结果显示
      list = list.map(item => {
        if (item.pickingStatus == '1' || item.pickingStatus == '2') { // 待拣货/拣货中
          item.differenceMark = ''
          item.cancelMark = ''
        }
        return item
      })
      this.dataSource.data = list
      this.total = total
    },
    // async batchBusinessType () { // 批量获取差异类型并塞到级联
    //   let paramsArr = this.cascaderOptions.map(item => item.value)
    //   const data = await this.batchMaTableList(paramsArr.join(','))
    //   this.cascaderOptions.forEach(item => {
    //     let key = Object.keys(data).find(it => it === item.value.toHump() + 'List')
    //     item.children = data[key].map(item => ({
    //       label: item.dataName,
    //       value: item.dataCode
    //     }))
    //   })
    // },
    // async handleItemChange (val) { // 级联变动
    //   let code = val[0]
    //   let index = this.cascaderOptions.findIndex(item => item.value === code)
    //   if (this.cascaderOptions[index].children.length) return // 有值不调接口获取
    //   const { data: resData = [] } = await this.$api.BasicConfiguration.getDictCodes({ dictCodes: code })
    //   if (resData.length) {
    //     let mapData = resData[0].dictData.map(item => {
    //       return {
    //         label: item.dataName,
    //         value: item.dataCode
    //       }
    //     })
    //     this.cascaderOptions[index].children = mapData
    //   }
    // },
    handleReset () { // 重置
      this.form = this.$options.data().form
      this.pickingOrderList(true)
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
      this.pickingOrderList()
    },
    goDetail () {
      this.$router.push(`/OutgoingOperation/PickingDetail?pickingNum=${arguments[1].pickingNum}&pickingStatus=${arguments[1].pickingStatus}`)
    },
    warehouseChange () { // 仓库变化
      this.pickingRegionOptions = []
      this.getPickingAreaList()
    },
    async getPickingAreaList () { // 获取拣选区域列表
      let { warehouseCode } = this.form
      if (!warehouseCode) return
      const { data = [] } = await this.$api.OutgoingOperation.pickingAreaList({ warehouseCode })
      this.pickingRegionOptions = data
    },
    search () {
      this.pageNum = 1
      this.pickingOrderList(true)
    },
    statusChange (args) {
      if (args[0] != 6) {
        this.form.diffName = ''
        this.form.diffValue = ''
      }
    },
    diffChange (args) { // 差异变化
      if (!args[0]) {
        this.form.diffValue = ''
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
